let express=require("express");
let router = express.Router();
let cate=require("../controllers/adminController.js")
const { authenticateAdmin } = require("../middleware/authAdmin.js");

router.post("/authAdmin", authenticateAdmin, (req, res) => {
  res.json({ message: "Admin verified", user: req.user });
});

// router.post("/adminlogin",cate.Login)
router.post("/login",cate.Login); //for Login
router.get("/view-users", cate.viewAdminUsers);
router.get("/orders", cate.getAllOrders);
router.put("/orders/:id/status", cate.updateOrderStatus);
router.delete("/deleteOrder/:orderId/:productId",cate.deleteOrder);

module.exports=router;