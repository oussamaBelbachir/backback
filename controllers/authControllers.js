const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const { promisify } = require('util');
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError")



const signToken = (id) => {
    return jwt.sign({id} , process.env.SECRET , {
        expiresIn : process.env.JWT_EXPIRES_IN 
    })
}


const createSendToken = (user,res,statusCode) => {
    
    const token = signToken(user._id);

/*
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
          ),
          httpOnly : true,
         
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    
    res.cookie("jwt",token,{...cookieOptions,sameSite : "none"});
*/
    user.password = undefined;

    return res.status(statusCode).json({
        status : "success",
        token,
        data : {
            user
        }
         
    }) 
}



exports.createUser = catchAsync(async (req,res,next) => {

        const {nom,prenom,email,password,passwordConfirm} = req.body;

        console.log(nom,email,password,passwordConfirm);
   
        const user = await User.create({
            nom,
            prenom,
            email,
            password,
            passwordConfirm
        });

        return createSendToken(user,res,201);
 
 
});



exports.login = catchAsync(async (req,res,next) => {
 

        const {email,password} = req.body;

        if(!email || !password){
            return res.status(404).json({
                status : "fail",
                message : "provide email and password",

            })
        }
        const user = await User.findOne({email}).select("+password");
        
        if(!user || !(await user.checkPassword(password,user.password))){
           
            return next(new AppError("Email or Password Incorrect",401))
        }
        createSendToken(user,res,201);
 
});




exports.verifyTokenUser = catchAsync(async (req,res,next) => {
 
    const {token} = req.params;


  
    if(!token){
        return res.status(200).json({
            status :  "fail"
        })
    }
    
    const decoded = await promisify(jwt.verify)(token,process.env.SECRET);
     
    const user = await User.findById(decoded.id);
    
    return res.status(200).json({
        status : "success",
        data : {
            user
        }
    })
})