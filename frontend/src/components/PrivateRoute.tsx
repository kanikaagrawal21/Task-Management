import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  // If token is not found, go to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
export default PrivateRoute;
