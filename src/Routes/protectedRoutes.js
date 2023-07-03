import React from "react";
import { Navigate, useParams } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    return <Navigate to="/" />;
  }
  return children;
};

const ProtectedAuthRoute = ({ children }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (!token) {
    return <Navigate to="/signin" />;
  }
  return children;
};

export { ProtectedAuthRoute, ProtectedRoute };
