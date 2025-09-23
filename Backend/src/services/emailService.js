const nodemailer = require("nodemailer");

// Create transporter using your email credentials
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password if using Gmail
  },
});

// Function to send order email
const sendOrderEmail = async (to, order) => {
  const { orderId, total, items, status } = order;
  // console.log(total);
  
  let itemsList = items
    .map(
      (item) =>
        `<li>${item.name} (Qty: ${item.quantity}) - ₹${item.price}</li>`
    )
    .join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Your Order #${orderId} Confirmation`,
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Order ID: <strong>${orderId}</strong></p>
      <p>Status: <strong>${status}</strong></p>
      <ul>${itemsList}</ul>
      <p>Total Amount: <strong>₹${total}</strong></p>
      <p>We will notify you once your order is shipped.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("Order email sent to:", to);
};

module.exports = { sendOrderEmail };
