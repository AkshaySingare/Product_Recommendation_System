import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import UserService from "../Service/UserService";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
        let token = localStorage.getItem('jwtToken');
    if(!token) window.location='/';
    
    if (user?.userId) {
      UserService.fetchOrders(user.userId)
        .then((res) => {
          // Group products by order_id
          const orderMap = {};
          res.data.forEach((item) => {
            if (!orderMap[item.order_id]) {
              orderMap[item.order_id] = {
                order_id: item.order_id,
                order_date: item.order_date,
                status: item.status || "Pending",
                total_amount: item.total_amount,
                products: [],
              };
            }
            orderMap[item.order_id].products.push({
              name: item.product_name,
              quantity: item.quantity,
              image: item.image,
            });
          });
          setOrders(Object.values(orderMap));
        })
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [user?.userId]);

  let downloadInvoice = (orderId)=>{
    console.log(orderId)
    UserService.Invoice(orderId).then((e)=>{
      // console.log(e);
      const url = window.URL.createObjectURL(new Blob([e.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${orderId}.pdf`); // file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    }).catch((err)=>console.log(err));
  }

  return (
    <div className="container py-4">
      <h3 className="mb-4">
        <i className="bi bi-box-seam me-2"></i> My Orders
      </h3>
      <div className="d-flex justify-content-end mb-2">
        <button
          className="btn btn-close"
          onClick={() => navigate("/UserDashBoard")}
        ></button>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i> No orders found.
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div key={order.order_id} className="col-md-12">
              <div className="card border-0 shadow rounded-4 p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold">
                    <i className="bi bi-receipt-cutoff me-2"></i> Order #
                    {order.order_id}
                  </h5>

                  <div>
                    <span
                      className={`badge px-3 py-2 ${
                        order.status === "Delivered"
                          ? "bg-success"
                          : order.status === "Shipped"
                          ? "bg-primary"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {order.status}
                    </span>
                    <button className=" ms-4 fw-bold border-0 text-primary"
                    onClick={()=>downloadInvoice(order.order_id)}
                    >
                      Invoice
                    </button>
                  </div>
                </div>

                <p className="mb-2">
                  <i className="bi bi-calendar-event me-2"></i>
                  <strong>Date:</strong>{" "}
                  {new Date(order.order_date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>

                <p className="mb-3">
                  <i className="bi bi-currency-rupee me-2"></i>
                  <strong>Total:</strong> {order.total_amount}
                </p>

                <div className="d-flex flex-wrap gap-4">
                  {order.products.map((product, idx) => (
                    <div
                      key={idx}
                      className="text-center p-2 border rounded shadow-sm bg-light"
                      style={{ minWidth: "120px" }}
                    >
                      <img
                        src={`http://localhost:3000${product.image}`}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="rounded mb-2"
                      />
                      <div className="small fw-bold">{product.name}</div>
                      <div className="text-muted">Qty: {product.quantity}</div>
                    </div>
                  ))}
                </div>

                {/* <div className="text-end mt-3">
                  <button className="btn btn-outline-primary btn-sm me-2">
                    <i className="bi bi-eye me-1"></i> View Details
                  </button>
                  <button className="btn btn-outline-danger btn-sm">
                    <i className="bi bi-arrow-repeat me-1"></i> Return
                  </button>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
