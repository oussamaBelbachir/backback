const router = require("express").Router();
const categoryController = require("../controllers/categoryControllers");


router
    .route("/")
    .get(categoryController.getCategories)
    .post(categoryController.createCategory);

router.route("/:id")
    .patch(categoryController.updateCategory)

router.route("/slug/:slug")
    .get(categoryController.getCategoryBySlug)

module.exports = router;
