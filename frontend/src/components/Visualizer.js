import React, { useEffect } from "react";

const Visualizer = ({ socket, active, setActive, pitch, basePitch, room }) => {
  useEffect(() => {
    socket.on(
      "active",
      () => {
        setActive(!active);
      },
      [active]
    );
  });

  const calcPitch = () => {
    return basePitch + (basePitch * pitch) / 12;
  };

  return (
    <div
      className="visualizer App"
      style={
        active
          ? { opacity: calcPitch(), backgroundColor: "#f24c4c" }
          : { opacity: 0, backgroundColor: "#f24c4c" }
      }
    >
      <h1>{room}</h1>
    </div>
  );
};

export default Visualizer;
