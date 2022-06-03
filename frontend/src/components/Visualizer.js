import React, { useEffect } from "react";

const Visualizer = ({ socket, active, setActive, pitch, room }) => {
  useEffect(() => {
    socket.on(
      "active",
      () => {
        setActive(!active);
      },
      [active]
    );
  });

  return (
    <div
      className="visualizer App"
      style={
        active
          ? { opacity: pitch / 1000, backgroundColor: "#f24c4c" }
          : { opacity: 0, backgroundColor: "#f24c4c" }
      }
    >
      <h1>{room}</h1>
    </div>
  );
};

export default Visualizer;
