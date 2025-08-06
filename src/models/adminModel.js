const db = require("../config/db");

exports.authenticateAdmin=(username, password, callback) => {
    const sql = "SELECT * FROM admin WHERE username = ? AND password = ?";
    db.query(sql, [username, password], callback);
  }

  exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT id, name, email, contact, address, created_at FROM users";
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};