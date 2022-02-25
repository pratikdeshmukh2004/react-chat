import React, { useState, useEffect } from "react";
import queryString from "query-string";
import "./Chat.css";
import io from "socket.io-client";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import OnlineContainer from "../OnlineContainer/OnlineContainer";
import { Redirect } from "react-router-dom";
let socket;


const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState("");
  const [redirectUrl, setredirectUrl] = useState("");

  const ENDPOINT = process.env.REACT_APP_SOCKET_URL;
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);
    setName(name);
    setRoom(room);
    socket.emit("join", { name, room }, (e) => {
      console.log(e, "join info");
      if (e.error) {
        setredirectUrl(`/?message=${e.error}`)
      }
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
      console.log(messages);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    socket.on("old_chats", (ms) => {
      setMessages(ms);
    });
  }, [users || message]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      {redirectUrl !== "" ? <Redirect to={redirectUrl} /> : ""}
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <OnlineContainer users={users} />
    </div>
  );
};

export default Chat;
