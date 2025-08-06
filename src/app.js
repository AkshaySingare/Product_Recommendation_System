const express = require("express");
const session = require("express-session");
const path = require("path");
let db=require("../src/config/db.js");
const app = express();
const router = require("./routes/Routes");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true
}));


app.use("/",router);

module.exports=app;