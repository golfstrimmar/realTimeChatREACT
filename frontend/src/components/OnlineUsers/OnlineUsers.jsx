import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
// import ModalCorrespondence from "../Modal/ModalCorrespondence";
import "./OnlineUsers.scss";
import { useSelector } from "react-redux";
// import NotificationModal from "../Modal/NotificationModal";
// ==========================
const OnlineUsers = ({ onlineUsers, showNoUsersMessage }) => {
  // const [open, setOpen] = useState(false);
  // const [openModalNotification, setOpenModalNotification] = useState(false);
  // const [addressee, setAddressee] = useState(null);
  const user = useSelector((state) => state.auth.user);
  // const [errorMessage, setErrorMessage] = useState("");
  // const [privatMessage, setPrivatMessage] = useState();
  // =========================
  // useEffect(() => {
  //   if (privatMessage) {
  //     setOpenModalNotification(true);
  //   }
  // }, [privatMessage]);
  // =========================
  // useEffect(() => {
  //   if (errorMessage) {
  //     setTimeout(() => {
  //       setErrorMessage("");
  //     }, 2000);
  //   }
  // }, [errorMessage]);
  // // =========================
  // const handleOpenModal = (user) => {
  //   if (user) {
  //     setOpen(true);
  //     setAddressee(user);
  //   }
  // };

  // const handleCloseModal = () => {
  //   setOpen(false);
  //   setAddressee(null);
  // };
  // ====================================
  // const handleCloseModalNotification = () => {
  //   setOpenModalNotification(false);
  // };
  // ====================================
  return (
    <>
      {/* <Typography variant="h5" color="error" style={{ marginTop: "8px" }}>
        {errorMessage}
      </Typography> */}
      <div className="OnlineUsers">
        <Typography variant="h5">Online Users:</Typography>
        <ul className="userInfo">
          {onlineUsers.length > 0
            ? onlineUsers.map((foo, index) => (
                <li
                  key={index}
                  className="userInfo-item"
                  // onClick={() => {
                  //   if (!user) {
                  //     setErrorMessage("Please log in to send a message");
                  //   } else if (user.name === foo.user.name) {
                  //     setErrorMessage("You can't send yourself a message.");
                  //   } else {
                  //     handleOpenModal(foo.user);
                  //   }
                  // }}
                >
                  {foo.user.name}({foo.count})
                </li>
              ))
            : showNoUsersMessage && (
                <Typography variant="body2">No users connected</Typography>
              )}
        </ul>
        {/* <ModalCorrespondence
          open={open}
          handleCloseModal={handleCloseModal}
          addressee={addressee}
          setPrivatMessage={setPrivatMessage}
        /> */}
        {/* <NotificationModal
          open={openModalNotification}
          handleCloseModalNotification={handleCloseModalNotification}
          message={privatMessage}
        /> */}
      </div>
    </>
  );
};

export default OnlineUsers;
