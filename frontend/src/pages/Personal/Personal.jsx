import React, { useState, useEffect, useRef } from "react";
import "./Personal.scss";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import Privat from "../../components/Privat/Privat";
import axios from "axios";
import Loading from "../../components/Loading/Loading";
const Personal = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const socket = useSelector((state) => state.socket.socket);
  const [usersAll, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("admin");
  const [privat, setPrivat] = useState([]);
  const [resiver, setResiver] = useState(null);
  // =============================
  useEffect(() => {
    if (socket) {
      socket.emit("allUsers");
      socket.on("Users", (users) => {
        setAllUsers(users);
      });
    }
  }, [socket]);
  // ==========================
  const handleOpenTab = (persona) => {
    setActiveTab(persona.name);
    setResiver(persona);
  };
  // ==========================

  // ===================================
  useEffect(() => {
    if (user && token) {
      socket.emit("User", user.id);
      socket.on("UserData", (user) => {
        setPrivat(user.correspondence);
      });
    }
  }, [user, token, socket, activeTab]);

  // axios
  //   .get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //   .then((response) => {
  //     const correspon = response.data.correspondence;
  //     setPrivat(correspon);
  //   })
  //   .catch((error) => {
  //     console.log("Error privat:", error);
  //   });

  // ==========================
  if (!user) {
    return <Loading />;
  }
  // ==========================
  return (
    <section className="personal ">
      <div className="personal-body">
        <div className="personal-menu">
          {socket &&
            usersAll
              .filter((u) => u.name !== user.name)
              .map(
                (user, index) =>
                  activeTab && (
                    <li
                      key={index}
                      onClick={() => handleOpenTab(user)}
                      className={`personal-menu-item ${activeTab === user.name ? " _is-active" : ""}`}
                    >
                      <Typography
                        variant="h6"
                        className="personal-menu-item-name"
                      >
                        {user.name}
                      </Typography>
                      <Typography
                        variant="p"
                        className="personal-menu-item-email"
                      >
                        {user.email}
                      </Typography>
                      <Typography
                        variant="p"
                        className="personal-menu-item-role"
                      >
                        {user.role}
                      </Typography>
                    </li>
                  )
              )}
        </div>
        {activeTab && activeTab !== user.name && (
          <div className="personal-plaza">
            <Privat privat={privat} resiver={resiver} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Personal;
