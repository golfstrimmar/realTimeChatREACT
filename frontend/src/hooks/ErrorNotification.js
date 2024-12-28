import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setErrorMessage,
  clearErrorMessage,
} from "../redux/actions/errorActions";

const useErrorNotification = (initialMessage = "") => {
  const [openModalNotification, setOpenModalNotification] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let timer;
    if (initialMessage) {
      setOpenModalNotification(true);
      dispatch(setErrorMessage(initialMessage));
      timer = setTimeout(() => {
        setOpenModalNotification(false);
        dispatch(clearErrorMessage());
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [initialMessage, dispatch]);

  return { openModalNotification };
};

export default useErrorNotification;
