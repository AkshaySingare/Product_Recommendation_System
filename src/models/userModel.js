const db = require("../config/db");
exports.insertUser= (userData, adminId, callback) => {
    const sql = "INSERT INTO users (username, email, password, admin) VALUES (?, ?, ?, ?)";
    db.query(sql, [userData.username, userData.email, userData.password, adminId], callback);
  }

  exports.authenticateUser=(email, password, callback) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], callback);
  }

  exports.saveUserDetails=(userData, callback) => {
    const sql = `INSERT INTO users (name, email, contact, address, password, admin)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const { name, email, contact, address, password, admin } = userData;
    db.query(sql, [name, email, contact, address, password, admin], callback);
  }

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null); 
      resolve(results[0]); 
    });
  });
};