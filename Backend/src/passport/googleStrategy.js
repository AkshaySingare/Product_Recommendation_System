const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../config/db");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value || null;
      const name = profile.displayName;
      const googleId = profile.id;

      db.query("SELECT * FROM users WHERE googleId = ?", [googleId], (err, rows) => {
        if (err) return done(err, null);

        if (rows.length > 0) {
          // Existing user
          const user = rows[0];
          const token = jwt.sign(
            {
              userId: user.id,
              name: user.name,
              email: user.email,
              googleId: user.googleId,
            },
            process.env.JWTKEY,
            { expiresIn: "1h" }
          );
          return done(null, { user, token });
        } else {
          // Insert new user
          db.query(
            "INSERT INTO users (name, email, googleId) VALUES (?, ?, ?)",
            [name, email, googleId],
            (err, result) => {
              if (err) return done(err, null);

              const user = { id: result.insertId, name, email, googleId };
              const token = jwt.sign(
                {
                  userId: user.id,
                  name: user.name,
                  email: user.email,
                  googleId: user.googleId,
                },
                process.env.JWTKEY,
                { expiresIn: "1h" }
              );
              return done(null, { user, token });
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
