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
  ListItemIcon,
  CardMedia,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as Logo } from "../../assets/svg/logo.svg";
// ICONS
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { setUser } from "../../redux/actions/authActions";
import { restoreAuth } from "../../redux/actions/authActions";

const Header = () => {
  const [anchormobEl, setAnchormobEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [anchorAvatarEl, setAnchorAvatarEl] = useState(null);
  const [menuAvatarOpen, setMenuAvatarOpen] = useState(false);
  const dispatch = useDispatch();

  // ============================
  const imageUrl = user?.picture
    ? `${process.env.REACT_APP_API_URL}${user.picture}`
    : null;
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
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuAvatarOpen]);
  //======================================
  const handleOpenAvatar = (event) => {
    setAnchorAvatarEl(event.currentTarget);
    setMenuAvatarOpen(true);
  };

  const handleCloseAvatar = () => {
    setAnchorAvatarEl(null);
    setMenuAvatarOpen(false);
  };

  //======================================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(setUser(null, null));
    navigate("/login");
  };

  // =============Открытие меню на мобильных устройствах
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
      <Container maxWidth="xl">
        <Toolbar className="toolbar">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">
              <Logo />
            </Link>
          </Typography>
          {/* Добавляем отображение имени пользователя рядом с иконкой меню на мобильных */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "left" }}>
            {user ? (
              <>
                <IconButton
                  onClick={handleOpenAvatar}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user.picture ? (
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt="img"
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          m: 2,
                        }}
                      />
                    ) : (
                      <p>A</p>
                    )}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorAvatarEl}
                  id="account-menu"
                  open={menuAvatarOpen}
                  onClose={handleCloseAvatar}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {user ? (
                    <div>
                      <MenuItem
                        color="inherit"
                        component={Link}
                        to="/profile"
                        onClose={handleCloseAvatar}
                      >
                        <Avatar />
                        See profile
                      </MenuItem>
                      <Divider />
                      <MenuItem color="inherit" onClick={handleLogout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </div>
                  ) : (
                    <div>
                      <MenuItem
                        component={Link}
                        to="/login"
                        onClick={handleCloseMenu}
                        style={getActiveLinkStyle("/")}
                      >
                        <LoginIcon
                          style={{ marginRight: "8px", color: "inherit" }}
                        />
                        Login
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/register"
                        onClick={handleCloseMenu}
                        style={getActiveLinkStyle("/")}
                      >
                        <AppRegistrationIcon
                          style={{ marginRight: "8px", color: "inherit" }}
                        />
                        Registration
                      </MenuItem>
                    </div>
                  )}
                </Menu>
              </>
            ) : (
              <div></div>
            )}
          </Box>
          {/* Для мобильных устройств */}
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
              <MenuItem
                component={Link}
                to="/"
                onClick={handleCloseMenu}
                style={getActiveLinkStyle("/")}
              >
                <HomeIcon sx={{ mr: 1 }} /> Home
              </MenuItem>
              {/* <MenuItem
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
                <AccountCircleIcon sx={{ mr: 1 }} /> Profile
              </MenuItem> */}
              {!user && (
                <div>
                  <MenuItem
                    component={Link}
                    to="/login"
                    onClick={handleCloseMenu}
                    style={getActiveLinkStyle("/login")}
                  >
                    <LoginIcon style={{ marginRight: "8px" }} /> Login
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/register"
                    onClick={handleCloseMenu}
                    style={getActiveLinkStyle("/register")}
                  >
                    <AppRegistrationIcon style={{ marginRight: "8px" }} />{" "}
                    Registration
                  </MenuItem>
                </div>
              )}
            </Menu>
          </Box>
          {/* Для десктопа */}
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
              // onClick={handleCloseMenu}
              style={getActiveLinkStyle("/")}
            >
              <HomeIcon sx={{ mr: 1 }} /> Home
            </MenuItem>

            {!user ? (
              <>
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
              </>
            ) : (
              <Box
                sx={{
                  // display: { xs: "flex", md: "none", sm: "none" },
                  alignItems: "left",
                }}
              >
                <IconButton
                  onClick={handleOpenAvatar}
                  size="small"
                  sx={{ ml: 1, mr: 1 }}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user.picture ? (
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt="img"
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          m: 2,
                        }}
                      />
                    ) : (
                      <p>A</p>
                    )}
                  </Avatar>
                </IconButton>
                {/* <Menu
                  anchorEl={anchorAvatarEl}
                  // id="account-menu"
                  // open={menuAvatarOpen}
                  // onClose={handleCloseAvatar}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleCloseAvatar}
                  >
                    <Avatar
                      style={{
                        marginRight: "8px",
                        width: "25px",
                        height: "25px",
                      }}
                    />
                    See profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu> */}
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
