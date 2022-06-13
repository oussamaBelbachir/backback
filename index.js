const app   = require("./app");
const dotenv = require("dotenv")
const mongoose = require("mongoose");

dotenv.config({path:"./.env"}) // variable envirement

const DB = process.env.DB;
mongoose.connect(DB , {
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false,
    useUnifiedTopology: true
}).then(() => {console.log("DB connection successful ✅✅✅")})


const PORT = process.env.PORT || 3500;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT} ✅✅✅`);
})