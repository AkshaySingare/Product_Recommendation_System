let express=require("express");
let router = express.Router();
let proctrl=require("../controllers/adminController.js");
let user=require("../controllers/userController.js");
router.get("/",proctrl.homePage);
router.get("/admin",proctrl.Login);
router.get("/User",user.Login);
router.get("/dashboard",proctrl.dashboad);
router.get("/register",user.registration);
module.exports = router