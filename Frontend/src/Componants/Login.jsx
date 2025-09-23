import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import UserService from "../Service/UserService";
import AdminService from "../Service/AdminService";

function LoginPage() {
  const [massege, setMassege] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // default role
  });

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Handle token from Google login or normal login
  useEffect(() => {
    //admin Check
    let t = localStorage.getItem("jwtToken");
      if(t) navigate("/AdminDashBord");
      

    const params = new URLSearchParams(window.location.search);
    const tokenFromGoogle = params.get("token");

    if (tokenFromGoogle) {
      // setUser({ userId: id, userName: name });
      localStorage.setItem("jwtToken", tokenFromGoogle);
      try {
        const payload = JSON.parse(atob(tokenFromGoogle.split(".")[1]));
        // console.log("payload",payload)
        localStorage.setItem(
          "user",
          JSON.stringify({ id: payload.userId, name: payload.name })
        );
        setUser({
          userId: payload.userId,
          userName: payload.name || payload.email,
        });
      } catch (err) {
        console.error("Invalid token:", err);
      }
      // Remove token from URL
      window.history.replaceState({}, document.title, "/login");

      navigate("/UserDashBoard");
    } else {
      // If token already exists from previous login
      const existingToken = localStorage.getItem("jwtToken");
      if (existingToken) navigate("/UserDashBoard");
    }
  }, [setUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.role === "admin") {
      AdminService.CheckAdmin(formData)
        .then((result) => {
          // console.log(result)
          let token = result.data.token;
          localStorage.setItem("jwtToken",token);
          if (token) return navigate("/AdminDashBord");
          else setMassege(result.data.massege);
        })
        .catch((err) => setMassege(err.data));
    } else {
      UserService.checkUser(formData)
        .then((result) => {
          if (result.data === "Invalid Crediatials") {
            setMassege(result.data);
          } else {
            const userData = result.data.data[0];

            localStorage.setItem(
              "user",
              JSON.stringify({ id: userData.id, name: userData.name })
            );
            localStorage.setItem("jwtToken", result.data.token);

            setUser({ userId: userData.id, userName: userData.name });
            navigate("/UserDashBoard");
          }
        })
        .catch((err) => setMassege(err.data));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-lg"
        style={{ width: "400px" }}
      >
        <h2 className="text-center mb-4 text-primary">Login</h2>

        {/* Role selection */}
        <div className="mb-3">
          <label className="form-label text-success fw-bold fs-4">
            Login As
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-select"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Username / Email */}
        {formData.role === "admin" ? (
          <div className="mb-3">
            <label className="form-label">Username</label>
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
        ) : (
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter Email"
              required
            />
          </div>
        )}

        {/* Password */}
        <div className="mb-3">
          <label className="form-label">Password</label>
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

        {/* Submit button */}
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>

        {/* Error message */}
        {massege && <div className="text-danger mt-2">{massege}</div>}

        {/* Signup / Google login */}
        {formData.role === "user" && (
          <div className="text-center mt-3">
            <p>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-decoration-none fw-bold text-primary"
              >
                Sign Up
              </Link>
            </p>
            <button
              className="btn btn-outline-dark w-100 mt-2"
              onClick={() => {
                window.location.href = "http://localhost:3000/api/auth/google"; // Start Google login
              }}
            >
              Continue with Google
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginPage;
