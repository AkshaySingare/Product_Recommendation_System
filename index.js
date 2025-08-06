let app=require("./src/app.js");
app.listen(process.env.DB_PORT,()=>{
    console.log("Server Started......");
})