import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserService from "../Service/UserService";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  // console.log(state);

  const [cart, setCart] = useState([]);
  const [price, setPrice] = useState(0); // Original Total
  const [discountPrice, setDiscountPrice] = useState(0); // Discounted Total
  const [products, setProducts] = useState([]);

  // ✅ Initialize cart when state changes
  useEffect(() => {
        let token = localStorage.getItem('jwtToken');
    if(!token) window.location='/';
    if (state?.cart) {
      const prod = state.cart.map((item) => ({
        id: item.product_id,
        quantity: item.quantity,
      }));
      setProducts(prod);
      setCart(state.cart);
    }
  }, [state]);

  // ✅ Calculate totals (with quantity)
  useEffect(() => {
    if (cart.length > 0) {
      const totalPrice = cart.reduce(
        (sum, val) => sum + Number(val.price) * (val.quantity || 1),
        0
      );
      setPrice(totalPrice);

      const totalDiscount = cart.reduce(
        (sum, val) =>
          sum + Number(val.discount_price || val.price) * (val.quantity || 1),
        0
      );
      setDiscountPrice(totalDiscount);
    }
  }, [cart]);

  // ✅ Initialize form data (camelCase everywhere)
  const [formData, setFormData] = useState({
    userId: state?.userData?.id,
    fullName: state?.userData?.name || "",
    email: state?.userData?.email || "",
    phone: state?.userData?.contact || "",
    address: state?.userData?.address || "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "cod",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        ...formData,
        totalAmount: price,
        discountAmount: discountPrice,
      };
      // console.log(orderData);

      const res = await UserService.placeOrder(orderData, products);

      if (res.data.success) {
        alert("✅ Order placed successfully!");
        navigate("/UserDashBoard");
      } else {
        alert("❌ Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("❌ Something went wrong!");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold text-center text-primary">🛒 Checkout</h2>
        <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-close" onClick={()=> navigate('/UserDashBoard')}></button>
      </div>
      <div className="row g-4">
        {/* Billing Details */}
        <div className="col-md-7">
          <div className="card shadow-lg border-0 rounded-3 p-4">
            <h5 className="mb-3 text-secondary fw-bold">Billing Details</h5>
            <form onSubmit={handleSubmit}>
              {["fullName", "email", "phone", "address"].map((field, idx) => (
                <div className="mb-3" key={idx}>
                  <label className="form-label fw-semibold">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === "address" ? (
                    <textarea
                      className="form-control rounded-3"
                      name={field}
                      rows="2"
                      value={formData[field]}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      className="form-control rounded-pill"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                    />
                  )}
                </div>
              ))}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">City</label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">State</label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Zip Code</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                />
              </div>

              <h6 className="mt-4 fw-bold">Payment Method</h6>
              {["cod", "card"].map((method) => (
                <div className="form-check" key={method}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    {method === "cod"
                      ? "Cash on Delivery"
                      : "Credit/Debit Card"}
                  </label>
                </div>
              ))}

              <button
                type="submit"
                className="btn btn-success mt-4 w-100 rounded-pill fw-bold"
              >
                ✅ Place Order
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-5">
          <div className="card shadow-lg border-0 rounded-3 p-4">
            <h5 className="mb-3 text-secondary fw-bold">Order Summary</h5>
            <ul className="list-group mb-3">
              {cart.length <= 0 ? (
                <p className="text-center text-muted">No Products In Cart..</p>
              ) : (
                cart.map((item) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center border-0 mb-2 shadow-sm rounded-3"
                    key={item.id}
                  >
                    <img
                      className="rounded"
                      width="60"
                      height="70"
                      src={`http://localhost:3000${item.image_url}`}
                      alt={item.name}
                    />
                    <div className="flex-grow-1 ms-3">
                      <span className="fw-semibold">{item.name}</span>
                      <div>
                        <span className="text-success fw-bold">
                          ₹{item.discount_price}
                        </span>{" "}
                        <span className="text-muted text-decoration-line-through small">
                          ₹{item.price}
                        </span>
                        <span className="ms-3 badge bg-primary">
                          Qty: {item.quantity}
                        </span>
                      </div>
                      <div className="small text-muted">
                        Subtotal:{" "}
                        <span className="fw-bold text-dark">
                          ₹{item.quantity * item.discount_price}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
              )}
              <li className="list-group-item d-flex justify-content-between fw-bold border-0">
                <span>Total (Original)</span>
                <strong>₹{price}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between fw-bold border-0">
                <span className="text-success">Discounted Total</span>
                <strong className="text-success">₹{discountPrice}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between fw-bold border-0">
                <span className="text-danger">You Save</span>
                <strong className="text-danger">
                  ₹{price - discountPrice}
                </strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
