const { resolve } = require("path");
const db = require("../config/db.js");
const { rejects } = require("assert");

exports.checkUserProduct = (userId, productId) => {
      return new Promise((resolve, reject) => {
            db.query("select *from Carts where user_id=? and product_id=?", [userId, productId], (err, row) => {
                  if (err) reject(err);
                  else resolve(row);
            });
      });
}
exports.updateQuantity = (userId, productId) => {
      return new Promise((resolve, rejects) => {
            db.query("UPDATE Carts SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?", [userId, productId], (err, row) => {
                  if (err) rejects(err);
                  else resolve(row);
            });
      });
}
exports.addInCart = (userId, productId) => {
      return new Promise((resolve, reject) => {
            db.query("insert into Carts(user_id,product_id) values(?,?)", [userId, productId], (err, row) => {
                  if (err) reject(err);
                  else resolve(row);
            });
      });
}

exports.getCartsData = (userId) => {
      return new Promise((resolve, rejects) => {
            db.query('select u.name as "userName",p.id as "product_id",p.name,p.image_url,p.discount_price,p.price,c.id,c.quantity from products p inner join Carts c on c.product_id=p.id inner join users u on u.id=c.user_id where user_id=?', [userId], (err, row) => {
                  if (err) rejects(err);
                  else resolve(row);
            });
      })
}

exports.fetchCartById = (id) => {
      return new Promise((resolve, rejects) => {
            db.query('select *from Carts where id=?', [id], (err, row) => {
                  if (err) rejects(err);
                  else resolve(row);
            });
      });
}

exports.deletById = (id) => {
      return new Promise((resolve, rejects) => {
            db.query('delete from Carts where id=?', [id], (err, row) => {
                  if (err) rejects(err);
                  else resolve(row);
            });
      });
}
//Descres the Cart Quantity
exports.descreseQuantity = (id) => {
      return new Promise((resolve, rejects) => {
            db.query('update Carts set quantity=quantity-1 where id=?', [id], (err, row) => {
                  if (err) rejects(err);
                  else resolve(row);
            });
      });
}
//Increse the Cart Quantity
exports.increseQuantity = (id) => {
      return new Promise((resolve, rejects) => {
            db.query('update Carts set quantity=quantity+1 where id=?', [id], (err, row) => {
                  if (err) rejects(err);
                  else resolve(row);
            });
      });
}
