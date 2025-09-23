const { resolve } = require("path");
const db = require("../config/db.js");
const { rejects } = require("assert");
const { promises } = require("dns");

exports.adminLogin = (name, pass) => {
  // console.log(name,pass)
  return new Promise((resolve, reject) => {
    db.query("select *from admin where name=? and password=?", [name, pass], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);  // valid admin
      }
    })
  });
}

exports.fetchAllOrders = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
  o.id AS orderId,
  u.name AS  username,
  p.name AS productName,
  p.price,
  p.discount_price,
  p.image_url,
  p.id as 'productId',
  oi.quantity, 
  oi.status,                      
  (p.discount_price * oi.quantity) AS totalPrice,  
  o.created_at AS orderDate
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
ORDER BY o.id DESC`;

    db.query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.updateOrderStatus = (status, productId) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE order_items SET status = ? where product_id = ?";
    db.query(sql, [status, productId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.fetchOrderByOrderId=(orderId)=>{ //fetch all orders from order_items
  return new Promise((resolve,rejects)=>{
    db.query('select *from order_items where order_id=?',[orderId],(err,row)=>{
      if(err) rejects(err);
      else resolve(row);
    })
  })
}
exports.deleteOrd = (orderId,productId) => { // delete product from order_items
  return new Promise((resolve, rejects) => {
    db.query('delete from order_items where order_id=? and product_id=?', [orderId,productId], (err, row) => {
      if (err) rejects(err);
      else resolve(row);
    })
  })
}
exports.deleteOrder=(orderId)=>{ //delete whole order from orders table
  return new Promise((resolve,rejects)=>{
    db.query('delete from orders where id=?',[orderId],(err,row)=>{
      if(err) rejects(err);
      else resolve(row);
    })
  })
}

exports.fetchOrder = (id, productId) => {
  return new Promise((resolve, rejects) => {
    const sql = `
 SELECT 
    o.id AS orderId,
    u.name AS username,
    o.email,
    p.name AS productName,
    oi.quantity,
    COALESCE(p.discount_price, p.price) AS unitPrice,
    (COALESCE(p.discount_price, p.price) * oi.quantity) AS totalPrice,
    o.total_amount AS orderTotal,
    oi.status, 
    o.created_at AS orderDate
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.id = ?
  AND p.id =?`;
    db.query(sql, [id, productId], (err, row) => {
      if (err) rejects(err);
      else resolve(row);
    })
  });
}

