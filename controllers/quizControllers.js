const catchAsync = require("../utils/catchAsync");
const Quiz = require("../models/quizModel");
const mongoose =   require("mongoose");
const AppError = require("../utils/appError")


exports.getAllQuizzes = catchAsync(async (req,res) => {
    
    const {categoryid,subcategoryid} = req.params;
    const filter = {}
   // console.log(Object.entries(req.params));
    
    
    if(categoryid){
        filter["category"] = categoryid;
        if(subcategoryid){
        filter["subcategory"] = subcategoryid;
        }
        
    }
    
    const quizzes = await Quiz.find(
        {...filter}
    );


    return res.status(200).json({
        status : "success",
        data : {
            results : quizzes.length,
            quizzes
        }
    })
})

exports.getQuizById = catchAsync(async (req,res,next) => {
 
   const {id} = req.params;
    console.log("=============================================");
    
   const quiz = await Quiz.findById(id);
    if(!quiz){
        return next(new AppError("Aucun quiz avec cet ID",401))
    }

    return res.status(200).json({
        status : "success",
        data : {
            quiz
        }
    })
})

exports.getAndCheckQuiz = catchAsync(async (req,res,next) => {
    
    const {quizid,valideid} = req.params;
    console.log("=========================================");
    console.log("=========================================");
    console.log(quizid,valideid);
    
    
    const quiz = await Quiz.findById(quizid)

    if(!quiz){
        return next(new AppError("Aucun quiz avec cet ID",401))
    }

 
    const quiz2 = await Quiz.aggregate([
        {
            $match: {_id : new mongoose.Types.ObjectId(quizid)}
        },
        {
            $project : {
                _id : 1,
                valideIds : 1
            }
        },
        {
            $unwind : "$valideIds"
        },
        
        {
            $project : {
                _id : 1,
                userid : "$valideIds._id",
                completed :  "$valideIds.completed"
            }
        },
        {
            $match : {
                userid : new mongoose.Types.ObjectId(valideid)
            }
        }
   
        

    ])
    console.log(quiz2[0]);

    if(!quiz2 || quiz2[0].completed === true){
        return next(new AppError("Invalid id",401))
    }
    
    

   /*
     //console.log(quiz.valideIds)
     let check = false;
     for(let i=0 ;i<quiz.valideIds.length;i++){

        if(quiz.valideIds[i]["_id"].toString()===valideid){
            check = quiz.valideIds[i];
        }
        
     }
 
    if(check.completed === true){
        return next(new AppError("Invalid Id",401))
    }
    */

    return res.status(201).json({
        status : "success",
        data : {
            quiz
        }
    })
})

exports.createQuiz = catchAsync(async (req,res) => {
    
    const {nom,category,subcategory} = req.body; 
    console.log(nom,category,subcategory);
    const filter = {nom,category}
    
    
    if(subcategory){
        filter["subcategory"] = subcategory;
    }
    console.log(filter);
    
    const quiz = await Quiz.create({...filter});

    return res.status(201).json({
        status : "success",
        data : {
            quiz
        }
    })
})
 
exports.addQuestionToQuiz = catchAsync(async (req,res)=>{
    const {question,choices} = req.body;
    const {id} = req.params;

    const data = {
        titre : question,
        choices
    }
    const quiz = await Quiz.findByIdAndUpdate(id,{
        $push : { questions : {...data}},
    },{
        new : true,
        runValidators : true
    })
    
    return res.status(201).json({
        status : "success",
        data : {
             quiz
        }
    })
}) 

exports.addResponsesToQuestion = catchAsync(async (req,res) => {

    const {id,valideid} = req.params;

    const {responses} = req.body;
    console.log(responses);
    
    let quiz = null;
    
    await Quiz.updateOne({
        "valideIds._id" : valideid
    },{
        "valideIds.$.completed" : true
    })
    
    await Quiz.updateOne({
        _id: id
    }, {
        $inc: {
            completed_quiz: 1
        }
    })



    for(let key of Object.keys(responses)){
        console.log(key+" "+responses[key]);

        quiz = await Quiz.update({"questions._id" : key},{
            $push : {
                "questions.$.responses" : responses[key]
            }
        },{
            new : true,
            runValidators : true
        })

    }
    
    return res.status(201).json({
        status : "success",
        data : {
            quiz
        }
    })
});



exports.incSentQuiz = catchAsync(async (req,res) => {
    
    const {quizid} = req.params;

    await Quiz.updateOne({
        _id: quizid
    }, {
        $inc: {
            sent_quiz: 1
        }
    })

    return res.status(200).json({
        status : "success",
    })
})


exports.generateValidateIds = catchAsync(async (req,res) => {
    const {id} = req.params;
    
    //const {nombre} = req.body;
    
    const quiz = await Quiz.findByIdAndUpdate(id,{

        $push : { valideIds : new Array(1).fill({})},

    },{
        new : true,
        runValidators : true
    });
    console.log(quiz);
    
    return res.status(201).json({
        status : "success",
        data : {
           valideid : quiz.valideIds[quiz.valideIds.length -1]._id
        }
    })
})



