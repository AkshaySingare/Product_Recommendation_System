const usermodel = require("../models/userModel");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const { sendOrderEmail } = require("../services/emailService");

exports.getUsers = ((req, res) => {
  usermodel.getAllUsers().then((result) => {
    // console.log(result)
    res.send(result);
  }).catch((err) => console.log(err));
});

exports.saveUser = ((req, res) => {
  let { name, email, contact, password, address } = req.body;
  // console.log(name, email, contact, password, address);
  let enpass = bcrypt.hashSync(password, 8);
  // console.log(enpass);

  // check user already prasent or not
  let key = "name";
  let val = name;
  usermodel.userNameCheck(key, val).then((e) => {
    // console.log(e);
    if (e.length > 0) res.send("UserName Already Taken By SomeOne");
    else {
      let promise = usermodel.saveDB(name, email, contact, enpass, address); // Pass full object
      promise.then((result) => {
        res.send("User Saved...");
      }).catch((err) => {
        console.log(err);
        res.send("error", err);
      });
    }
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });

});

exports.LoginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(401).send("Please Login...");
  }

  let key = "email";
  let val = email;

  usermodel.userNameCheck(key, val).then((e) => {
    // console.log(e[0].password);
    if (e.length == 0) res.send("Invalid Crediatials");
    else {
      const isMatch = bcrypt.compareSync(password, e[0].password);
      if (isMatch) {
        let token = jwt.sign({ email }, process.env.JWTKEY, { expiresIn: '1h' });
        res.json({ data: e, token: token });
      }
      else res.send("Invalid Crediatials");
    }
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
}
exports.authenticateToken = (req, res, next) => {
  // console.log(req.headers);
  // console.log(req.params.id);
  let authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Token missing" });
  jwt.verify(token, process.env.JWTKEY, (err, valid) => {
    if (err) {
      res.status(403).send("Forbidden")
    }
    // console.log("valid ->   ",valid);
    let key = 'email';
    let val = valid.email;
    usermodel.userNameCheck(key, val).then((e) => {
      // console.log("UserName ", e);
      res.send(e);
    }).catch((err) => {
      console.log(err);
      res.send(err);
    });
  });
}

// Likes
exports.showLikes = (req, res) => {
  let { userId } = req.params;
  // console.log(userId)
  usermodel.showslike(userId).then((e) => {
    // console.log(e);
    res.send(e);
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
}

exports.manageLike = (req, res) => {

  let { userId, productId, msg } = req.body;
  // console.log(userId, productId, msg);
  if (msg == "add") {
    usermodel.addLike(userId, productId).then((result) => {
      // console.log(result);
      res.send(result);
    }).catch((err) => {
      console.log(err);
      res.send(err);
    });
  }
  else {
    usermodel.deleteLikes(userId, productId).then((result) => {
      // console.log(result);
      res.send(result);
    }).catch((err) => {
      console.log(err);
      res.send(err);
    });
  }
}
exports.fetchLikes = (req, res) => {
  usermodel.fetchAllLikes().then((e) => {
    // console.log(e);    
    res.send(e);
  }).catch((err) => res.send(err));
}
//  Product Views
exports.addView = (req, res) => {
  let { userId, productId } = req.body;
  // console.log(userId,productId);
  usermodel.addNewView(userId, productId).then((e) => {
    // console.log(e);
    res.send(e);
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
}
exports.fetchViews = (req, res) => {
  usermodel.allViews().then((e) => {
    // console.log(e);
    res.send(e);
  }).catch((err) => {
    console.log(err);
    res.send(err);
  });
}
exports.fetchUserview = (req, res) => {
  usermodel.userView(req.params.userId).then((e) => {
    // console.log(e);
    res.send(e);
  }).catch((err) => console.log(err));
}
exports.wishList = (req, res) => {
  // console.log(req.params.userId);  
  usermodel.fetchLikes(req.params.userId).then((e) => {
    // console.log(e);
    res.send(e);
  }).catch((err) => res.send(err));
}

// Fetch single user by ID
exports.getUser = (req, res) => {
  const { id } = req.params;
  usermodel.getUserById(id)
    .then((result) => {
      if (result.length === 0) return res.status(404).send({ message: "User not found" });
      res.send(result[0]); // single object
    })
    .catch((err) => res.status(500).send({ message: "Error fetching user", err }));
};
// Update profile
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, contact, address } = req.body;

  usermodel.updateUserById(id, { name, email, contact, address })
    .then(() => res.send({ message: "Profile updated successfully" }))
    .catch((err) => res.status(500).send({ message: "Failed to update profile", err }));
};

// Change password
exports.changePassword = (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  // console.log(oldPassword+" newpassword  "+newPassword)
  let enpass = bcrypt.hashSync(newPassword, 8);
  // console.log(enpass);

  usermodel.checkusersById(id)
    .then((pass) => {
      // console.log(pass);
      const isMatch = bcrypt.compareSync(oldPassword, pass);
      // console.log(isMatch);

      if (!isMatch) {
        res.send("Old password incorrect");
      } else {
        usermodel.updatePassword(id, enpass).then((e) => {
          // console.log(e);
          res.send("Password updated successfully");
        }).catch((err) => {
          console.log(err);
          res.send(err);
        });
      }
    });
};

exports.placeOrder = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      paymentMethod,
      totalAmount,
      products,
    } = req.body;

    const newOrder = {
      userId,
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      paymentMethod,
      totalAmount,
    };

    // 1️⃣ Save order and get inserted orderId
    const orderId = await usermodel.saveOrder(newOrder);

    // 2️⃣ Insert products into order_items
    await usermodel.storedItems(orderId, products);

    // 3️⃣ Delete cart items after order is placed
    await usermodel.deleteCartItem(userId);

    // 4️⃣ Fetch product details and then send email
    const productIds = products.map((p) => p.id);

    usermodel.getProductDetails(productIds, async (err, productDetails) => {
      if (err) {
        console.error("Error fetching product details:", err);
        return res.status(500).json({ error: "Failed to fetch product details" });
      }
      // console.log("Product details:", productDetails);
      // Merge quantities with product details
      const itemsWithDetails = products.map((p) => {
        const product = productDetails.find((pd) => pd.id === p.id);
        return {
          name: product ? product.name : "Unknown",
          price: product ? product.price : 0,
          quantity: p.quantity,
        };
      });

      // console.log("Items with details:", itemsWithDetails);
      try {
        // console.log(productIds)
        await usermodel.addPurchase(userId, productIds);
        console.log("Purchased items stored successfully");
      } catch (err) {
        console.error("Error storing purchased items:", err);
      }
      // 5️⃣ Send email AFTER items are ready
      try {
        await sendOrderEmail(email, {
          orderId,
          total: totalAmount,
          status: "Pending",
          items: itemsWithDetails,
        });

        res.json({
          success: true,
          orderId,
          message: "Order placed successfully and email sent!",
        });

      } catch (emailErr) {
        console.error("Email sending error:", emailErr);
        res.json({
          success: true,
          orderId,
          message: "Order placed successfully but email failed!",
        });
      }
    });
  } catch (err) {
    console.error("Order saving error:", err);
    res.status(500).json({ success: false, message: "Order failed" });
  }
};

exports.fetchOrders = (req, res) => {
  usermodel.allOrderItems(req.params.id).then((e) => res.send(e)).catch((err) => res.send(err));
}

exports.deleteProfile = (req, res) => {
  // console.log(req.params.id);
  usermodel.delProfile(req.params.id).then((e) => {
    // console.log(e);
    res.send(e);
  }).catch((err) => {
    console.log(err);
    res.send(err)
  });
}

//  Product Recommendations
exports.getTopProductRecommendations = async (req, res) => {

  const productId = Number(req.params.id);
  if (!productId) return res.status(400).json({ error: 'productId is required' });

  usermodel.getProductRecommendations(productId).then((e) => {
    // console.log(e);
    res.send(e);
  }).catch((err) => {
    console.log(err);
    res.send("Error Occured");
  });
};
// Delete user by ID
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  usermodel.deleteUserById(id)
    .then((result) => {
      res.json({ success: true, message: "User deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: "Failed to delete user" });
    });
};