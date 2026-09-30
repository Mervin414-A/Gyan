import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  if (!token || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;