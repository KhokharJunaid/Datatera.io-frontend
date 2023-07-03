import React from "react";
import { Routes, Route } from "react-router-dom";
import Signin from "../pages/Signin/signin";
import Signup from "../pages/Signup/signup";
import Home from "../pages/Home/Home";

import { ProtectedAuthRoute, ProtectedRoute } from "./protectedRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        exact
        path="/register"
        element={
          <ProtectedRoute>
            <Signup />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/signin"
        element={
          <ProtectedRoute>
            <Signin />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/"
        element={
          <ProtectedAuthRoute>
            <Home />
          </ProtectedAuthRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
