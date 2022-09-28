const User = require('../model/user')
const {StatusCodes} = require('http-status-codes')
const customError = require('../errors')
const bcrypt = require('bcryptjs')
const sgMail = require('@sendgrid/mail')
const OTP = require('../model/otp');


const register = async(req,res) =>{
    const {name,email,password} = req.body
    
    const user = await User.create(req.body)

    res.status(StatusCodes.CREATED).json({Users:{user:user._id,name:user.name}})
}

const loginUser = async(req,res) =>{
    const {email,password} = req.body

    if(!email || !password){
       throw new customError.UnauthenticatedError('Please provide valid credentials')
    }

    const user = await User.findOne({email})

    if(!user){
        throw new customError.NotFoundError('User not found please register')
    }

    const comparedPassword = await user.compares(password)

    if(!comparedPassword){
        throw new customError.UnauthenticatedError('please provide valid credentials')
    }

    const token = user.Createjwt()

    res.status(StatusCodes.OK).json({user:{user:`${user.name} logged in with id${user._id}`},token})
}

const sendEmail = async (req,res) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const {email} = req.body;
    const checkUser = User.findOne({email});
    if (checkUser) {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

      const salt = 10
      const hashedOTP = await bcrypt.hash(otp,salt);

      const msg = {
        to: email, 
        from: 'Marvelloussolomon49@gmail.com', 
        subject: ' Carginie OTP Verication',
        text: 'Notify Email Verification',
        html: `Verify your Account by using this OTP <b>${otp}</b> in your app`,
      }

      const currentTime = new Date().getTime();

      const savedOTP = new OTP({
        otp:hashedOTP,
        email: email,
        createdWhen: `${currentTime}`,
        expiresWhen: `${currentTime + 120000}`
      })

      await savedOTP.save()
      sgMail.send(msg);

      res.status(StatusCodes.OK).json({status:'PENDING',msg:'Verication OTP sent to Email'})
    } 
  }
    catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({status:'FAILED',msg:'Verication FAILED to send to Email'})
    console.log(error)
  }
}

const sendOTP = async(req,res) =>{
  const {email} = req.body;
  const checkOTPUser = await OTP.findOne({email});
  
  if (checkOTPUser) {
    await OTP.deleteOne({email});
    sendEmail(req,res);
  } else {
    sendEmail(req,res)
    res.status(StatusCodes.OK).json({status:'PENDING',msg:'Verication OTP sent to Email'})
  }
}




const verifyOTP = async(req,res) =>{
    const {email,otp} = req.body
    
    if(!email || !otp){
      throw new customError.NotFoundError('please provide valid credentials')
    }else{
      const user = await User.findOne({email})
      const otpUser = await OTP.findOne({email})

      if(!user){
        throw new customError.NotFoundError('User not found')
      }else{
        
        const otpVerify = otpUser.otp
        const userLL = await bcrypt.compare(otp,otpVerify);
        const exp = otpUser.expiresWhen;
          
        if(Number(exp) > Number(Date.now()) && userLL ){
          const token = user.Createjwt()
           res.status(StatusCodes.OK).json({msg:'User Verified!',AccessToken:token});

         } else {
           await OTP.deleteMany({email})
           res.status(StatusCodes.BAD_REQUEST).json({msg:'User OTP expired'})
        }

      }
      
      
    }
   
}








module.exports = {
    register,
    loginUser,
    sendOTP,
    verifyOTP
}