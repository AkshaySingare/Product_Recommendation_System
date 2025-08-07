
const express = require("express");
let bodyparser=require("body-parser");
const path = require("path");
require("dotenv").config();
let db=require("../src/config/db.js")

const productRouter = require("./routes/productRoutes"); 
const categoryRouter = require("./routes/categoryRoutes");
const userRouter = require("./routes/userRouter")
const cartRoutes = require('./routes/cartRoutes');
let cookie=require("cookie-parser");

let app = express();

app.use(express.json());

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Attach routers
app.use("/admin",productRouter);
app.use("/admin",categoryRouter);

// User router
app.use("/",userRouter);
// app.use("/cart",cartRoutes);

module.exports=app;