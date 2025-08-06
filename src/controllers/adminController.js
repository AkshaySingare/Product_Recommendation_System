let admodel = require("../models/adminModel");

exports.homePage = (req, res) => {
    res.render("index");
};

exports.Login = (req, res) => {
    res.render("adminLogin");
};

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
    admodel.getAllUsers()
        .then((users) => {
            res.render("viewUsers", {
                users,
                adminname: req.session.admin?.username || "Admin"
            });
        })
        .catch((err) => {
            console.error("Error fetching users:", err);
            res.status(500).send("Internal Server Error");
        });
};
