const router = require("express").Router();
const quizControllers = require("../controllers/quizControllers");

router.route("/")
.get(quizControllers.getAllQuizzes)
.post(quizControllers.createQuiz);


router.route("/:id")
.get(quizControllers.getQuizById);

router.route("/data/overviewdata")
.get(quizControllers.overViewData);


router.route("/category/:categoryid/:subcategoryid?")
.get(quizControllers.getAllQuizzes)

router.route("/addquestion/:id").patch(quizControllers.addQuestionToQuiz);
router.route("/addresponses/:id/:valideid").patch(quizControllers.addResponsesToQuestion);

router.route("/data/averagedata/:id")
.get(quizControllers.averageData);

router.route("/:id/generateids")
.post(quizControllers.generateValidateIds);
 

router.route("/quiz/:quizid/:valideid")
.get(quizControllers.getAndCheckQuiz);

router.route("/quiz/incsent/:quizid")
.post(quizControllers.incSentQuiz);



module.exports = router;