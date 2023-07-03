import React from "react";
import { Routes, Route } from "react-router-dom";
import Signin from "../pages/Signin/signin";
import Signup from "../pages/Signup/signup";
import Home from "../pages/Home/Home";
import EnterEmail from "../pages/EnterEmail/EnterEmail";
import EmailSend from "../pages/EmailSend/EmailSend";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
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
        path="/enter-email"
        element={
          <ProtectedRoute>
            <EnterEmail />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/email-sent"
        element={
          <ProtectedRoute>
            <EmailSend />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/reset-password"
        element={
          <ProtectedRoute>
            <ResetPassword />
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