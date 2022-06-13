const express = require("express");
const morgan = require("morgan")
const dotenv = require("dotenv")
const cors = require("cors");


const app = express();
dotenv.config({path:"./.env"}) // variable envirement

// ======================   Routes   ======================
const quizRoutes = require("./routes/quizRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const userRoutes = require("./routes/userRoutes");
const mailRoutes = require("./routes/mailRoutes");
// ======================   Routes   ======================

// ====================   Controllers   ====================
const ErrorHandler = require("./controllers/errorControllers");
// ====================   Controllers   ====================
 
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev")) // show requests
}


app.use(express.static("public"))

app.use(cors({
    origin:['http://localhost:3000','http://127.0.0.1:3000'], 
    credentials:true,//allow to origin to set credentials     //access-control-allow-credentials:true
    optionSuccessStatus:200,
}))



app.use("/api/users",userRoutes);
app.use("/api/quizzes",quizRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/subcategories",subCategoryRoutes);
app.use("/api/mail",mailRoutes);

// unhandled routes
app.all("*" , (req,res) => {
    return res.status(404).json({
        status : "error",
        message : "no page with this route"
    })

    //return new AppError("hhhh",404);
})

app.use(ErrorHandler);
module.exports = app;