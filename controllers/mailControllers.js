const catchAsync = require("../utils/catchAsync");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

exports.sendEmailSupport = catchAsync(async (req,res,next) => {
    const {email,message,link,sujet} = req.body;
     const emails = ["quizques1@hotmail.com","quizques2@hotmail.com","quizques3@hotmail.com"];

    const frooom = emails[Math.floor(Math.random() * 3)];
    let smtpTransport  = nodemailer.createTransport({
      service : 'hotmail',
     
      auth : {
        user : frooom,
        pass : 'ques123quiz'
      }
    })

    smtpTransport.use('compile',hbs({
        //viewEngine : "express-handlebars",
        viewEngine : {
            extName : ".html",
            partialsDir : path.resolve("./views"),
            defaultLayout : false
        },
        viewPath : path.resolve("./views"),
        extName : ".handlebars"
    }))

    //smtpTransport.use("compile" , htmlToText.htmlToText());
    // style="border-radius:10px;padding:20px;display:flex;height:90px;margin:10px 0;color : red;"
    const context = {
        email : email.split("@")[0],
        message,
        link
    }
    console.log(context);
    
        
    const mailOptions = {
      from : frooom,
      to : email,
      subject : sujet,
      template : "ouss",
      context
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