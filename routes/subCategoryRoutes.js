const router = require("express").Router();
const subCategoryController = require("../controllers/subCategoryControllers")


router.route("/")
.post(subCategoryController.createSubCategory);

router.route("/:id")
.patch(subCategoryController.updateSubCategory);

module.exports = router;
