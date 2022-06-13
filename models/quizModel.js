const mongoose = require("mongoose");
const Counter = require("./counterModel");
const quizSchema = new mongoose.Schema({
    
    nom : {
        type : String,
        required: [true, 'A quiz must have a name'],
        unique : true,
        trim : true
    },
    questions : [
        {
            titre : String,
            choices : [String],
            responses : [String]
        }
    ],
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required : true
    },
    subcategory : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
    },
    completed_quiz : {
        type : Number,
        default : 0
    },
    sent_quiz : {
        type : Number,
        default : 0
    },
    valideIds : [
        {
            sent : {
                type : Boolean,
                default : false
            },
            completed : {
                type : Boolean,
                default : false
            }
        }
    ],
    date : {
        type : Date,
        default : Date.now()
    }
})
quizSchema.pre(/^find/,function(next){
    this.populate({
        path : "category subcategory",
        select : "-__v -slug -category"
    })
    next();
})

quizSchema.pre("save" , function(next){
   const doc = this;
    Counter.findByIdAndUpdate({_id : 'entityId'},
        {
            $inc : {seq : 1}
        }
        ,{
            new : true,
            upsert: true
        }).then(function(count){
            
            doc.test = count.seq;
            next();

        }).catch(function(error) {
            console.error("counter error-> : "+error);
            throw error;
        });
   
    
})



module.exports = mongoose.model("Quiz",quizSchema);


/*
,
            nom : {
                type : String,
                required: [true, 'A question must have a name'],
                unique : true,
                trim : true
            },
            choices : [{
                type : String,
                required: [true, 'The question has at least 3 choices'],
            }],
            responses : [String]
*/