import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import UserService from "../Service/UserService";
import UserContext from "../context/UserContext";
import { FaTrashAlt } from "react-icons/fa";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState("");

  // Fetch user data
  useEffect(() => {
    if (!user?.userId) return;
    const fetchUser = async () => {
      try {
        const res = await UserService.getUser(user.userId);
        setUserData(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [user?.userId]);

  // Handle input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Save profile changes
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await UserService.updateProfile(user.userId, formData);
      setUserData(formData);
      setIsEditing(false);
      alert(res.data.message || "Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  // Handle password modal input
  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  // Save new password
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMsg("❌ New password & confirm password do not match!");
      return;
    }
    try {
      const res = await UserService.changePassword(user.userId, passwordData);
      setMsg(res.data || "Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      setMsg("Failed to change password");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    navigate("/", { replace: true });
  };

  // Delete profile
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?"))
      return;

    try {
      await UserService.deleteProfile(user.userId);
      alert("Profile Deleted Successfully!");
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error deleting profile:", err);
      alert("Failed to delete profile");
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end mb-2">
        <button
          className="btn btn-close"
          onClick={() => navigate("/UserDashBoard")}
        ></button>
      </div>
      <div className="row g-4">
        {/* Left Profile Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow rounded-4 text-center p-4">
            <div
              className="rounded-circle border border-3 border-primary mx-auto mb-3 d-flex align-items-center justify-content-center bg-light"
              style={{ width: "150px", height: "150px", fontSize: "50px" }}
            >
              👤
            </div>
            <h4 className="fw-bold">{userData.name}</h4>
            <p className="text-muted">{userData.email}</p>

            {!isEditing ? (
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil-square me-2"></i> Edit Profile
              </button>
            ) : (
              <button
                className="btn btn-secondary w-100 mt-3"
                onClick={() => setIsEditing(false)}
              >
                ❌ Cancel
              </button>
            )}

            <button
              className="btn btn-danger w-100 mt-3"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
            <button
              className="btn btn-danger w-100 mt-3 fw-bold"
              onClick={handleDelete}
            >
              <FaTrashAlt className="me-2 mb-1" />
              Delete Profile
            </button>
            {msg && (
              <strong className="text-success d-block mt-2">{msg}</strong>
            )}
          </div>
        </div>

        {/* Right Details */}
        <div className="col-md-8">
          <div className="card border-0 shadow rounded-4 p-4">
            <h5 className="mb-3">
              <i className="bi bi-person-lines-fill me-2"></i> Profile Details
            </h5>
            <hr />

            {!isEditing ? (
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="fw-semibold">Full Name</label>
                  <p className="form-control bg-light">{userData.name}</p>
                </div>
                <div className="col-md-6">
                  <label className="fw-semibold">Email</label>
                  <p className="form-control bg-light">{userData.email}</p>
                </div>
                <div className="col-md-6">
                  <label className="fw-semibold">Contact</label>
                  <p className="form-control bg-light">{userData.contact}</p>
                </div>
                <div className="col-12">
                  <label className="fw-semibold">Address</label>
                  <p className="form-control bg-light">{userData.address}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="row g-3">
                <div className="col-md-6">
                  <label className="fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="fw-semibold">Contact</label>
                  <input
                    type="text"
                    className="form-control"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <label className="fw-semibold">Address</label>
                  <textarea
                    className="form-control"
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="col-12 text-end">
                  <button type="submit" className="btn btn-success">
                    💾 Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Security Section */}
          <div className="card border-0 shadow rounded-4 p-4 mt-4">
            <h5 className="mb-3">
              <i className="bi bi-shield-lock me-2"></i> Security
            </h5>
            <hr />
            <button
              className="btn btn-outline-danger"
              onClick={() => setShowPasswordModal(true)}
            >
              <i className="bi bi-lock me-2"></i> Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-lock me-2"></i> Change Password
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPasswordModal(false)}
                ></button>
              </div>
              <form onSubmit={handlePasswordSave}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="fw-semibold">Old Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="fw-semibold">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="fw-semibold">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    💾 Save Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
