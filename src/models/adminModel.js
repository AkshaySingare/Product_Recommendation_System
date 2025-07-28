const db = require("../config/db");

module.exports = {
  authenticateAdmin: (username, password, callback) => {
    const sql = "SELECT * FROM admin WHERE username = ? AND password = ?";
    db.query(sql, [username, password], callback);
  },

  getAdminUsers: (adminId, callback) => {
    const sql = "SELECT * FROM users WHERE admin = ?";
    db.query(sql, [adminId], callback);
  }
};
