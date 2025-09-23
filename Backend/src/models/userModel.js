const { resolve } = require("path");
const db = require("../config/db");
const { rejects } = require("assert");

exports.getAllUsers = () => {
  return new Promise((resolve, rejects) => {
    db.query("select *from users", (err, row) => {
      if (err) rejects(err);
      else resolve(row);
    })
  });
}
exports.saveDB = (name, email, contact, password, address) => {
  return new Promise((resolve, reject) => {

    db.query("INSERT INTO users (name, email, contact, password, address) VALUES (?, ?, ?, ?,?)", [name, email, contact, password, address], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.userNameCheck = (key, val) => {
  return new Promise((resolve, rejects) => {
    db.query(`select *from users where ${key}=?`, [val], (err, row) => {
      if (err) rejects(err);
      else resolve(row);
    });
  });
}

//likes
exports.showslike = (userId) => {
  return new Promise((resolve, rejects) => {
    db.query("select product_id, action_id as 'liked' from user_interactions where user_id=?", [userId], (err, row) => {
      if (err) rejects(err);
      else resolve(row);
    });
  });
}

exports.addLike = (userId, productId) => {
  return new Promise((resolve, rejects) => {
    db.query("insert into user_interactions(user_id,product_id,action_id) values(?,?,2)", [userId, productId], (err, row) => {
      if (err) rejects(err);
      else resolve(row);
    });
  });
}
exports.deleteLikes = (userId, productId) => {
  return new Promise((resolve, rejects) => {
    db.query("delete from user_interactions where user_id=? and product_id=?", [userId, productId], (err, row) => {
      if (err) rejects(err)
      else resolve(row)
    });
  });
}
exports.fetchAllLikes = () => {
  return new Promise((resolve, rejects) => {
    db.query("SELECT product_id, COUNT(action_id) AS liked FROM user_interactions WHERE action_id = 2 GROUP BY product_id", (err, row) => {
      if (err) rejects(err);
      else resolve(row);
    });
  })
}
exports.addNewView = (userId, productId) => {
  return new Promise((resolve, rejects) => {
    db.query("insert into user_interactions(user_id,product_id,action_id) values(?,?,1)", [userId, productId], (err, row) => {
      if (err) rejects(err);
      else resolve(row);
    });
  });
}
exports.allViews = () => {
  return new Promise((resolve, rejects) => {
    db.query("SELECT product_id, COUNT(action_id) AS viewed FROM user_interactions WHERE action_id = 1 GROUP BY product_id", (err, row) => {
      if (err) rejects(err);
      else resolve(row);
    });
  });
}
exports.userView = (userId) => {
  return new Promise((resolve, rejects) => {
    db.query("select  product_id from user_interactions where user_id=?", [userId], (err, row) => {
      if (err) rejects(err);
      else resolve(row);
    });
  });
}
exports.fetchLikes = (userId) => {
  return new Promise((resolve, rejects) => {
    db.query("SELECT u.id AS id,p.name AS productName,p.description,p.price,p.image_url,p.discount_price,c.name AS categoryName FROM user_interactions u INNER JOIN products p ON p.id = u.product_id INNER JOIN categories c ON c.id = p.category_id WHERE u.user_id = ? and u.action_id=2", [userId], (err, row) => {
      if (err) rejects(err);
      else resolve(row);
    });
  })
}
// Fetch single user by ID
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};
// Update profile
exports.updateUserById = (id, data) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET name=?, email=?, contact=?, address=? WHERE id=?",
      [data.name, data.email, data.contact, data.address, id],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};


// Check old password before updating
exports.checkusersById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE id=?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row[0].password);
    });
  });
};

// Update password
exports.updatePassword = (id, newPassword) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE users SET password=? WHERE id=?", [newPassword, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Authorization

exports.saveOrder = (order) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO orders 
  (user_id, full_name, email, phone, address, city, state, zip, payment_method, total_amount)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      order.userId,
      order.fullName,
      order.email,
      order.phone,
      order.address,
      order.city,
      order.state,
      order.zip,
      order.paymentMethod,
      order.totalAmount
    ];

    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result.insertId);
    });
  });
};
exports.deleteCartItem = (userId) => { //delete items those saved in order table
  return new Promise((resolve, rejects) => {
    db.query("delete from Carts where user_id=? ", [userId], (err, row) => {
      if (err) rejects(err);
      else resolve(row)
    });
  });
}
exports.storedItems = (orderId, products) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)";

    // Insert each product
    products.forEach((item, index) => {
      db.query(query, [orderId, item.id, item.quantity], (err, result) => {
        if (err) return reject(err);

        // Resolve only after the last insert
        if (index === products.length - 1) {
          resolve("Items stored successfully");
        }
      });
    });
  });
};
// Fetch product details by IDs (callback style)
exports.getProductDetails = (ids, callback) => {
  const query = `SELECT id, name, price FROM products WHERE id IN (?)`;
  db.query(query, [ids], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

exports.allOrderItems = (userId) => {
  return new Promise((resolve, rejects) => {
    let sql = 'SELECT o.id AS order_id,o.total_amount,o.payment_method,oi.status,o.created_at AS order_date,p.id AS product_id,p.name AS product_name,p.image_url as "image",p.price AS product_price,oi.quantity FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id WHERE o.user_id = ? ORDER BY o.created_at DESC';
    db.query(sql, [userId], (err, row) => {
      if (err) rejects(err);
      else resolve(row);
    });
  });
}
exports.addPurchase = async (userId, productIds) => {
  const query = "INSERT INTO user_interactions(user_id, product_id, action_id) VALUES (?, ?, 3)";

  for (const item of productIds) {
    await new Promise((resolve, reject) => {
      db.query(query, [userId, item], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  return "Items stored successfully";
};

exports.delProfile = (id) => {
  return new Promise((resolve, rejects) => {
    db.query("delete from users where id=?", [id], (err, row) => {
      if (err) rejects(err);
      else resolve(row);
    });
  });
}
async function findOrCreateUser({ name, email, googleId }) {
  // Check if user exists
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  if (rows.length > 0) {
    return rows[0]; // return existing user
  }

  // Insert new user
  const [result] = await db.execute(
    "INSERT INTO users (name, email, googleId) VALUES (?, ?, ?)",
    [name, email, googleId]
  );

  return { id: result.insertId, name, email, googleId };
}

// Product Recommdation Logic
exports.getProductRecommendations = (productId) => {
  return new Promise((resolve, rejects) => {
    const query = `
    SELECT 
        CASE WHEN a.product_id = ? THEN b.product_id ELSE a.product_id END AS recommended_product,
        SUM(
            (CASE WHEN a.action_id=1 THEN 1 
                  WHEN a.action_id=2 THEN 2 
                  WHEN a.action_id=3 THEN 5 END) *
            (CASE WHEN b.action_id=1 THEN 1 
                  WHEN b.action_id=2 THEN 2 
                  WHEN b.action_id=3 THEN 5 END)
        ) AS similarity_score
    FROM user_interactions a
    JOIN user_interactions b
        ON a.user_id = b.user_id
       AND a.product_id < b.product_id
    WHERE a.product_id = ? OR b.product_id = ?
    GROUP BY recommended_product
    ORDER BY similarity_score DESC
    LIMIT 6;
  `;
    db.query(query, [productId, productId, productId],(err,row)=>{
      if(err) rejects(err);
      else resolve(row)
    });
  });
};
// Delete Users From DB
exports.deleteUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};