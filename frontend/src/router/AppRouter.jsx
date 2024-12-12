import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
// ===================================================
const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Routes>
);

export default AppRouter;
