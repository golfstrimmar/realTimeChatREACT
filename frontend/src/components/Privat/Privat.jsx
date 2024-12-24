import React, { useEffect, useState } from "react";
import { Typography, Card, Button } from "@mui/material";
import "./Privat.scss";
import ModalCorrespondence from "../Modal/ModalCorrespondence";
import NotificationModal from "../Modal/NotificationModal";
// ===========================
const Privat = ({ privat, resiver }) => {
  const [open, setOpen] = useState(false);
  const [addressee, setAddressee] = useState(null);
  const [privatMessage, setPrivatMessage] = useState();
  const [openModalNotification, setOpenModalNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // =============
  useEffect(() => {
    if (privatMessage) {
      setOpenModalNotification(true);
    }
  }, [privatMessage]);
  useEffect(() => {
    console.log("privat:", privat);
    console.log("resiver:", resiver);
  }, [privat, resiver]);
  // =============================

  const handleOpenModal = (user) => {
    if (user) {
      setOpen(true);
      setAddressee(user);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setAddressee(null);
  };
  // =============================
  const handleCloseModalNotification = () => {
    setOpenModalNotification(false);
  };
  // =============================
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  }, [errorMessage]);
  // =============================
  return (
    <>
      <ModalCorrespondence
        open={open}
        handleCloseModal={handleCloseModal}
        addressee={addressee}
        setPrivatMessage={setPrivatMessage}
      />
      <NotificationModal
        open={openModalNotification}
        handleCloseModalNotification={handleCloseModalNotification}
        message={privatMessage}
      />
      <Button
        onClick={() => {
          // if (!user) {
          //   setErrorMessage("Please log in to send a message");
          // } else if (user.name === foo.user.name) {
          //   setErrorMessage("You can't send yourself a message.");
          // } else {
          handleOpenModal(resiver);
          // }
        }}
      >
        Sent message
      </Button>
      <Typography variant="h5" color="error" style={{ marginTop: "8px" }}>
        {errorMessage}
      </Typography>
      <div className="privat">
        <div className="privat-content">
          <Typography variant="h6" className="privat-title">
            Sent
          </Typography>
          <div className="privat-list">
            {privat && privat.length > 0 ? (
              privat
                .filter((item) => item.status === "sent")
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((item, index) => (
                  <Card key={index} className="privat-item">
                    {/* <Typography variant="span">To: {item.to.name}</Typography> */}
                    <Typography variant="h6" className=" privat-text">
                      {item.text}
                    </Typography>
                    <Typography variant="span">
                      {new Date(item.timestamp).toLocaleString()}
                    </Typography>
                  </Card>
                ))
            ) : (
              <div>No private information available.</div>
            )}
          </div>
        </div>
        <div className="privat-content">
          <Typography variant="h6" className="privat-title">
            Received
          </Typography>
          <div className="privat-list">
            {privat && privat.length > 0 ? (
              privat
                .filter((item) => item.status === "received")
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((item, index) => (
                  <Card key={index} className="privat-item">
                    <Typography variant="span">
                      From: {item.from.name}
                    </Typography>
                    <Typography variant="h6" className=" privat-text">
                      {item.text}
                    </Typography>
                    <Typography variant="span">
                      {new Date(item.timestamp).toLocaleString()}
                    </Typography>
                  </Card>
                ))
            ) : (
              <div>No private information available.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Privat;
