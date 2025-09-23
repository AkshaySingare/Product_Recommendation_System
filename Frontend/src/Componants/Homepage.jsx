import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // for navbar & modal
import "bootstrap-icons/font/bootstrap-icons.css";
import UserService from "../Service/UserService";
import AdminService from "../Service/AdminService";


function HomePage({ token }) {
  const navigate = useNavigate();
  // console.log("HomePage");
  const API_URL = 'http://localhost:3000';

  // // Check user are present are not if prasent then navigat UseDashBoard not then login page
  // useEffect(() => {
  //   if (token) navigate("/UserDashBoard");
  // }, []);

  // View Products
  const [products, setProducts] = useState([]);
  useEffect(() => {
    AdminService.viweProduct()
      .then((e) => {
        // console.log(e);
        let obj = Object.values(e.data);
        setProducts(obj);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleUserTypeChange = (e) => {
    const selected = e.target.value;
    if (selected) {
      navigate(selected);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav
        id="main-navbar"
        className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top"
      >
        <div className="container-fluid px-5">
          {/* Logo */}
          <Link
            className="navbar-brand fw-bold d-flex align-items-center"
            to="/"
          >
            <i className="bi bi-box-seam me-2"></i> ProductManagement
          </Link>

          {/* Navbar items */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto fw-bold">
              <li className="nav-item">
                <a className="nav-link text-white" href="#customers">
                  <i className="bi bi-people-fill me-1"></i> Our Customers
                </a>
              </li>

              {/* Contact */}
              <li className="nav-item">
                <a className="nav-link text-white" href="#contact">
                  <i className="bi bi-telephone me-1"></i> Contact
                </a>
              </li>

              {/* Login */}
              <li className="nav-item d-flex justify-content-center align-items-center">
                <NavLink to="/login" className="nav-link">
                  <i className="bi bi-person-circle fs-5"></i>{" "}
                  <strong className="fs-5">Login</strong>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className=" hero-section d-flex align-items-center justify-content-center text-center">
        <div className="bg-transparent hero-text-box">
          <h1 className="fw-bold display-5">Welcome to Product Management</h1>
          <p className="lead">
            Discover, shop, and manage your favorite products easily.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg mt-3">
            <i className="bi bi-cart-fill me-2"></i> Start Shopping
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div
        className="container text-center my-5 text-purple-600"
        id="categories"
      >
        <h2 className="section-title mb-4">Shop by Category</h2>
        <div className="row row-cols-2 row-cols-md-4 g-4">
          {[
            { icon: "📱", title: "Electronics" },
            { icon: "👗", title: "Clothes" },
            { icon: "🛒", title: "Grocery" },
            { icon: "💊", title: "Medicine" },
          ].map((cat, i) => (
            <div className="col" key={i}>
              <div className="card p-4 bg-light shadow-sm border-0 h-100 hover-card">
                <div className="category-icon fs-1">{cat.icon}</div>
                <div className="fw-bold mt-2 fs-4">{cat.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <section id="products" className="py-5 bg-light">
        <div className="container">
          <p className="fs-2 section-title text-center mb-4">
            🔥 Featured Products
            <strong className="fs-6 text-info text-center mb-4"> This Products Only for View </strong> 
          </p>
          

<div className="row g-4">
  {products.length === 0 ? (
    <h4 className="text-center text-muted">No Products in App...</h4>
  ) : (
    products.map((item) => (
      <div className="col-6 col-md-4 col-lg-3" key={item.id}>
        <div className="card h-100 shadow-lg border-0 rounded-4 overflow-hidden hover-card">
          <div className="card-img-container position-relative">
            <img
              src={`${API_URL}${item.image_url}`}
              className="card-img-top product-img"
              alt={item.name}
            />
            <span className="badge bg-danger position-absolute top-0 end-0 m-2 rounded-pill px-3 py-2 shadow">
              {Math.round(((item.price - item.discount_price) / item.price) * 100)}% OFF
            </span>
          </div>

          <div className="card-body d-flex flex-column text-center p-3">
            <h5 className="card-title fw-bold text-dark">{item.name}</h5>
            <p className="text-muted small mb-2">{item.description}</p>

            <p className="mb-1">
              <span className="fw-bold text-primary me-2">
                ₹{item.discount_price}
              </span>
              <span className="text-muted text-decoration-line-through">
                ₹{item.price}
              </span>
            </p>

            <p className="text-success fw-semibold">
              Save ₹{item.price - item.discount_price}
            </p>

            <button className="btn btn-success mt-auto w-100 rounded-pill fw-semibold">
              <i className="bi bi-cart me-2"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    ))
  )}
</div>

          
        </div>
      </section>

      {/* Why Choose Us */}
      <div className="bg-light py-5" id="customers">
        <div className="container text-center">
          <h2 className="section-title mb-4">Why Choose Us?</h2>
          <div className="row">
            <div className="col-md-4">
              <i className="bi bi-lightning-charge fs-1 text-warning"></i>
              <h5 className="mt-3">Instant Delivery</h5>
              <p className="text-muted">
                Get your orders delivered within minutes.
              </p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-currency-rupee fs-1 text-success"></i>
              <h5 className="mt-3">Best Prices</h5>
              <p className="text-muted">
                Affordable pricing with great offers.
              </p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-stars fs-1 text-primary"></i>
              <h5 className="mt-3">Top Quality</h5>
              <p className="text-muted">
                We provide only trusted & genuine products.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container my-5">
        <h2 className="section-title text-center mb-4">
          What Our Customers Say
        </h2>
        <div
          id="carouselExample"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {[
              {
                name: "Ravi Kumar",
                text: "Amazing products and fast delivery!",
              },
              {
                name: "Priya Sharma",
                text: "User-friendly and great discounts.",
              },
              {
                name: "Aman Verma",
                text: "Loved the experience, will shop again.",
              },
            ].map((review, i) => (
              <div
                className={`carousel-item ${i === 0 ? "active" : ""}`}
                key={i}
              >
                <div className="d-flex flex-column align-items-center">
                  <i className="bi bi-chat-quote fs-1 text-info"></i>
                  <p className="lead text-center mt-3">{review.text}</p>
                  <h6 className="fw-bold">- {review.name}</h6>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      {/* Contact */}
      <div id="contact" className="container my-5 bg-dark">
        <h2 className="section-title text-center pt-2 ">📞 Get in Touch</h2>
        <p className="lead text-muted text-center mb-5">
          Have questions? We'd love to hear from you. Reach us through any of
          the ways below.
        </p>
        <div className="row g-4 text-center pb-4">
          {/* Address */}
          <div className="col-md-4">
            <div className="card shadow-sm p-4 h-100 border-0 hover-card">
              <i className="bi bi-geo-alt fs-2 text-danger"></i>
              <h5 className="mt-3">Our Office</h5>
              <p>Bangalore, Karnataka, India</p>
            </div>
          </div>

          {/* Email */}
          <div className="col-md-4">
            <div className="card shadow-sm p-4 h-100 border-0 hover-card">
              <i className="bi bi-envelope-at fs-2 text-primary"></i>
              <h5 className="mt-3">Email Us</h5>
              <p>
                <a
                  href="mailto:kashids961@gmail.com"
                  className="text-decoration-none"
                >
                  kashids961@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="col-md-4">
            <div className="card shadow-sm p-4 h-100 border-0 hover-card">
              <i className="bi bi-telephone fs-2 text-success"></i>
              <h5 className="mt-3">Call Us</h5>
              <p>
                <a href="tel:+919890157552" className="text-decoration-none">
                  +91 9890157552
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">
                Login
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="userType" className="form-label">
                  Login As
                </label>
                <select
                  className="form-select"
                  id="userType"
                  onChange={handleUserTypeChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="/AdminLogin">Admin</option>
                  <option value="/UserLogin">User</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center bg-dark text-white py-3">
        <p className="mb-0">© 2025 ProductManagement. All Rights Reserved.</p>
      </footer>

      {/* Styles */}
      <style>{`
          .hero-section {
            height: 600px;
            width: 100%;
            background-size: cover;
            background-position: center;
            animation: change 20s infinite;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .hero-text-box {
            padding: 30px 50px;
            border-radius: 12px;
            color: #000;
            background: rgba(255,255,255,0.6);
          }
          @keyframes change {
            5% { background-image: url("https://images.pexels.com/photos/51958/oranges-fruit-vitamins-healthy-eating-51958.jpeg"); }
            25% { background-image: url("https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg"); }
            50% { background-image: url("https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=870&auto=format&fit=crop"); }
            100% { background-image: url("https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop"); }
          }
        .hover-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
          .section-title {
            font-weight: bold;
            font-size: 2rem;
            color: #0d6efd;
          }
        `}</style>
    </>
  );
}

export default HomePage;
