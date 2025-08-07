let express=require("express");
let routerProd = express.Router();
let prod=require("../controllers/productController.js")

routerProd.get("/addProducts",prod.addProduct); // render AddProducts Page
routerProd.post("/addProducts",prod.createProduct); // Product added in DataBase
routerProd.get("/viewProducts",prod.getAllProducts) //Show Products
routerProd.get("/updateProd",prod.UpdateProd); // render Product Updated Page
routerProd.post("/updateproduct",prod.updateProduct);  
routerProd.get("/deleteProd",prod.deleteProduct); //For Delete Product 

module.exports = routerProd;