const mongoose = require("mongoose");
const slugify = require("slugify");

const subCategorySchema = mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'A category must have a name'],
        unique: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    slug : String,

})

subCategorySchema.pre("save", function(next){
    this.slug = slugify(this.nom,{lower : true})
    next();
})

subCategorySchema.pre(/^find/, function(next) {
    this.select("-__v")
    next();
});
module.exports = mongoose.model('SubCategory', subCategorySchema);
