import React, { useState, useEffect } from "react";
import "./AllUsers.scss";
import { useSelector, useDispatch } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setGoPrivat } from "../../redux/actions/AllUsersActions";
import BlockIcon from "@mui/icons-material/Block";
// ============================
const AllUsers = () => {
  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.auth.user);
  const allUsers = useSelector((state) => state.allUsers.allUsers);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =========================
  const handleGoPrivat = (Gouser) => {
    if (user.id !== Gouser._id) {
      navigate(`/personal`);
      dispatch(setGoPrivat(Gouser));
    }
  };

  // =========================
  return (
    <div className=" allUsers">
      <Typography variant="p" className="allUsers-title">
        All Users:
      </Typography>
      <ul className="userInfo">
        {socket &&
          user &&
          allUsers.map((Gouser, index) => (
            <li
              key={index}
              className={`_btn userInfo-item ${Gouser._id === user.id ? "_stop" : ""}`}
              onClick={() => handleGoPrivat(Gouser)}
            >
              {Gouser._id !== user.id ? <EditIcon /> : <BlockIcon />}
              {Gouser.name}
            </li>
          ))}
        {errorMessage && (
          <Typography color="error" className="error">
            {errorMessage}
          </Typography>
        )}
        {socket &&
          !user &&
          allUsers.map((el, index) => (
            <li key={index} className={`_btn userInfo-item  _stop `}>
              <BlockIcon />
              {el.name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AllUsers;
