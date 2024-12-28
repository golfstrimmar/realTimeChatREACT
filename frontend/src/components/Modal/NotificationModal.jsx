import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Typography } from "@mui/material";
import { ReactComponent as Message } from "../../assets/svg/message.svg";
import { useDispatch, useSelector } from "react-redux";
import { clearErrorMessage } from "../../redux/actions/errorActions";
import "./Modal.scss";
// ===================
const NotificationModal = ({ messageError }) => {
  const [message, setMessage] = useState();
  const dispatch = useDispatch();
  // --------------------------
  useEffect(() => {
    console.log("***NotificationModal- messageError***", messageError);
    if (messageError) {
      setMessage(messageError);
      // setTimeout(() => {
      //   setMessage(null);
      //   dispatch(clearErrorMessage());
      // }, 2000);
    }
  }, [messageError]);

  return (
    <Dialog open={message} className="modalDialog" BackdropProps={{}}>
      <DialogContent className="modalContent">
        <Typography
          variant="p"
          style={{ textAlign: "center", padding: "0" }}
          className="mesSvg"
        >
          <Message></Message>
          <Typography
            component="h6"
            style={{
              fontWeight: "bold",
              color: "blue",
              margin: "0",
              lineHeight: "1",
            }}
          >
            {message}
          </Typography>
        </Typography>
        {/* <Typography variant="h6" className="messageText">
          {message && message.text}
        </Typography> */}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
