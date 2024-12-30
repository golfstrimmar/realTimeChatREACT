import React, { useState, useEffect } from "react";
import "./Personal.scss";
import { Typography } from "@mui/material";
import Privat from "../../components/Privat/Privat";
import Loading from "../../components/Loading/Loading";
import { useSelector, useDispatch } from "react-redux";
import { setGoPrivat } from "../../redux/actions/AllUsersActions";
import chatBg from "../../assets/img/chat.jpg";

const Personal = () => {
  const user = useSelector((state) => state.auth.user);
  const allUsers = useSelector((state) => state.allUsers.allUsers);
  const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);
  const socket = useSelector((state) => state.socket.socket);
  const goPrivat = useSelector((state) => state.allUsers.goPrivat);
  const [activeTab, setActiveTab] = useState(null);
  const [open, setOpen] = useState(false);
  const [privat, setPrivat] = useState("");
  const [persona, setPersona] = useState(null);
  const [dataMessage, setDataMessage] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [WithStatus, setWithStatus] = useState([]);
  // =============================

  useEffect(() => {
    if (goPrivat) {
      setOpen(true);
      setPersona(goPrivat);
      handleOpenTab(goPrivat);
      setActiveTab(goPrivat);
    }
    dispatch(setGoPrivat(null));
  }, []);
  // =============================

  useEffect(() => {
    if (onlineUsers.length > 0) {
      const onlineUsersId = onlineUsers.map((el) => el.user.id);
      const updatedUsers = allUsers.map((user) => {
        const isOnline = onlineUsersId.includes(user._id);
        return {
          ...user,
          online: isOnline,
        };
      });
      setWithStatus(updatedUsers);
    }
  }, [onlineUsers, allUsers]);
  // =============================

  // =============================

  const handleOpenTab = (persona) => {
    console.log("activeTab", activeTab);
    setPersona(persona);
    setOpen(false);
    if (activeTab && activeTab._id === persona._id) {
      setActiveTab(null);
      return;
    }
    try {
      socket.emit("User", user?.id);
      socket.off("UserData");
      socket.on("UserData", (data) => {
        const temp = data?.correspondence;
        if (temp) {
          const correspondence = temp.filter((message) => {
            const toId = message.to ? message.to._id : null;
            const fromId = message.from ? message.from._id : null;
            return toId === persona?._id || fromId === persona?._id;
          });
          setPrivat(correspondence);
        }
        setActiveTab(persona);
      });
    } catch (err) {
      console.error("Error emitting 'User' event:", err);
    }

    setTimeout(() => {
      setOpen(true);
    }, 200);
  };

  // ==========================
  useEffect(() => {
    console.log("--dataMessage to send:", dataMessage);
    if (dataMessage) {
      try {
        socket.off("UserData");
        socket.emit("sendPrivatMessage", dataMessage);
        socket.on("UserData", (data) => {
          const temp = data.correspondence;
          const correspondence = temp.filter((message) => {
            const toId = message.to ? message.to._id : null;
            const fromId = message.from ? message.from._id : null;
            return toId === persona?._id || fromId === persona?._id;
          });

          setPrivat(correspondence);
          setActiveTab(persona);
        });
        setLoading(false);
      } catch (err) {
        console.error("Error emitting 'User' event:", err);
      }
    }
  }, [dataMessage]);
  // ==========================

  // ===================================
  if (!user) {
    return <Loading />;
  }
  // ==========================
  return (
    <section className="personal ">
      <div className="personal-body">
        <div className="imgs">
          <img src={chatBg} alt="" />
        </div>
        <div className="personal-menu">
          {socket &&
            WithStatus.filter((u) => u.name !== user.name).map(
              (item, index) => (
                <li
                  key={index}
                  onClick={() => handleOpenTab(item)}
                  className={`personal-menu-item ${activeTab?.name === item.name ? " _is-active" : ""}`}
                >
                  <Typography variant="h6" className="personal-menu-item-name">
                    {item.name}
                  </Typography>
                  {item.online && (
                    <Typography
                      variant="span"
                      className="personal-menu-item-status"
                    >
                      online
                    </Typography>
                  )}
                  <Typography variant="p" className="personal-menu-item-email">
                    {item.email}
                  </Typography>
                  <Typography variant="p" className="personal-menu-item-role">
                    {item.role}
                  </Typography>
                  <div className="decors">
                    <div className="decor decor-top"></div>
                    <div className="decor decor-low"></div>
                  </div>
                </li>
              )
            )}
        </div>
        {loading && <Loading />}
        <div className="personal-plaza">
          {socket && (
            <div className={`Privat ${open ? " _is-open" : ""}`}>
              <Privat
                open={open}
                privat={privat}
                persona={persona}
                setDataMessage={setDataMessage}
                setLoading={setLoading}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Personal;
