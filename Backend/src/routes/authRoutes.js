const express = require("express");
const passport = require("../passport/googleStrategy"); // updated
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    // Successful login, redirect with token
    const { user, token } = req.user;
    console.log(user,token)
    // Send token and user data to frontend via query or cookie
res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}&name=${user.name}&id=${user.id}`);
  }
);

module.exports = router;
