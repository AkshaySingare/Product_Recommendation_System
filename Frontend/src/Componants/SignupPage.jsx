import React, { useState,useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../Service/UserService";
import UserContext from "../context/UserContext"

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    //fetched that function to set userId and Name
  const { setUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    let promise = UserService.registerUser(formData);
    promise
      .then((e) => {
        // console.log(e.data[0])
        setUser({
          userId:e.data[0].id,
          userName:e.data[0].name
        });
        navigate("/login");
      })
      .catch((err) => {
        setMsg(err.data);
      });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <motion.form
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded shadow-lg w-100"
        style={{ maxWidth: "600px" }}
      >
        <h2 className="text-center mb-4 text-primary fw-bold">User Signup</h2>

        <div className="row g-3">
          {/* Username */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter username"
              required
            />
          </div>

          {/* Email */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter email"
              required
            />
          </div>

          {/* Password */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm password"
              required
            />
          </div>

          {/* Contact */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Contact</label>
            <input
              type="number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter contact"
              required
            />
          </div>

          {/* Address */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter address"
            />
          </div>
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="btn btn-primary w-100 mt-4"
        >
          Sign Up
        </motion.button>

        {msg && <span className="text-danger d-block mt-2">{msg}</span>}

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-primary fw-semibold">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}

export default SignupPage;
