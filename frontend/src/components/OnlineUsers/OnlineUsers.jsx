import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import "./OnlineUsers.scss";
import { useSelector } from "react-redux";
// ==========================
const OnlineUsers = () => {
  const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);
  // useEffect(() => {
  //   console.log("onlineUsers", onlineUsers);
  // }, [onlineUsers]);
  // ===========================
  return (
    <>
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
