
const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const router = require("./src/routes/Routes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true
}));

app.use(router);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
