import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

function HomepageWrapper({ children }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {

    // Only for not logged-in users
    const handleClick = (event) => {
      // If the click is inside the navbar, do nothing
    if (user.userId) navigate('/UserDashBoard'); // logged in, do nothing

      const navbar = document.getElementById("main-navbar");
      if (navbar && navbar.contains(event.target)) return;

      // Otherwise redirect to login
      navigate("/login");
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [user, navigate]);

  return children;
}

export default HomepageWrapper;
