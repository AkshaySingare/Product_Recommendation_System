let admodel = require("../models/adminModel.js");
const jwt = require("jsonwebtoken");
const { sendOrderEmail } = require("../services/emailService");


exports.Login = (req, res) => {
  let { name, password } = req.body;

  admodel.adminLogin(name, password)
    .then((result) => {
      if (result.length > 0) {
        // Generate JWT token
        const token = jwt.sign(
          { id: result[0].id, name: result[0].name },
          process.env.JWTKEY,
          { expiresIn: "1h" } // token expiry
        );
        res.json({
          message: "Login successful",
          token: token, // send token to frontend
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    });
};


exports.viewAdminUsers = (req, res) => {
  const adminId = req.session.admin.id;
  admodel.getAdminUsers(adminId, (err, users) => {
    if (err) throw err;
    res.render("viewUsers", { users, adminname: req.session.admin.username });
  });
}

exports.getAllOrders = (req, res) => {
  admodel.fetchAllOrders()
    .then((orders) => res.json(orders))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error fetching orders" });
    });
};

exports.updateOrderStatus = (req, res) => {
  const orderId = req.params.id;
  const { status, productId } = req.body;

  admodel.updateOrderStatus(status, productId)
    .then(() => {
      admodel.fetchOrder(orderId, productId)
        .then(async (e) => {
          const data = e[0];
          // console.log("Fetched Data:", data);
          // console.log(data.totalPrice)

          try {
            await sendOrderEmail(data.email, {
              orderId: data.orderId,
              username: data.username,
              orderTotal: data.orderTotal,
              status: data.status,
              orderDate: data.orderDate,
              total: data.totalPrice,
              // ✅ Wrap single product into array
              items: [
                {
                  name: data.productName,
                  price: data.unitPrice,
                  quantity: data.quantity,
                },
              ],
            });

            res.json({
              success: true,
              orderId,
              message: "Order updated and email sent!",
            });

          } catch (emailErr) {
            console.error("Email sending error:", emailErr);
            res.json({
              success: true,
              orderId,
              message: "Order updated but email failed!",
            });
          }
        })
        .catch((err) => {
          console.log("Order Fetching Error: " + err);
          res.status(500).json({ message: "Failed to fetch order" });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to update order status" });
    });
};


exports.deleteOrder = (req, res) => {
  let { orderId, productId } = req.params;

  //fetch  total order from order_items if had one then delete whole order if not then just order from order_item
  admodel.fetchOrderByOrderId(orderId).then((e) => {
    // console.log(e, e.length);
    if(e.length>1){
        admodel.deleteOrd(orderId, productId).then(() => res.send(e)).catch((err) => res.send(err));
    }else{
      admodel.deleteOrder(orderId).then().catch((err)=> console.log(err));
    }
  }).catch((err) => console.log(err));
}


