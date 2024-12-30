import React, { useEffect, useState } from "react";
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
      setTimeout(() => {
        setMessage(null);
        dispatch(clearErrorMessage());
      }, 2000);
    }
  }, [messageError]);

  return (
    <>
      {message && (
        <div className="modalContent">
          <p className="mesSvg">
            <h6
              style={{
                fontWeight: "bold",
                margin: "0",
                lineHeight: "1",
              }}
              className="messageText"
            >
              {message}
            </h6>
          </p>
        </div>
      )}
    </>
  );
};

export default NotificationModal;
