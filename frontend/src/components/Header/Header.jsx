import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as Logo } from "../../assets/svg/logo.svg";
import { ReactComponent as No } from "../../assets/svg/nodejs.svg";
import { ReactComponent as Ex } from "../../assets/svg/express.svg";
import { ReactComponent as Md } from "../../assets/svg/mongodb.svg";
import { ReactComponent as Socket } from "../../assets/svg/socket.svg";
import MenuIcon from "@mui/icons-material/Menu";
import { restoreAuth } from "../../redux/actions/authActions";
import "./Header.scss";
import HeaderMenu from "../HeaderMenu/HeaderMenu";
import UserAvatar from "../UserAvatar/UserAvatar";
// =====================
const Header = () => {
  const [anchormobEl, setAnchormobEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [menuAvatarOpen, setMenuAvatarOpen] = useState(false);
  const dispatch = useDispatch();
  const [isMobileWidth, setIsMobileWidth] = useState(false);
  // ============================

  // ============================
  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  useEffect(() => {
    setMenuAvatarOpen(false);
    setMenuOpen(false);
  }, [user]);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setMenuAvatarOpen(false);
      setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuAvatarOpen]);
  //======================================
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setIsMobileWidth(true);
      } else {
        setIsMobileWidth(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  //======================================
  const handleOpenMenu = (event) => {
    setAnchormobEl(event.currentTarget);
    setMenuOpen(true);
  };

  // Закрытие меню
  const handleCloseMenu = () => {
    setAnchormobEl(null);
    setMenuOpen(false);
  };
  // =============
  const getActiveLinkStyle = (path) => {
    console.log("location.pathname", location.pathname);
    return location.pathname === path ? { color: "red" } : { color: "" };
  };
  // =============
  // =============
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
      <Container maxWidth="xl" className="ContainerHeader">
        <Toolbar className="toolbar">
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            className="logo"
          >
            <Link to="/">
              <Socket />
              <Logo />
              <No />
              <Ex />
              <Md />
            </Link>
          </Typography>
          {/* =========================== */}
          {isMobileWidth && <UserAvatar user={user} />}

          {/*==========Mobile=============*/}
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
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <HeaderMenu handleCloseMenu={handleCloseMenu} />
            </Menu>
          </Box>
          {/* ==============Desctop============= */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              msFlexDirection: "column",
              alignItems: "center",
            }}
          >
            <HeaderMenu
              getActiveLinkStyle={getActiveLinkStyle}
              handleCloseMenu={handleCloseMenu}
            />
            {!isMobileWidth && <UserAvatar user={user} />}
          </Box>
          {/* ================================== */}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
