const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    test : {
        type : Number,
        default : 1
    },
    nom : {
        type : String,
        required : [true, "A user must have a name"]
    },
    prenom : {
        type : String,
        required : [true, "A user must have a name"]
    },
    email : {
        type : String,
        required : [true, "A user must have an email"],
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : [true , 'A user must have a password'],
        select : false
    },
    passwordConfirm : {
        type : String,
        required : [true , 'Confirm your password'],
        validate : {
            validator : function(pass){
                return pass === this.password
            },
            message : "Passwords are not the same !!"
        }
    }
})

// ==========================================
userSchema.pre("save",async function(next){
    
    
    if(!this.isModified("password"))
        return next();

    this.password = await bcrypt.hash(this.password , 12);


    this.passwordConfirm = undefined;
    next();
})
// ==========================================


// ==========================================
//userSchema.methods.checkPassword = async function(password,cryptedPassword){
//    return await bcrypt.compare(password,cryptedPassword)
//}
userSchema.methods.checkPassword = async function(password,userPassword){
    return await bcrypt.compare(password,userPassword)
}

// ==========================================

const User = mongoose.model('User',userSchema);

module.exports = User;
