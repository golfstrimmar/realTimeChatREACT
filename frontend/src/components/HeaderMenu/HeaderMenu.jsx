import React, { useState, useEffect } from "react";
import "./HeaderMenu.scss";
import { MenuItem } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useSelector } from "react-redux";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { Link, useLocation } from "react-router-dom";
// -------------------------
const HeaderMenu = ({ handleCloseMenu }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const getActiveLinkStyle = (path) => {
    return location.pathname === path ? { color: "red" } : { color: "" };
  };
  return (
    <div className="headermenu">
      <MenuItem
        component={Link}
        to="/"
        onClick={handleCloseMenu}
        className="header-link"
        style={getActiveLinkStyle("/")}
      >
        <HomeIcon /> Home
      </MenuItem>

      {user && (
        <MenuItem
          component={Link}
          to="/personal"
          onClick={handleCloseMenu}
          className="header-link"
          style={getActiveLinkStyle("/personal")}
        >
          <ChatBubbleIcon /> Personal
        </MenuItem>
      )}
      {user && <span className="user-name">{user.name}</span>}
      {!user && (
        <>
          <MenuItem
            component={Link}
            to="/login"
            onClick={handleCloseMenu}
            className="header-link"
            style={getActiveLinkStyle("/login")}
          >
            <LoginIcon />
            Login
          </MenuItem>
          <MenuItem
            component={Link}
            to="/register"
            className="header-link"
            onClick={handleCloseMenu}
            style={getActiveLinkStyle("/register")}
          >
            <AppRegistrationIcon />
            Registration
          </MenuItem>
        </>
      )}
    </div>
  );
};

export default HeaderMenu;
