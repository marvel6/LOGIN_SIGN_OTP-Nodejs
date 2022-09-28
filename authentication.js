const jwt = require('jsonwebtoken')
//const User = require('../models/User')
const {UnauthenticatedError} = require('../errors')


const auth = async(req,res,next)=>{
  const authHeader = req.headers.authorization

  if(!authHeader || !authHeader.startsWith('Bearer')){
     throw new UnauthenticatedError('Invalid authentication')
  }

  const token = authHeader.split(' ')[1]

  try{
    const verify = jwt.verify(token,process.env.JWT_SECRET)
    req.user = {userId:verify.userId,name:verify.name}
     next()
  }catch(error){
    throw new UnauthenticatedError('Invalid authentication')
  }
}

module.exports = auth