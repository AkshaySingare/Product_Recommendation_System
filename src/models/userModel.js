const db = require("../config/db");

module.exports = {
  insertUser: (userData, adminId, callback) => {
    const sql = "INSERT INTO users (username, email, password, admin) VALUES (?, ?, ?, ?)";
    db.query(sql, [userData.username, userData.email, userData.password, adminId], callback);
  },

  authenticateUser: (email, password, callback) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], callback);
  },

  saveUserDetails: (userData, callback) => {
    const sql = `INSERT INTO users (name, email, contact, address, password, admin)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const { name, email, contact, address, password, admin } = userData;
    db.query(sql, [name, email, contact, address, password, admin], callback);
  }
};
