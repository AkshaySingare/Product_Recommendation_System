import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import UserService from "../Service/UserService";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [stats] = useState({
    likes: 0,
    cart: 0,
  });
  const [editing, setEditing] = useState(false);

  // Load user details & stats
  // useEffect(() => {
  //   if (user?.userId) {
  //     UserService.getUserById(user.userId)
  //       .then((res) => {
  //         setFormData({
  //           name: res.data.name || "",
  //           email: res.data.email || "",
  //           phone: res.data.phone || "",
  //           address: res.data.address || "",
  //           password: "",
  //         });
  //       })
  //       .catch((err) => console.log(err));

  //     // UserService.getUserStats(user.userId)
  //     //   .then((res) => setStats(res.data))
  //     //   .catch((err) => console.log(err));
  //   }
  // }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    UserService.updateUser(user.userId, formData)
      .then(() => {
        alert("Profile updated successfully!");
        setEditing(false);
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">My Profile</h2>

      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "650px" }}>
        {/* Profile Header */}
        <div className="text-center mb-4">
          <img
            src="https://via.placeholder.com/120"
            alt="Profile"
            className="rounded-circle mb-3"
          />
          <h5>{formData.name || "User"}</h5>
          <p className="text-muted">{formData.email}</p>
        </div>

        {/* Profile Form */}
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder={editing ? "Enter new password" : "********"}
                value={formData.password}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea
              className="form-control"
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              disabled={!editing}
            ></textarea>
          </div>
        </form>

        {/* Stats Section */}
        <div className="d-flex justify-content-around my-4">
          <div className="text-center">
            <h5 className="text-primary">{stats.likes}</h5>
            <small className="text-muted">Wishlist</small>
          </div>
          <div className="text-center">
            <h5 className="text-success">{stats.cart}</h5>
            <small className="text-muted">Cart Items</small>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-wrap justify-content-between">
          {!editing ? (
            <button
              className="btn btn-outline-primary mb-2"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button className="btn btn-success mb-2" onClick={handleSave}>
                Save
              </button>
              <button
                className="btn btn-secondary mb-2"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </>
          )}
          <a href="/wishlist" className="btn btn-outline-info mb-2">
            Go to Wishlist
          </a>
          <a href="/cart" className="btn btn-outline-success mb-2">
            Go to Cart
          </a>
          <button className="btn btn-danger mb-2" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
