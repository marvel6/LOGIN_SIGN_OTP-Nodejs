const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const OtpSchema = new mongoose.Schema({
   userId:String,
   otp:String,
   email:String,
   createdWhen:String,
   expiresWhen:String
});



OtpSchema.methods.compares = async function(value){
   const isMatch = await bcrypt.compare(value,this.otp)
  return isMatch
}

module.exports = mongoose.model('Users',OtpSchema)