exports.overViewData = catchAsync(async (req,res) => {

    /*
            {
            $unwind : "$questions"
        },
        {
            $unwind : "$questions.responses"
        },{
            $group : {
                _id : null,
                nbr : {$sum : 1}
            }
        }
    */

   const nbrResponsesData = await Quiz.aggregate([
        {
            $unwind : "$questions"
        },
        {
            $unwind : "$questions.responses"
        },
        {
            $project : {
                id : "$_id",
                questionid : "$questions._id",
                response : "$questions.responses"
                 
            }
        },
        {
            $group : {
                _id : {
                    id : "$_id",
                    questionid : "$questionid",
                },
                count : {$sum : 1}
            }
        },
        {
            $project : {
                _id : 0,
                id : "$_id.id",
                questionid : "$_id.questionid",
                count : "$count"
                 
            }
        },{
            $group : {
                _id : "$id",
                max : {$max : "$count"}
            }
        },{
            $group : {
                _id : null,
                count : {$sum : "$max"}
            }
        }
       /* {
            $group : {
                _id : {questionid : "$questions._id",
                summ :{$sum : 1}
            }
            }
        }*/
 
        
         
    ])
    const averageQuestionsData = await Quiz.aggregate([

        {
            $unwind : "$questions"
        },
        
        {
            $group : {
                _id : "$_id",
                nbrQuestion : {$sum : 1}
            }
        },
        {
            $group : {
                _id : null,
                avgQuestions : {$avg : "$nbrQuestion"}
            }
        },
        {
            $project : {
                avgQuestions : 1
            }
        }
    ])
 
const {avgQuestions} = averageQuestionsData[0]
const nbrQuizzes = await Quiz.countDocuments()
const {count} = nbrResponsesData[0]

    return res.status(200).json({
        status : "success",
        data :{
            nbrQuizzes, 
            avgQuestions,
            responses : count
        }
    })
})

/*
        data :{
            nbrQuizzes, 
            avgQuestions,
            responses
        }
*/



/*
        {
            $unwind : "$questions"
        },
        {
            $group : {
                
                _id : "$nom",
                sumQuestions : {$sum : 1}
            }
        },
        {
            $project : {
            "sumQuestions" : 1,
 

        }
        },
        {
            $group : {
                _id : null,
                avgQuestion : {$avg : "$sumQuestions"}
            }
        }
*/
exports.averageData = catchAsync(async (req,res) => {
    const {id} = req.params;

   const quiz = await Quiz.findById(id);

    const quizzes = await Quiz.aggregate([

        {
            $match: {_id : new mongoose.Types.ObjectId(id)}
        },
        {
            $unwind : "$questions"
        },
        {
            $unwind : "$questions.responses"
        },
         {
            $group : {
                _id : "$questions._id",
                sumRes : {$sum : 1},
                res : {
                    $push : "$questions.responses"
                },
              
                titre : { $first: "$questions.titre" },
                choices : { $first: "$questions.choices" },
             
                 
            }
        },
        
        {
            $unwind : "$res"
        },
        {
            $group : {
                _id : {question : "$_id" , response : "$res"},
                summ :{$sum : 1},
                titre : { $first: "$titre" },
                choices : { $first: "$choices" },

            }
        },
        {
            $project : {
                _id : "$_id.question",
                response : "$_id.response",
                nbr : "$summ",
                titre : "$titre",
                choices : "$choices",
                 
            }
        } 
      
    //completed_quiz

        /*
                {
            $group : {
                _id : {question : "$_id" , response : "$res"},
                summ :{$sum : 1}
            }
        },{
            $project : {
                _id : "$_id.question",
                response : "$_id.response",
                nbr : "$summ"
            }
        }
        
*/
 
]);

    const obj = {};

    for(let i=0;i<quizzes.length;i++){
                const item = quizzes[i];
                const {_id,response,nbr,titre,choices} = item;
                if(!(item["_id"] in obj)){
                                    obj[_id] = {};
                            obj[_id][response] = nbr;
                      
                            obj[_id]["titre"] = titre;
                            obj[_id]["choices"] = choices;
                }else{
                        obj[_id][response] =  nbr;    
                }
    }

    let tab = []

    for(let key of Object.keys(obj)){
        console.log({...obj[key],id : key})
        tab.push({...obj[key],id : key});
}

 
 
const {completed_quiz} = quiz




    return res.status(201).json({
        status : "success",
        data : {
            quiz : {
                completed_quiz,
                nom : quiz.nom,
                data : tab
            }
        }
    })
})


/*
         {
            $match: {category : new mongoose.Types.ObjectId("62a361a8c163dc25dc76b54e")}
          
        }, 
        {
            $unwind : "$questions"
        },
        {
            $group : {
                _id : "$nom",
                sumQuestions : {$sum : 1}
            }
        },
        {
            $project: {
                "doc": {
                    "_id": "$_id",
                    "total": "$sumQuestions"
                }
            }
        },
        {
            $group: {
                "_id": null,
                "avgQuestions": {
                    $avg: "$doc.total"
                },
                "result": {
                    $push: "$doc"
                }
            }
        }
*/

 
