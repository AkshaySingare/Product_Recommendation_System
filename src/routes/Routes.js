let express=require("express");
let router = express.Router();
let proctrl=require("../controllers/adminController.js");
let user=require("../controllers/userController.js");
router.get("/",proctrl.homePage);
router.get("/Login",proctrl.Login);
router.get("/register",user.Register);
module.exports = router