import React, { useContext, useEffect, useState } from "react";
import { FaTrashAlt, FaCartPlus } from "react-icons/fa";
import UserService from "../Service/UserService";
import UserContext from "../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const API_URL = "http://localhost:3000";
  const { user } = useContext(UserContext);
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();

  // Fetch wishlist from API
  useEffect(() => {
    if (user.userId) {
      UserService.wishList(user.userId)
        .then((e) => {
          const obj = Object.values(e.data);
          setWishlist(obj);
        })
        .catch((err) => console.log(err));
    }
  }, [user.userId]);

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    // console.log(productId)
    UserService.managelike(user.userId, productId)
      .then(() => {
        setWishlist((prev) => prev.filter((item) => item.id !== productId));
      })
      .catch((err) => console.log(err));
  };

  // Add item to cart
  const addToCart = (product) => {
    UserService.addInCart(user.userId, product.id)
      .then(() => alert(`${product.name} added to cart`))
      .catch((err) => console.log(err));
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">My Wishlist</h1>
      <div className="d-flex justify-content-end mb-2">
        <button
          className="btn btn-close p-2 fs-5"
          style={{ transform: "scale(1.2)" }}
          onClick={() => navigate("/UserDashBoard")}
        ></button>
      </div>

      {wishlist.length === 0 ? (
        <p className="text-center text-muted">Your wishlist is empty.</p>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {wishlist.map((item) => (
            <div key={item.id} className="col">
              <div className="card h-100 shadow-sm">
                <div
                  className="d-flex align-items-center justify-content-center bg-white"
                  style={{ height: "250px" }} // fixed height for uniform cards
                   onClick={() => navigate("/UserDashBoard", { state: { item: item } })}
                >
                  <img
                    src={
                      item.image_url
                        ? `${API_URL}/${item.image_url}`
                        : "/placeholder.png"
                    }
                    alt={item.name}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain", // ensures full image is visible
                    }}
                  />
                </div>

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.productName}</h5>
                  <p className="card-text text-muted">{item.description}</p>
                  <p className="mb-0">
                    <strong className=" card-text text-primary ">
                      &nbsp; ₹{Number(item.discount_price).toFixed(2)}
                    </strong>
                    <strong className="ms-2 card-text text-muted text-decoration-line-through">
                      ₹{Number(item.price).toFixed(2)}
                    </strong>
                  </p>
                  <strong className="ms-3 card-text text-success ">
                    Save: &nbsp; ₹
                    {Number(item.price) - Number(item.discount_price)}
                  </strong>

                  <div className="mt-auto d-flex justify-content-between">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeFromWishlist(item.id)}
                      title="Remove from wishlist"
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => addToCart(item)}
                      title="Add to cart / Purchase"
                    >
                      <FaCartPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
