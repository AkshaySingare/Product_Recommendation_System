import React, { useEffect, useState } from "react";
import AdminService from "../Service/AdminService";
import "bootstrap/dist/css/bootstrap.min.css";

const statusColors = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "danger",
};

const UsersOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    AdminService.getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setError("⚠️ Failed to fetch orders. Try again later."))
      .finally(() => setLoading(false));
  };

  const getUserName = (order) =>
    order.user?.name ||
    order.username ||
    order.userName ||
    order.user_email ||
    `User #${order.userId}` ||
    "Unknown User";

  const groupedOrders = orders.reduce((acc, order) => {
    const userName = getUserName(order);
    if (!acc[userName]) acc[userName] = [];
    acc[userName].push(order);
    return acc;
  }, {});

  const filteredUsers = Object.keys(groupedOrders).filter((userName) =>
    userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUserClick = (userName) => {
    setSelectedUser(userName);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleStatusChange = (orderId, newStatus, productId,order) => {
    // console.log(order);
    AdminService.updateOrderStatus(orderId, newStatus, productId,order)
      .then(() =>
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId && order.productId === productId
              ? { ...order, status: newStatus } // update only this product
              : order
          )
        )
      )
      .catch(() => alert("Failed to update status"));
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary me-3" role="status" />
        <span className="fs-5 fw-semibold">Loading orders...</span>
      </div>
    );

  //  Delete A Prodcuts after Deliverd
  let deleteProduct = (orderId,productId) => {
    // console.log(id);
    AdminService.deleteOrder(orderId,productId)
      .then(() => {
        fetchOrders();
        // console.log(e);
      })
      .catch((err) => console.log(err));
  };

  if (error)
    return <p className="text-center mt-5 fs-5 text-danger">{error}</p>;

  return (
    <div className="container-fluid ">
      <h2 className="fw-bold text-center text-primary mb-3">📦 Users Orders</h2>

      <div className="row justify-content-center ">
        {/* Center Column */}
        <div className="col-12 ">
          {/* Search Bar */}
          <div className="mb-4 ">
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* User List */}
          <h4 className="text-start  mb-3 ">List of Users Orders</h4>
          <div
            className="list-group shadow-sm rounded"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            {currentUsers.map((userName) => (
              <button
                key={userName}
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                  selectedUser === userName
                    ? "active bg-primary text-white"
                    : ""
                }`}
                onClick={() => handleUserClick(userName)}
              >
                {userName}
                <span
                  className={`badge ${
                    selectedUser === userName
                      ? "bg-light text-dark"
                      : "bg-secondary text-light"
                  } ms-2`}
                >
                  {groupedOrders[userName].length}
                </span>
              </button>
            ))}

            {currentUsers.length === 0 && (
              <p className="text-muted text-center mt-2">No users found</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                {[...Array(totalPages)].map((_, idx) => (
                  <li
                    key={idx}
                    className={`page-item ${
                      currentPage === idx + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content shadow-lg rounded-3 border-0">
              {/* Header */}
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title d-flex align-items-center gap-2">
                  👤 Orders of <span className="fw-bold">{selectedUser}</span>
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body p-3">
                {groupedOrders[selectedUser].length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle mb-0">
                      <thead className="table-primary sticky-top">
                        <tr>
                          <th>Order ID</th>
                          <th>Product</th>
                          <th>Image</th>
                          <th>Price</th>
                          <th>Discount</th>
                          <th>Qty</th>
                          <th>Total</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedOrders[selectedUser]
                          .sort(
                            (a, b) =>
                              new Date(b.orderDate) - new Date(a.orderDate)
                          )
                          .map((order) => {
                            const total =
                              order.totalPrice ??
                              (order.discount_price ?? order.price ?? 0) *
                                (order.quantity ?? 1);
                            const imageSrc = order.image_url
                              ? `http://localhost:3000/${order.image_url}`
                              : "https://via.placeholder.com/60";

                            return (
                              <tr key={`${order.orderId}_${order.productId}`}>
                                <td className="fw-semibold text-primary">
                                  #{`O${order.orderId}_P${order.productId}`}
                                </td>
                                <td>{order.productName || "-"}</td>
                                <td>
                                  <img
                                    src={imageSrc}
                                    alt={order.productName || "Product"}
                                    className="rounded shadow-sm"
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </td>
                                <td>₹{Number(order.price ?? 0).toFixed(2)}</td>
                                <td className="text-success fw-bold">
                                  ₹
                                  {Number(order.discount_price ?? 0).toFixed(2)}
                                </td>
                                <td>{order.quantity ?? 1}</td>
                                <td className="fw-bold text-success">
                                  ₹{Number(total).toFixed(2)}
                                </td>
                                <td>
                                  {order.orderDate
                                    ? new Date(
                                        order.orderDate
                                      ).toLocaleDateString("en-IN")
                                    : "-"}
                                </td>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <select
                                      className="form-select form-select-sm shadow-sm"
                                      value={order.status ?? "pending"}
                                      onChange={(e) =>
                                        handleStatusChange(
                                          order.orderId,
                                          e.target.value,
                                          order.productId,
                                          order,
                                        )
                                      }
                                    >
                                      {Object.keys(statusColors).map(
                                        (status) => (
                                          <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() +
                                              status.slice(1)}
                                              
                                          </option>
                                        )
                                      )}
                                    </select>
                                    <span
                                      className={`badge bg-${
                                        statusColors[order.status ?? "pending"]
                                      }`}
                                      style={{
                                        minWidth: "70px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {(
                                        order.status ?? "pending"
                                      ).toUpperCase()}
                                    </span>
                                    <button
                                      onClick={() =>
                                        deleteProduct(order.orderId,order.productId)
                                      }
                                    >
                                      {" "}
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted fs-5">
                    No orders for {selectedUser}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer bg-light">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersOrder;
