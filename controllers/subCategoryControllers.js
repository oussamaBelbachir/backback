const SubCategory =  require("../models/subCategoryModel");
const catchAsync = require("../utils/catchAsync");
const slugify = require("slugify");


exports.createSubCategory = catchAsync(async (req,res,next) => {

    const {nom,categoryid} = req.body;
    
    const subCategory = await SubCategory.create({
        nom,
        category : categoryid
    })
    
    return res.status(200).json({
        status : "success",
        data : {
            subCategory
        }
    })
})

exports.updateSubCategory = catchAsync(async (req,res,next)=> {
    const {id} = req.params;
    const {nom} = req.body;
    
    const subCategory = await SubCategory.findByIdAndUpdate(id,{
        nom,
        slug : slugify(nom,{lower : true})
    },{
        runValidators : true,
        new : true
    });
 
    return res.status(200).json({
        status : "success",
        data : {
            subCategory
        }
    })
})