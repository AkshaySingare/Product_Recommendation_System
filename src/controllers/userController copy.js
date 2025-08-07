const usermodel = require("../models/usermodel");
let jwt=require("jsonwebtoken");
const secret_key = "pune";

exports.Login = (req, res) => {
  let token=req.cookies.xyz;
  //token=req.headers.authorization?.split(' ')[1];

     jwt.verify(token,secret_key,(err,result)=>{
        console.log(result);
       })
  res.render("userLogin");
};


exports.homePage = ((req, res) => {
    res.render("index.ejs")
});
exports.Register=((req,res)=>{
    res.render("register");
});
exports.saveUser=((req,res)=>{
    let { name, email, contact,password, address} = req.body;

    let token = jwt.sign({
      jwt_email:req.body.email,
      jwt_pass :req.body.password
    },secret_key,{expiresIn:'1h'});
    console.log(token);

    jwt.verify(token,secret_key,(err,decoded)=>{
      if(err){
        console.log("Invalid Credition");
      }
      else{
        console.log("\n Token Verified  "+decoded.jwt_email);
        console.log("\n Pass "+decoded.jwt_pass);
      }
    });

    let promise = usermodel.saveDB(name, email, contact, password, address); // Pass full object

    promise.then((result) => {
      res.send("User Saved...");
        // res.render("DashBoard");
    }).catch((err) => {
        res.send("error",err);
    }); 
});

exports.LoginUser=(req,res)=>{
    const {email,password} = req.body;
    
    usermodel.checkusers(email,password).then((result)=>{      
      res.send("User Found");
    }).catch((err)=>{
      console.log(err);
      res.send("Error");
    });
}

//  Inside the Menu Option 
exports.userProfile=(req,res)=>{
  res.send("User Details Page...");
  // res.render("userdetails");
}
exports.deleteUser
// exports.likeProduct=(req,res)=>{
//   res.send("Show Liked Products to that user ");
//   // res.render("likedProd");
// }