
exports.homePage = ((req, res) => {
    res.render("index.ejs")
})

exports.Login=((req,res)=>{
    res.render("adminLogin");
})

exports.dashboad=((req,res)=>{
    res.render("admindashboard");
})