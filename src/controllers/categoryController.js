// let admodel = require("../models/adminModel");

const { render, name } = require("ejs");
const adminmod = require("../models/adminModel.js");
const { json } = require("body-parser");

exports.homePage = (req, res) => {
    res.render("index");
};

// Admin Page

exports.Login = (req, res) => {
    res.render("adminLogin");
};
exports.showCate = ((req, res) => {
    res.send("This is Admin Page");
    // res.render("categories.ejs");
});

exports.createCategory=((req,res)=>{  // Admin Home Page Render
    let {name} = req.body;
    let p= adminmod.addCategory(name);
    p.then((result)=>{
        res.send("Category Added");
        // render("adminHomePage.ejs");
    }).catch((err)=>{
        console.log(err);
        res.send("Error");
    }); 
});
exports.getAllCategories=((req,res)=>{
    adminmod.viewProduct().then((row)=>{
        res.send("View_Products"+JSON.stringify(row));
    }).catch((err)=>{
        console.log(err);
    });
});
exports.updateCate=((req,res)=>{ 
    res.send("Update Category");
    // res.render("UpdateCategory.ejs");
});

exports.updateCategory=((req,res)=>{  // Update Category
    let {name,id}=req.body;
    adminmod.updateCate(name,id).then((result)=>{
        res.send("Categories Changed...");
    }).catch((err)=>{
        console.log(err);
        res.send("Name Already Exist...");
    });
});
exports.deleteCategory=((req,res)=>{   //  Category Deletd
        adminmod.deleteCate(req.query.id).then((result)=>{
            res.send("Deleted Category");
        }).catch((err)=>{
            console.log(err);
            res.send("Error");
        });
});
 
exports.dashboad = (req, res) => {
    if (!req.session.admin) return res.redirect("/admin");
    res.render("admindashboard", { adminname: req.session.admin.username });
};

exports.adminAuth = (req, res) => {
    const { username, password } = req.body;

    admodel.authenticateAdmin(username, password, (err, results) => {
        if (err) throw err;

        if (results.length === 1) {
            req.session.admin = results[0];
            res.redirect("/dashboard");
        } else {
            res.send(`<script>alert("Invalid credentials"); window.location.href="/admin";</script>`);
        }
    });
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin");
    });
};

exports.viewAdminUsers = (req, res) => {
    const adminId = req.session.admin.id;
    admodel.getAdminUsers(adminId, (err, users) => {
        if (err) throw err;
        res.render("viewUsers", { users, adminname: req.session.admin.username });
    });
}
