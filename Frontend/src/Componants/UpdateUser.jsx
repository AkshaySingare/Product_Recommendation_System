import React, { useEffect, useState } from "react";
import UserService from "../Service/UserService";

function UpdateUser({ user, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        contact: user.contact,
        address: user.address,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UserService.updateUser(user.id, formData);
      setMsg("✅ User updated successfully!");
      onUpdated();
      setTimeout(() => {
        setMsg("");
        onClose();
      }, 1000);
    } catch (err) {
      setMsg("❌ Error updating user");
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Update User</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {msg && <div className="alert alert-info text-center">{msg}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    className="form-control"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    ✅ Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateUser;
