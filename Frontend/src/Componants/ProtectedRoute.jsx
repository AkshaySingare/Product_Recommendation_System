import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("jwtToken"); // or from context

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // renders the nested routes
}

export default ProtectedRoute;
