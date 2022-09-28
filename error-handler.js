const { StatusCodes } = require('http-status-codes')



const errorHandlerMiddleware = (err, req, res, next) => {

  const customError = {
    statusCode:err.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'something went wrong try again later'
  }

if(err.name === 'ValidationError'){
  customError.msg = Object.values(err.errors).map((items) => items.message).join(' and ')
  customError.statusCode = 400
}

  if(err.code && err.code === 11000){
    customError.msg = `Error caused in duplicate by ${Object.keys(err.keyValue)},please input something new`
    customError.statusCode = 400
  }
  

  if(err.name === "castError"){
    customError.msg = `no item found with Id ${err.value}`
    customError.statusCode = 404
  }
  
   res.status(customError.statusCode).json({msg:customError.msg})

}

module.exports = errorHandlerMiddleware
