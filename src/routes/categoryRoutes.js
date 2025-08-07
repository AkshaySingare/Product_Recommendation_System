let express=require("express");
let router = express.Router();
let cate=require("../controllers/categoryController")


// router.get("/", cate.homePage);
// router.get("/cate", cate.Login);
router.post("/cate-auth", cate.adminAuth);
router.get("/dashboard", cate.dashboad);
router.get("/adminlogout", cate.logout);
router.get("/view-users", cate.viewAdminUsers);

router.get("/Login",cate.Login); //for Login
router.get("/", cate.homePage); //Admin Home Page

router.get("/addCategory",cate.showCate);  // show/render addCategory Page
router.post("/addCategory",cate.createCategory); // for add Category
router.get("/viewCategory",cate.getAllCategories); // Views Categories
router.get("/UpdateCategory",cate.updateCate); // render Update Categoris Page
router.post("/updateCategory",cate.updateCategory);  
router.get("/deleteCategory",cate.deleteCategory); // Delete Category

module.exports = router;