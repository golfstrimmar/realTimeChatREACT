import React, { useState, useEffect } from "react";
import "./AllUsers.scss";
import { useSelector, useDispatch } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
// ============================
const AllUsers = () => {
  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.auth.user);
  const [usersAll, setAllUsers] = useState([]);
  const navigate = useNavigate();
  // ====================================
  useEffect(() => {
    if (socket) {
      socket.emit("allUsers");
      socket.on("Users", (users) => {
        setAllUsers(users);
      });
    }
  }, [socket]);
  // =========================
  const handleGoPrivat = (user) => {
    navigate(`/personal`);
    localStorage.setItem("GoPrivat", JSON.stringify({ user }));
  };
  // =========================
  return (
    <div className="OnlineUsers allUsers">
      <Typography variant="h5">All Users:</Typography>
      <ul className="userInfo">
        {socket &&
          usersAll.map((user, index) => (
            <li
              key={index}
              className="userInfo-item"
              onClick={() => handleGoPrivat(user)}
            >
              <EditIcon /> {user.name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AllUsers;
