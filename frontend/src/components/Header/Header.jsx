import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Container,
  Avatar,
  Divider,
  CardMedia,
} from "@mui/material";
import { ReactComponent as Logo } from "../../assets/svg/logo.svg";
// ICONS
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SecurityIcon from "@mui/icons-material/Security";
import ListItemIcon from "@mui/material/ListItemIcon";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LogoutIcon from "@mui/icons-material/Logout";
// ================

const Header = () => {
  const [anchormobEl, setAnchormobEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  // ============================

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ==================================
  // Открытие меню на мобильных устройствах
  const handleOpenMenu = (event) => {
    setAnchormobEl(event.currentTarget);
    setMenuOpen(true);
  };
  // Закрытие меню
  const handleCloseMenu = () => {
    setAnchormobEl(null);
    setMenuOpen(false);
  };
  // ==================================
  const getActiveLinkStyle = (path) => {
    return location.pathname === path ? { color: "red" } : { color: "" };
  };
  // ==================================

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: scrollY > 50 ? "#033362D3" : "rgb(3,51,98)",
        transition: "background-color 0.3s ease",
        boxShadow: scrollY > 50 ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none",
      }}
      className="header"
    >
      <Container maxWidth="xl">
        <Toolbar className="toolbar">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">
              <Logo />
            </Link>
          </Typography>
          <Box
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },
            }}
          >
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleOpenMenu}
                sx={{ marginLeft: "auto", cursor: "pointer" }}
              >
                <MenuIcon sx={{ marginLeft: "auto", cursor: "pointer" }} />
              </IconButton>
              <Menu
                anchorEl={anchormobEl}
                open={menuOpen}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  component={Link}
                  to="/"
                  onClick={handleCloseMenu}
                  style={getActiveLinkStyle("/")}
                >
                  <HomeIcon sx={{ mr: 1 }} /> Home
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/login"
                  onClick={handleCloseMenu}
                  style={getActiveLinkStyle("/login")}
                >
                  <LoginIcon sx={{ mr: 1 }} /> Login
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/register"
                  onClick={handleCloseMenu}
                  style={getActiveLinkStyle("/register")}
                >
                  <AppRegistrationIcon sx={{ mr: 1 }} /> Registration
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={handleCloseMenu}
                  style={getActiveLinkStyle("/profile")}
                >
                  <AccountCircleIcon sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          {/* menu desctop */}
          {/* menu desctop */}
          {/* menu desctop */}
          {/* menu desctop */}

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              msFlexDirection: "column",
              alignItems: "center",
            }}
          >
            <MenuItem
              component={Link}
              to="/"
              onClick={handleCloseMenu}
              style={getActiveLinkStyle("/")}
            >
              <HomeIcon sx={{ mr: 1 }} /> Home
            </MenuItem>
            <MenuItem
              component={Link}
              to="/login"
              onClick={handleCloseMenu}
              style={getActiveLinkStyle("/login")}
            >
              <LoginIcon sx={{ mr: 1 }} /> Login
            </MenuItem>
            <MenuItem
              component={Link}
              to="/register"
              onClick={handleCloseMenu}
              style={getActiveLinkStyle("/register")}
            >
              <AppRegistrationIcon sx={{ mr: 1 }} /> Registration
            </MenuItem>
            <MenuItem
              component={Link}
              to="/profile"
              onClick={handleCloseMenu}
              style={getActiveLinkStyle("/profile")}
            >
              <AccountCircleIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
