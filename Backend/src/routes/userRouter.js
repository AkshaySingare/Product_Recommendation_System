let express = require("express");
let router = express.Router();
let user = require("../controllers/userController.js")
let product = require("../controllers/productController.js");

router.get("/getUsers",user.getUsers);
router.post("/register", user.saveUser); // User Data saved
router.post("/login", user.LoginUser);   // login if user alredy prasent
router.get("/getProfile/:id",user.authenticateToken); // Verify Token

//For fetch Category wise Data 
router.get("/showProducts/:id",product.showProducts);

//  Manages Likes
router.get("/showLikes/:userId",user.showLikes);
router.post("/managelike",user.manageLike);
router.get("/fetchLikes",user.fetchLikes);
router.post("/addView",user.addView);
router.get("/fetchViews",user.fetchViews);
router.get("/fetchUserview/:userId",user.fetchUserview);

router.get("/wishList/:userId",user.wishList);

router.get("/getUser/:id", user.getUser); //for profile
router.put("/updateUser/:id", user.updateUser);           // update profile
router.put("/changePassword/:id", user.changePassword);
router.post("/checkout", user.placeOrder);
router.get("/fetchOrders/:id",user.fetchOrders);
router.delete('/deleteProfile/:id',user.deleteProfile);

router.delete("/deleteUser/:id", user.deleteUser); //delete user
router.get('/recommendations/:id/', user.getTopProductRecommendations); //Product Recomdation


module.exports = router;