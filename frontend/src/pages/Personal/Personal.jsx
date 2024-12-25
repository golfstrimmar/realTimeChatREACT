import React, { useState, useEffect } from "react";
import "./Personal.scss";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import Privat from "../../components/Privat/Privat";
import Loading from "../../components/Loading/Loading";
const Personal = () => {
  const user = useSelector((state) => state.auth.user);
  const allUsers = useSelector((state) => state.allUsers.allUsers);
  const socket = useSelector((state) => state.socket.socket);
  const [activeTab, setActiveTab] = useState(null);
  const [open, setOpen] = useState(false);
  const [privat, setPrivat] = useState("");
  const [persona, setPersona] = useState(null);
  const [dataMessage, setDataMessage] = useState(null);
  // =============================
  const handleOpenTab = (persona) => {
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
        const temp = data.correspondence;
        const correspondence = temp.filter((message) => {
          const toId = message.to ? message.to._id : null;
          const fromId = message.from ? message.from._id : null;
          return toId === persona?._id || fromId === persona?._id;
        });
        setPrivat(correspondence);
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
    console.log("dataMessage:", dataMessage);
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
      } catch (err) {
        console.error("Error emitting 'User' event:", err);
      }
    }
  }, [dataMessage]);
  // ==========================
  useEffect(() => {
    console.log("activeTab", activeTab);
  }, [activeTab]);
  // ===================================
  if (!user) {
    return <Loading />;
  }
  // ==========================
  return (
    <section className="personal ">
      <div className="personal-body">
        <div className="personal-menu">
          {socket &&
            allUsers &&
            allUsers
              .filter((u) => u.name !== user.name)
              .map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleOpenTab(item)}
                  className={`personal-menu-item ${activeTab?.name === item.name ? " _is-active" : ""}`}
                >
                  <Typography variant="h6" className="personal-menu-item-name">
                    {item.name}
                  </Typography>
                  <Typography variant="p" className="personal-menu-item-email">
                    {item.email}
                  </Typography>
                  <Typography variant="p" className="personal-menu-item-role">
                    {item.role}
                  </Typography>
                </li>
              ))}
        </div>
        {/* {activeTab && activeTab !== user.name && (
          <div className="personal-plaza">
            <Privat resiver={resiver} />
          </div>
        )} */}
        <div className="personal-plaza">
          {
            socket && (
              <div className={`Privat ${open ? " _is-open" : ""}`}>
                <Privat
                  open={open}
                  privat={privat}
                  persona={persona}
                  setDataMessage={setDataMessage}
                />
              </div>
            )
            // ))
          }
        </div>
      </div>
    </section>
  );
};

export default Personal;
