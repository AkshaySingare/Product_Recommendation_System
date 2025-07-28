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
      res.send("<h2>Login Successful</h2>");
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

exports.saveUser = (req, res) => {
  const { name, email, contact, address, password } = req.body;
  const admin = req.session.admin?.id;

  const userData = { name, email, contact, address, password, admin };

  userModel.saveUserDetails(userData, (err, result) => {
    if (err) {
      console.error("Error saving user:", err);
      return res.send("Failed to register user.");
    }
    res.redirect("/view-users");
  });
};
