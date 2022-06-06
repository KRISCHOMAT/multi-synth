/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";

const Controls = ({ socket, userId, userName, count, id, removeUser }) => {
  const refPitch = useRef();

  const [active, setActive] = useState(false);

  const handleClick = () => {
    removeUser(userId);
    socket.emit("removeUser", userId);
  };

  const handleChange = () => {
    socket.emit("pitch", {
      pitch: refPitch.current.value,
      user: userId,
    });
  };

  useEffect(() => {
    if (count === id) {
      socket.emit("active", userId);
      setActive(true);
    } else {
      socket.emit("unactive", userId);
      setActive(false);
    }
  }, [count]);

  return (
    <div className="control">
      <button className="removeUser" onClick={handleClick}>
        <AiOutlineClose size={30} />
      </button>
      <div className="pitch">
        <label
          htmlFor="name"
          style={active ? { color: "#f24c4c" } : { color: "black" }}
        >
          {userName}
        </label>
        <input
          id="name"
          ref={refPitch}
          type="range"
          min="1"
          max="12"
          step="1"
          onChange={handleChange}
        ></input>
      </div>
    </div>
  );
};

export default Controls;
