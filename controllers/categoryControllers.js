const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const slugify = require("slugify");
const catchAsync = require("../utils/catchAsync");
 


exports.getCategories = catchAsync(async (req,res,next)=> {

    const categories = await Category.find();
    return res.status(200).json({
        status : "success",
        data : {
            categories
        }
    })
})

exports.createCategory = catchAsync(async (req,res,next)=> {

    const {nom} = req.body;
    const category = await Category.create({nom})
    return res.status(200).json({
        status : "success",
        data : {
            category
        }
    })
})


exports.updateCategory = catchAsync(async (req,res,next)=> {
    const {id} = req.params;
    const {nom} = req.body;
    
    const category = await Category.findByIdAndUpdate(id,{
        nom,
        slug : slugify(nom,{lower : true})
    },{
        runValidators : true,
        new : true
    });
 if(!category){
     console.log("Erroooooooor");
 }
    return res.status(200).json({
        status : "success",
        data : {
            category
        }
    })
})



exports.getCategoryBySlug = catchAsync(async (req,res,next)=> {
    const {slug} = req.params;
    const category = await Category.findOne({slug});
    
    const subcategories = await SubCategory.find({
        category : category._id
    })
    return res.status(200).json({
        status : "success",
        data : {
            category,
            subcategories
        }
    })
})