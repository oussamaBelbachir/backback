const router = require("express").Router();
const mailControllers = require("../controllers/mailControllers");

router.route("/send")
.post(mailControllers.sendEmailSupport);


module.exports = router;
