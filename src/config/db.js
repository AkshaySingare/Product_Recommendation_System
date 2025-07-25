require("dotenv").config();
let mysql=require("mysql2");

let con=mysql.createConnection({
    host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

con.connect((err)=>{
    if(err)
    {
        console.log("database not connected ");
    }
    else
    {
        console.log("database Connected successfully.......");        
    }
})
module.exports = con;