const express = require("express");
const PDFDocument = require("pdfkit");
const db = require("../config/db");
const path = require("path");
const router = express.Router();

// Paths to fonts
const fontRegular = path.join(__dirname, "../../fonts/NotoSans-Regular.ttf");
const fontBold = path.join(__dirname, "../../fonts/Roboto-Regular.ttf");

router.get("/invoice/:orderId", (req, res) => {
  const { orderId } = req.params;

  const query = `
    SELECT 
      o.id AS order_id,
      o.full_name,
      o.email,
      o.phone,
      o.address,
      o.city,
      o.state,
      o.zip,
      o.payment_method,
      o.total_amount,
      o.status,
      o.created_at,
      p.id AS product_id,
      p.name AS product_name,
      p.price AS product_price,
      p.discount_price,
      oi.quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.id = ?;
  `;

  db.query(query, [orderId], (err, results) => {
    if (err) return res.status(500).send("Database error");
    if (results.length === 0) return res.status(404).send("Order not found");

    const order = results[0];

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${orderId}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Always use custom fonts
    doc.font(fontBold).fontSize(22).text("INVOICE", { align: "center" }).moveDown();

    // Order Info
    doc.font(fontBold).fontSize(12).text("Order Details").moveDown(0.5);
    doc.font(fontRegular)
      .text(`Order ID: ${order.order_id}`)
      .text(`Order Date: ${new Date(order.created_at).toLocaleDateString()}`)
      .text(`Payment Method: ${order.payment_method.toUpperCase()}`)
      .text(`Status: ${order.status.toUpperCase()}`)
      .moveDown();

    // Customer Info
    doc.font(fontBold).fontSize(12).text("Customer Info").moveDown(0.5);
    doc.font(fontRegular)
      .text(`Name: ${order.full_name}`)
      .text(`Email: ${order.email}`)
      .text(`Phone: ${order.phone}`)
      .moveDown();

    // Shipping Address
    doc.font(fontBold).fontSize(12).text("Shipping Address").moveDown(0.5);
    doc.font(fontRegular)
      .text(`${order.address}, ${order.city}, ${order.state}, ${order.zip}`)
      .moveDown();

    // Line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(2);

    // Table Header
    doc.font(fontBold).font(fontBold).fontSize(14).text("Products", { underline: true }).moveDown(0.5);


 // Table header
doc.font(fontBold).fontSize(12);
let tableTop = doc.y;
const rowHeight = 20;

const colNoX = 50;
const colNameX = 80;
const colQtyX = 300;
const colUnitX = 350;
const colDiscX = 420;
const colLineX = 500;

doc.text("No", colNoX, tableTop);
doc.text("Product Name", colNameX, tableTop);
doc.text("Qty", colQtyX, tableTop);
doc.text("Price", colUnitX, tableTop);
doc.text("Discount Price", colDiscX, tableTop);
doc.text("Total Price", colLineX, tableTop);

doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

let y = tableTop + rowHeight;

// Table rows
doc.font(fontRegular).fontSize(11);  // Use regular for row data
results.forEach((p, i) => {
  const qty = Number(p.quantity) || 0;
  const unitPrice = Number(p.product_price) || 0;
  const discountUnit = (p.discount_price != null) ? Number(p.discount_price) : null;
  const appliedUnit = discountUnit ? discountUnit : unitPrice;
  const lineTotal = appliedUnit * qty;

  // Print row values at fixed column positions
  doc.text(i + 1, colNoX, y);
  doc.text(p.product_name, colNameX, y, { width: colQtyX - colNameX - 5 });
  doc.text(qty, colQtyX, y, { width: 40, align: "right" });
  doc.text(`₹${unitPrice.toFixed(2)}`, colUnitX, y, { width: 60, align: "right" });
  doc.text(discountUnit ? `₹${discountUnit.toFixed(2)}` : "-", colDiscX, y, { width: 60, align: "right" });
  doc.text(`₹${lineTotal.toFixed(2)}`, colLineX, y, { width: 70, align: "right" });

  y += rowHeight;
});

// Divider line after all rows
doc.moveTo(50, y + 12).lineTo(550, y + 12).stroke();
doc.moveDown(2);

// --- Gratitude Section ---
doc.font(fontBold).fontSize(13).fillColor("#333")
  .text("Thank you for your\npurchase!", 100, doc.y, {
    width: 400,
    align: "center"
  });

doc.moveDown(1);

doc.font(fontRegular).fontSize(12).fillColor("#555")
  .text(
    "We truly appreciate your trust in us and hope our service met your expectations.\nLooking forward to serving you again soon!",
    100,
    doc.y,
    {
      width: 400,
      align: "center"
    }
  );
doc.end();
  });
});

module.exports = router;
