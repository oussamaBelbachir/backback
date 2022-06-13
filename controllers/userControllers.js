const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const mongoose =   require("mongoose");






exports.sendEmailSupport = catchAsync(async (req,res,next) => {
    const data = req.body;
    //console.log(data.to);
    
    const smtpTransport  = nodemailer.createTransport({
      service : 'Gmail',
      port : 465,
      auth : {
        user : 'oussbusinessnode@gmail.com',
        pass : 'OUSSbusinessNODE@@@'
      }
    })

    smtpTransport.use("compile" , htmlToText.htmlToText());
    // style="border-radius:10px;padding:20px;display:flex;height:90px;margin:10px 0;color : red;"
    
    const mailOptions = {
      from : 'oussbusinessnode@gmail.com',
      to : "oussamabelbachir60@gmail.com",
      subject : "my subject",
      text : "hello world oussama belbachirrrrr"
    };

    smtpTransport.sendMail(mailOptions , (error,response) => {
        if(error){
          res.status(404).json({
            status : "fail",
            message : error
          })
        }else{
          res.status(200).json({
            status : "success",
          })
        }
    });

    smtpTransport.close();
})