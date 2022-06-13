const router = require("express").Router();
const authControllers = require("../controllers/authControllers");


router.route("/signup").post(authControllers.createUser);
router.route("/login").post(authControllers.login);
router.route("/verify/:token").get(authControllers.verifyTokenUser);
 

module.exports = router;
