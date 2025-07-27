    let express=require("express");
    const router = require("./src/routes/Routes");
    require("./src/config/db");
    let app=express();
    // require("./src/middleware")
    app.set("view engine", "ejs");

// app.set("views", path.join(__dirname, "views"));
app.use('/public', express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
    app.use("/", router);
    app.listen(3000,()=>{
        console.log("Server Started..");
    })