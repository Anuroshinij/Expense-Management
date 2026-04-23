import { Navigate } from "react-router-dom";
import { getToken, getUserRole } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = getToken();

  // Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const role = getUserRole();

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Allowed
  return children;
};

export default ProtectedRoute;