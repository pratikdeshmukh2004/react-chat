import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./Join.css";
import queryString from "query-string";


const Join = ({location}) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [redirectUrl, setredirectUrl] = useState("");
  const { message } = queryString.parse(location.search);

  const submitHandler = (e) => {
    e.preventDefault();
    if (name && room) {
      setredirectUrl(`/chat?room=${room}&name=${name}`);
    }
  };
  return (
    <div className="joinOuterContainer">
      {redirectUrl !== "" ? <Redirect to={redirectUrl} /> : ""}
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <form onSubmit={submitHandler}>
          <div>
            <input
              placeholder="Name"
              className="joinInput"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              placeholder="Room"
              className="joinInput mt-20"
              type="text"
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <br/>
        <span className="error-text">{message}</span>
          <button className="button mt-20" type="submit">
            Sign In{" "}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Join;
