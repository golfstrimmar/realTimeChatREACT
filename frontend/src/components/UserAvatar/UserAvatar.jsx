import React, { useState } from "react";
import "./userAvatar.scss";
import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  Divider,
  ListItemIcon,
  CardMedia,
  Avatar,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

import Logout from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/actions/authActions";
// ==================================
// ==================================
// ==================================
const UserAvatar = ({ user }) => {
  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // --------------------------

  const imageUrl = user?.picture
    ? `${process.env.REACT_APP_API_URL}${user.picture}`
    : null;

  const handleLogout = () => {
    console.log("**socket disconnectUser***", user);
    socket.emit("disconnectUser", user);
    localStorage.removeItem("user");
    dispatch(setUser(null, null));
    setMenuAvatarOpen(false);
    setAnchorAvatarEl(null);
    navigate("/");
  };
  const [anchorAvatarEl, setAnchorAvatarEl] = useState();
  const [menuAvatarOpen, setMenuAvatarOpen] = useState();
  // --------------------------
  const handleOpenAvatar = (event) => {
    setAnchorAvatarEl(event.currentTarget);
    setMenuAvatarOpen(true);
  };
  const handleCloseAvatar = () => {
    setMenuAvatarOpen(false);
    setAnchorAvatarEl(null);
  };
  return (
    <div className="useravatar">
      {user && (
        <>
          <Box
            sx={{
              alignItems: "left",
            }}
            className="avatarUser-MemuIcon"
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
          </Box>
          {/* ----------------- */}
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
                  onClick={handleCloseAvatar}
                >
                  <Avatar />
                  See profile
                </MenuItem>
                <Divider />
                <MenuItem
                  color="inherit"
                  onClick={handleLogout}
                  onClose={handleCloseAvatar}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </div>
            ) : (
              <div></div>
            )}
          </Menu>
        </>
      )}
    </div>
  );
};

export default UserAvatar;
