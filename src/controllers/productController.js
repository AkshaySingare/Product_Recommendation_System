const prod = require("../models/adminModel")

exports.manageProd=()=>{ //Manage Products
    res.render("manageProd.ejs")
}

exports.addProduct=(req,res)=>{ // AddProduct Page Render 
    res.send("Product Found");
    // res.render("AddProduct.ejs");
}
exports.createProduct=(req,res)=>{   // Added Products
    let {name,discription,price,image_url,category_id} = req.body;
    // res.send(req.body);
    let p = prod.addProduct(name,discription,price,image_url,category_id);
    p.then((result)=>{
        res.send("product added")
        // res.render("AddProduct.ejs");
    }).catch((err)=>{
        res.send("Error"+err);
    });
}
exports.getAllProducts=(req,res)=>{ //Show all Products
      res.send("Show Products");
}
exports.UpdateProd=(req,res)=>{
    res.send("Product Update Page..");
}
exports.updateProduct=(req,res)=>{ //Update the Products Page
    let {id,name,discription,price,image_url,category_id} = req.body;
    prod.updateprod(id,name,discription,price,image_url,category_id).then((result)=>{
        res.send("Product Updated... ");
    }).catch((err)=>{
        console.log(err);
        res.send("Error")
    });
}
exports.deleteProduct=(req,res)=>{ // Product Deleted From DataBase
    let {id} = req.query;
    prod.deleteProd(id).then((result)=>{
        res.send("Product Deleted");
    }).catch((err)=>{
        res.send("Error"+err);
    })
}
