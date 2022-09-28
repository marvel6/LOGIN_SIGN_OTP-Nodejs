const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userReg = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ,'please provide a new email'],
        unique:true,
    },
    password:{
        type:String,
        required:true,
        maxLength:200,
    },
    verified:false

},{timestamps:true});


userReg.pre('save',async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

userReg.methods.Createjwt = function(){
    return jwt.sign({id:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.LASTING})
}


userReg.methods.compares = async function(value){
    const isMatch = await bcrypt.compare(value,this.password)
   return isMatch
}





module.exports = mongoose.model('userRegistration',userReg)