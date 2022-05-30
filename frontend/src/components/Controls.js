/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useRef } from "react";

const Controls = ({ socket, userId, userName, count, id }) => {
  const refPitch = useRef();
  const [basePitch] = useState(200);

  const [active, setActive] = useState(false);

  const handleChange = () => {
    socket.emit("pitch", {
      pitch: basePitch + (basePitch * refPitch.current.value) / 12,
      user: userId,
    });
  };

  useEffect(() => {
    socket.emit("pitch", {
      pitch: basePitch + (basePitch * refPitch.current.value) / 12,
      user: userId,
    });
  }, [basePitch]);

  useEffect(() => {
    socket.emit("pitch", {
      pitch: basePitch + (basePitch * refPitch.current.value) / 12,
      user: userId,
    });
  }, []);

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
  );
};

export default Controls;
