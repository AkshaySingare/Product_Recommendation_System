import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useState, useEffect, useContext } from "react";
import { Dropdown } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";

import AdminService from "../Service/AdminService";
import UserService from "../Service/UserService";
import UserContext from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "bootstrap/dist/js/bootstrap.bundle.min";
import { ThemeContext } from "../context/ThemeContext";

export default function UserDashBoard() {

  // console.log("running", Math.random());
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [searchProduct, setSearchProducts] = useState([]); //store products for searching

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Take Image from WishList File and show here
  const location = useLocation();

  useEffect(() => {
    // console.log("UserDashboard rendered at", new Date().toISOString());

    if (location.state?.item) {
      //  console.log(location.state.item);
      setSelectedProduct(location.state.item);
    }
  }, []);

  // fetch User id andd Name that  Saved in Login page
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  // console.log(user);

  //Check user Valid or not ??
  const [userData, setUserData] = useState(); //for pass data to checkout page
  useEffect(() => {
    // console.log(user.userId);
    let token = localStorage.getItem("jwtToken");
    // let storedUser = JSON.parse(localStorage.getItem("user"));
    // //  alert(storedUser.id)

    // if (!storedUser.id || !token) {
    //   alert("True");
    //   localStorage.clear();
    //   window.location.href = "/";
    // }
    // console.log(user.userId," token ",token);
    if (!token) {
      window.location.href = "/";
    } else {
      UserService.getProfile(user.userId, token)
        .then((e) => {
          // console.log("Data  ", e.data);
          setUserData(e.data[0]);
          if(user.userId){
            if (e.data[0].id !== user.userId) {
              window.location.href = "/";
            }
          }
        })
        .catch((err) => {
          if (err.status == 403) {
            setUser(null);
            localStorage.removeItem("jwtToken");
            window.location.href = "/";
          }
          console.log(err);
        });
    }
  }, []);

  // Load products + categories
  useEffect(() => {
    AdminService.viweProduct()
      .then((result) => {
        setProducts(result.data);
        setSearchProducts(result.data); //add products in searchProduct
      })
      .catch((err) => console.log(err));

    AdminService.showCategories()
      .then((result) => setCategories(result.data))
      .catch((err) => console.log(err));
  }, [refresh]); //refresh

  // Filter by category
  const categoryHandler = (id) => {
    // console.log(id);

    UserService.fetchProduct(id)
      .then((res) => {
        // console.log(res.data);
        setSearchProducts(res.data);
        setCurrentPage(1);
      })
      .catch((err) => console.log(err));
  };

  // Cart
  const [cartCount, setCartCount] = useState(0);
  const [cartRefresh, setCartRefresh] = useState(0);
  //This Hook For Fetch Neccesory Data From Products and Carts
  const [cartProduct, setCartProduct] = useState([]);

  // Add to Cart
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  const triggerCartAnimation = () => {
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 1000); // reset after animation
  };
  const addToCart = (product) => {
    UserService.addInCart(user.userId, product.id)
      .then(() => {
        // console.log(res);
        setCartRefresh((prev) => prev + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Fetched Carts Info From DB
  useEffect(() => {
    UserService.getCartData(user.userId)
      .then((res) => {
        // console.log(res);
        setCartCount(res.data.length);
        setCartProduct(res.data);
        // setUserName(res.data[0].userName);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cartRefresh]);

  // In Cart Descrese Product Quantity(Count)
  let descreseQuantity = (id) => {
    // console.log(id);
    UserService.quantity(id, "minus")
      .then(() => {
        // console.log(e.data);x
        setCartRefresh((prev) => prev + 1);
      })
      .catch((err) => console.log(err));
  };

  let increseQuantity = (id) => {
    // console.log(id);
    UserService.quantity(id, "plus")
      .then(() => {
        // console.log(e.data);
        setCartRefresh((prev) => prev + 1);
      })
      .catch((err) => console.log(err));
  };

  //* Search-Bar Logic
  let searchBar = (val) => {
    // console.log(val);
    let searchVal = products.filter((item) =>
      item.name.toLowerCase().includes(val.toLowerCase())
    );
    setSearchProducts(searchVal);
  };

  //* Like Handler
  const [likeRefresh, setLikeRefresh] = useState(0); //every time like are update then it should reflact
  const [allLikes, setAllLikes] = useState([]);
  useEffect(() => {
    //Fetch All likes
    UserService.fetchAllLikes()
      .then((e) => {
        // console.log(e);
        const likesObject = Object.fromEntries(
          e.data.map((item) => [item.product_id, item.liked])
        );
        setAllLikes(likesObject);
      })
      .catch((err) => console.log(err));
  }, [likeRefresh]);

  const [likes, setLikes] = useState({}); // store all likes product wise
  useEffect(() => {
    //fetch this ueser likes only.
    UserService.showLike(user.userId)
      .then((e) => {
        // console.log(e);
        const likesObject = Object.fromEntries(
          e.data.map((item) => [item.product_id, item.liked])
        );
        // console.log(likesObject);
        setLikes(likesObject);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [likeRefresh]);

  const toggleLike = (productId) => {
    //  console.log("Likes  "+JSON.stringify(likes));
    const isLiked = !!likes[productId]; // check current state
    const msg = isLiked ? "delete" : "add";

    UserService.managelike(user.userId, productId, msg)
      .then(() => {
        // console.log(e);
        setLikeRefresh((prev) => prev + 1);
      })
      .catch((err) => console.log(err));
  };

  //* Track views
  const [viewedProducts, setViewedProducts] = useState(new Set()); // save  here all view products
  const [viewRefresh, setViewRefresh] = useState(0);
  const [views, setViews] = useState({});

  // fetch all products all views
  useEffect(() => {
    UserService.fetchViews()
      .then((e) => {
        // console.log(e);
        let viewObject = Object.fromEntries(
          e.data.map((item) => [item.product_id, item.viewed])
        );
        // console.log("viewObject ")
        // console.log(viewObject)
        setViews(viewObject);
      })
      .catch((err) => console.log(err));
  }, [viewRefresh]);

  const [selectedProduct, setSelectedProduct] = useState(null); // save those are selected

  useEffect(() => {
    // console.log("selectedProduct ");
    // console.log(selectedProduct);
    // fetch user vise views
    UserService.fetchUserview(user.userId)
      .then((e) => {
        // console.log(e);
        setViewedProducts(new Set(e.data.map((item) => item.product_id))); //store the this user view products
    //  console.log(viewedProducts)
      })
      .catch((err) => console.log(err));
      
   //check product viewed or not if not then add view
    if (selectedProduct && !viewedProducts.has(selectedProduct.id)) {
      // console.log(selectedProduct);
      UserService.addView(user.userId, selectedProduct.id)
        .then(() => {
          // console.log(e);
          // console.log(selectedProduct.id);
          setViewRefresh((prev) => prev + 1);
        })
        .catch((err) => console.log(err));
    }
  }, [selectedProduct]);
  


  // Load category products when modal opens
  useEffect(() => {
    if (selectedProduct) {
      UserService.fetchProduct(selectedProduct.category_id)
        .then((res) => {
          //  let p=[];
          UserService.recommendatedProduct(selectedProduct.id)
            .then((e) => {
              // console.log(e.data);
              const prod = e.data.map((item) => item.recommended_product);
              // console.log("Prod",prod)
              let p = products.filter((item) => prod.includes(item.id));

              const combined = [...p, ...res.data]; // Combine

              // Remove duplicates based on product id
              const uniqueProducts = Array.from(
                new Map(combined.map((item) => [item.id, item])).values()
              );
              setCategoryProducts(uniqueProducts);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  }, [selectedProduct]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = searchProduct.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(searchProduct.length / productsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Dark Mode Logic
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const DarkModeButton = () => {};

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="container-fluid py-4">
        {/* Header */}
        {/* NAVBAR CONTAINER */}
        <div className="d-flex flex-column gap-2 mb-4 px-2">
          {/* ====== TOP ROW ====== */}
          <div className="d-flex justify-content-between align-items-center">
            {/* Left: Title */}
            <h3 className="fw-bold text-primary mb-0">
              <i className="bi bi-bag-check"></i> Browse Products
            </h3>

            {/* Right: Desktop Tabs */}
            <div className="d-none d-md-flex align-items-center gap-3">
              {/* Dark Mode */}
              <button
                className={`btn rounded-circle shadow-sm ${
                  darkMode ? "btn-light" : "btn-dark"
                }`}
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? "☀" : "🌙"}
              </button>

              {/* Cart */}
              <button
                className={`btn btn-info fw-bold rounded-circle position-relative shadow-sm ${
                  isCartAnimating ? "cart-bounce" : ""
                }`}
                onClick={() => setShowCart((prev) => !prev)}
              >
                <i className="fs-5 bi bi-cart4"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow">
                  {cartCount}
                </span>
              </button>

              {/* Profile Dropdown */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-basic"
                  className="shadow-sm rounded-circle px-2"
                >
                  <i className="bi bi-person-circle fs-4 text-primary"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate("/orders")}>
                    📦 Your Orders
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/wishList")}>
                    ❤️ Wishlist
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/profile")}>
                    👤 Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    className="text-danger fw-bold"
                    onClick={() => {
                      setUser(null);
                      localStorage.clear();
                      window.location.href = "/";
                    }}
                  >
                    <FaSignOutAlt /> Log Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* Right: Mobile Menu Button */}
            <div className="d-md-none">
              <button
                className="btn btn-outline-primary"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <i className="bi bi-list fs-4"></i>
              </button>
            </div>
          </div>

          {/* ====== MOBILE MENU (ABOVE SEARCH BAR) ====== */}
          {menuOpen && (
            <div className="d-md-none bg-white shadow rounded p-3 animate__animated animate__fadeInDown">
              <button
                className={`btn w-100 mb-2 ${
                  darkMode ? "btn-light" : "btn-dark"
                }`}
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
              </button>

              <button
                className="btn btn-info w-100 fw-bold rounded-pill mb-2 position-relative"
                onClick={() => setShowCart((prev) => !prev)}
              >
                <i className="bi bi-cart4 me-2"></i> Cart
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow">
                  {cartCount}
                </span>
              </button>

              <button
                className="btn btn-outline-primary w-100 mb-2"
                onClick={() => navigate("/orders")}
              >
                📦 Your Orders
              </button>
              <button
                className="btn btn-outline-primary w-100 mb-2"
                onClick={() => navigate("/wishList")}
              >
                ❤️ Wishlist
              </button>
              <button
                className="btn btn-outline-primary w-100 mb-2"
                onClick={() => navigate("/profile")}
              >
                👤 Profile
              </button>
              <button
                className="btn btn-outline-danger w-100 fw-bold"
                onClick={() => {
                  setUser(null);
                  localStorage.clear();
                  window.location.href = "/";
                }}
              >
                <FaSignOutAlt /> Log Out
              </button>
            </div>
          )}

          {/* ====== SEARCH BAR ====== */}
          <div>
            <input
              type="text"
              name="search"
              placeholder="🔎 Search your favorite products..."
              className="form-control border-primary shadow-sm rounded-pill px-4"
              onChange={(e) => searchBar(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <nav className="d-flex flex-wrap gap-2 mb-4">
          <button
            className="btn btn-sm rounded-pill shadow-sm btn-custom fw-bold"
            onClick={() => setRefresh((r) => r + 1)}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="btn btn-outline-primary btn-sm rounded-pill shadow-sm"
              onClick={() => categoryHandler(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Product Grid */}
        <div className="row g-4">
          {currentProducts.length === 0 ? (
            <p className="text-center text-muted">Loading products...</p>
          ) : (
            currentProducts.map((p) => (
              
              <div className="col-6 col-md-3 mb-4" key={p.id}>
              
                <div className="card shadow border-0 h-100 position-relative hover-card rounded-4">
                  {/* Image container */}
                  <div
                    className="card-img-container rounded-top"
                    style={{
                      height: "200px",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={`http://localhost:3000${p.image_url}`}
                      alt={p.name}
                      className="w-100 h-100"
                      style={{
                        objectFit: "contain",
                        transition: "transform 0.3s",
                      }}
                      onClick={() => setSelectedProduct(p)}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </div>

                  {/* Discount badge */}
                  <span className="badge bg-danger position-absolute top-0 end-0 m-2 rounded-pill px-3 py-2 shadow">
                    {Math.round(((p.price - p.discount_price) / p.price) * 100)}
                    % OFF
                  </span>

                  {/* Card body */}
                  <div className="card-body text-center d-flex flex-column">
                    <h6 className="fw-bold text-truncate">{p.name}</h6>
                    <p className="text-success fw-bold mb-1">
                      ₹{p.discount_price}{" "}
                      <span className="text-muted text-decoration-line-through ms-1">
                        ₹{p.price}
                      </span>
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <button
                        className="btn btn-sm btn-success shadow-sm rounded-pill px-3"
                        onClick={() => {
                          addToCart(p);
                          triggerCartAnimation();
                        }}
                      >
                        <i className="bi bi-cart-plus me-1"></i> Add
                      </button>
                      <button
                        className={`btn btn-sm shadow-sm rounded-circle ${
                          likes[p.id] ? "btn-danger" : "btn-outline-danger"
                        }`}
                        onClick={() => toggleLike(p.id)}
                      >
                        <i className="bi bi-heart"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination pagination-sm">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button className="page-link" onClick={handlePrev}>
                  Previous
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  Page {currentPage} of {totalPages}
                </span>
              </li>
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button className="page-link" onClick={handleNext}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div
          className="modal fade show"
          style={{ display: "inline-block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            {/* {console.log("hello")} */}
            <div className="modal-content shadow-lg">
              <div className="modal-header">
                <h5 className="fw-bold">{selectedProduct.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedProduct(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* Left: Image + small info */}
                  <div className="col-md-5 text-center border-end">
                    <img
                      src={`http://localhost:3000${selectedProduct.image_url}`}
                      className="img-fluid mb-3 rounded"
                      alt={selectedProduct.name}
                      style={{ maxHeight: "300px", objectFit: "contain" }}
                    />
                    <p className="text-muted">{selectedProduct.description}</p>
                  </div>

                  {/* Right: Full info */}
                  <div className="col-md-7">
                    <h4 className="fw-bold">{selectedProduct.name}</h4>
                    <h5 className="text-success fw-bold">
                      ₹{selectedProduct.discount_price}
                    </h5>
                    <h6 className="text-muted fw-bold text-decoration-line-through">
                      ₹{selectedProduct.price}
                    </h6>
                    <h6 className="text-primary fw-bold">
                      Save ₹
                      {selectedProduct.price - selectedProduct.discount_price}
                    </h6>
                    //todo Incomplete to show likes using key and values
                    <p className="text-secondary">
                      👁 Views: {views[selectedProduct.id] || 0} | ❤️ Likes:{" "}
                      {allLikes[selectedProduct.id]
                        ? allLikes[selectedProduct.id]
                        : 0}
                    </p>
                    <button
                      className="btn btn-success btn-lg mt-3"
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                        triggerCartAnimation();
                      }}
                    >
                      <i className="bi bi-cart-plus"></i> Add Cart
                    </button>
                  </div>
                </div>

                {/* More products from same category */}
                <hr />
                <h6 className="fw-bold mb-3">
                  More Similar... {selectedProduct.category_name}
                </h6>
                <div className="row">
                  {categoryProducts
                    .filter((p) => p.id !== selectedProduct.id)
                    .map((p) => (
                      <div className="col-6 col-md-3 mb-3" key={p.id}>
                        <div
                          className="card h-100 shadow-sm"
                          onClick={() => setSelectedProduct(p)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={`http://localhost:3000${p.image_url}`}
                            className="card-img-top rounded"
                            style={{ maxHeight: "300px", objectFit: "contain" }}
                            alt={p.name}
                          />

                          <div className="card-body text-center p-2">
                            <h6 className="fw-bold small mb-0">{p.name}</h6>
                            <small className="text-success fw-bold">
                              ₹{p.discount_price}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedProduct(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal (unchanged) */}
      {showCart && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header">
                <h5 className="fw-bold">🛒 Your Cart</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCart(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Show Carts Data when click Carts */}
                {cartProduct.length === 0 ? (
                  <p className="text-center text-muted">Your cart is empty.</p>
                ) : (
                  <ul className="list-group">
                    {cartProduct.map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={`http://localhost:3000${item.image_url}`}
                            alt={item.name}
                            style={{
                              width: "50px",
                              height: "52px",
                              objectFit: "cover",
                            }}
                            className="rounded me-3"
                          />
                          <div>
                            <h6 className="mb-0">{item.name}</h6>
                            <small className="text-success fw-bold">
                              ₹{item.discount_price}
                            </small>
                            <small className=" ms-2 text-muted">
                              ₹{item.price}
                            </small>
                          </div>
                        </div>
                        <span className="p-2 fs-6 badge bg-primary rounded-pill">
                          {item.quantity}
                        </span>
                        <div className="">
                          {/* Minus Icon */}
                          <button
                            className="border-0 fs-3 bg-white "
                            onClick={() => descreseQuantity(item.id)}
                          >
                            <i className="text-danger rounded-pill bi bi-dash-circle"></i>
                          </button>
                          {/* Plus Icon */}
                          <button
                            className=" border-0 fs-3 bg-white "
                            onClick={() => increseQuantity(item.id)}
                          >
                            <i className="text-success rounded-pill bi bi-plus-circle"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowCart(false)}
                >
                  Close
                </button>
                {cartProduct.length > 0 && (
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      navigate(`/checkout`, {
                        state: {
                          userId: user.userId,
                          name: user.userName,
                          userData: userData,
                          cart: cartProduct,
                        },
                      })
                    }
                  >
                    <i className="bi bi-bag-check"></i> Checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
