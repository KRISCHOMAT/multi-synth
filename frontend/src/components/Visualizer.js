import React, { useEffect } from "react";

const Visualizer = ({ socket, active, setActive, pitch }) => {
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
      className="visualizer"
      style={
        active
          ? { opacity: pitch / 1000, backgroundColor: "#f24c4c" }
          : { opacity: 0, backgroundColor: "#f24c4c" }
      }
    ></div>
  );
};

export default Visualizer;
