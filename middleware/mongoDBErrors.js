const {StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = (req,res,next) =>{
   const customError ={
     statuscode:err.statuscode || StatusCodes.INTERNAL_SERVER_ERROR,
     msg:err.message || 'Something went wrong try again later'
   }

   if(err.name === "ValidationError"){
     customError.msg = Object.values(err.errors).map((item)=> item.message).join('and')
     customError.statuscode = 400
   }

   if(err.code && err.code === 11000){
    customError.msg = `duplicate Error caused by ${Object.keys(err.keyValue)},please try something new`
    customError.statuscode = 401
   }

   if(err.name === "castError"){
     customError.msg = `No Item with Id ${err.value}`
     customError.statuscode = 404
   }

   res.status(customError.statuscode).json({msg:customError.msg})
}

module.exports = errorHandlerMiddleware