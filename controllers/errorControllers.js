const AppError = require("../utils/AppError")

const sendErrorDev = (err,res) => {
    console.log("sendErrorDev ",err.statusCode);
    
    return res.status(err.statusCode).json({
        status : err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err,res) => {

    // create by AppError ==> true
    if(err.isOperational){
        return res.status(err.statusCode).json({
            status : err.status,
            message: err.message,
        })

    // else
    }else{
        console.error('ERROR 💥', err);

        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
          });
    }
}

const handleCastErrorDB = (err) => {
    console.log("CastError");
    const message = "invalid " + err.path + " : " + err.value;
    return new AppError(message,400)
}

const handleDuplicateFields = (err) => {
    console.log("duplicate fields");
    let message = "duplicate value ==> ";
    let d = Object.values(err.keyValue);
    d.forEach(el => {
        message += el + " .";
    })
    
    return new AppError(message,400)
    
}


const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    
    const message = errors.join(". ");
    
    return new AppError(message,400)
}
module.exports = (err,req,res,next) => {
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // =================================================
   
    console.log("===============================");
    
    if(process.env.NODE_ENV === "development"){
        
        let error = {...err};
        error.message = err.message
        error.stack = err.stack
        error.errors = err.errors
        if(err.name === "CastError") error = handleCastErrorDB(error);
        if(err.code === 11000)error = handleDuplicateFields(error);
        if(err.name === "ValidationError") error = handleValidationError(error)
        
       
        
        
        return sendErrorDev(error,res);

    // =================================================
        
    }else if(process.env.NODE_ENV === "production"){
        return sendErrorProd(err,res);
    }

}