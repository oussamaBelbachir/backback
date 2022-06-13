const mongoose = require("mongoose");
const slugify = require("slugify");


const categorySchema = mongoose.Schema({
    nom : {
        type: String,
        required: [true, 'A category must have a name'],
        unique: true,
        trim: true
    },
    slug : String,
});

categorySchema.pre("save",function(next){
    this.slug = slugify(this.nom,{lower : true});
    next();
});


module.exports = mongoose.model("Category", categorySchema);
