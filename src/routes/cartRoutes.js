let express = require("express");
let router = express.Router();

let cartcntl = require("../controllers/cartController.js");

router.get("/addProduct",cartcntl.addProduct);

exports.module=router;