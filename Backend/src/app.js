require("dotenv").config();
const express = require("express");
const path = require("path");
let db = require("../src/config/db.js");
let cookie = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
require("./passport/googleStrategy"); // load Google strategy
const authRoutes = require("./routes/authRoutes.js");


let app = express();

app.use(cors());

// Serve static files
app.use(express.static("public"));

// Serve uploads folder for images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// console.log(path.join(__dirname, "uploads"))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Attach routers
const productRouter = require("./routes/productRoutes"); 
const categoryRouter = require("./routes/categoryRoutes");
const adminRouter = require("./routes/adminRouter.js");

app.use("/admin", productRouter);
app.use("/admin", categoryRouter);
app.use("/admin", adminRouter);

const userRouter = require("./routes/userRouter");
const cartRouter = require("./routes/cartRoutes.js")
app.use("/", userRouter);
app.use("/",cartRouter);
app.use("/api/auth", authRoutes);
const invoiceRoutes = require("./routes/invoiceRoutes");
app.use("/api", invoiceRoutes);


module.exports = app;
