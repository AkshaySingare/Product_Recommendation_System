
const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/adminController");
const userCtrl = require("../controllers/userController");

router.get("/", adminCtrl.homePage);
router.get("/admin", adminCtrl.Login);
router.post("/admin-auth", adminCtrl.adminAuth);
router.get("/dashboard", adminCtrl.dashboad);
router.get("/adminlogout", adminCtrl.logout);
router.get("/view-users", adminCtrl.viewAdminUsers);

router.get("/User", userCtrl.Login);
router.post("/user-auth", userCtrl.userAuth);
router.get("/register", userCtrl.registration);
router.post("/saveUser", userCtrl.createUser);
router.get("/userdash",userCtrl.userDashboard);

module.exports = router;
