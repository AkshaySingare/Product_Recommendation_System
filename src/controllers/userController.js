const userModel = require("../models/userModel");

exports.Login = (req, res) => {
  res.render("userLogin");
};


exports.registration = (req, res) => {
  res.render("register");
};

exports.createUser = (req, res) => {
  const { username, email, password } = req.body;
  const adminId = req.session.admin?.id;

  if (!adminId) {
    return res.redirect("/admin"); // not logged in
  }

  userModel.insertUser({ username, email, password }, adminId, (err, result) => {
    if (err) throw err;
    res.redirect("/view-users");
  });
};

exports.userAuth = (req, res) => {
  const { email, password } = req.body;

  userModel.authenticateUser(email, password, (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
       req.session.userId = results[0].id;
      const user = results[0];
      res.render("userdashboard", { user });
    } else {
res.send(`
  <html>
    <head>
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    </head>
    <body>
      <script>
        Swal.fire({
          title: 'User Not Found',
          text: "Do you want to register now?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Register',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/register";
          } else {
            window.location.href = "/user";
          }
        });
      </script>
    </body>
  </html>
`);

    }
  });
};


exports.userDashboard = (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.redirect("/user"); // Redirect if not logged in
  }

  userModel.getUserById(userId)
    .then((user) => {
      res.render("userdashboard", { user });
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      res.status(500).send("Internal Server Error");
    });
};