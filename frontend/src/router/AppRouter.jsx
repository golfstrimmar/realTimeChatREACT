import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Profile from "../pages/Profile/Profile";
import Personal from "../pages/Personal/Personal";
// ===================================================
const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/personal" element={<Personal />} />
  </Routes>
);

export default AppRouter;
