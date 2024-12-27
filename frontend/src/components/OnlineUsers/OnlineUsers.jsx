import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
// import ModalCorrespondence from "../Modal/ModalCorrespondence";
import "./OnlineUsers.scss";
import { useSelector } from "react-redux";
// import NotificationModal from "../Modal/NotificationModal";
// ==========================
const OnlineUsers = () => {
  const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    console.log("onlineUsers", onlineUsers);
  }, [onlineUsers]);
  // ===========================
  return (
    <>
      {/* <Typography variant="h5" color="error" style={{ marginTop: "8px" }}>
        {errorMessage}
      </Typography> */}
      <div className="OnlineUsers">
        <Typography variant="p" className="allUsers-title">
          Online Users:
        </Typography>
        <ul className="userInfo">
          {onlineUsers.length > 0 &&
            onlineUsers.map((foo, index) => (
              <li key={index} className="_btn userInfo-item">
                {foo.user.name}({foo.count})
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default OnlineUsers;
