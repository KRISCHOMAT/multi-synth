/* eslint-disable react-hooks/exhaustive-deps */
import Visualizer from "../components/Visualizer";

import { useEffect, useState, useRef } from "react";
import useAudioContext from "../hooks/useAudioContext";
import useSocket from "../hooks/useSocket";

function User() {
  const { audioCtx, gain, oscillator } = useAudioContext();
  const { socket } = useSocket("http://192.168.1.111:8080");

  //const [socket, setSocket] = useState();
  const [active, setActive] = useState(false);

  const [start, setStart] = useState(false);

  const [attack, setAttack] = useState(1);
  const [release, setRelease] = useState(1);
  const [hold, setHold] = useState(1);
  const [pitch, setPitch] = useState(200);

  //const didMountRef = useRef(false);
  const nameRef = useRef();

  const handleClick = () => {
    oscillator.start();
    setStart(true);
    socket.emit("enterUser", nameRef.current.value);
  };

  // init sockets when socket is available
  useEffect(() => {
    if (socket) {
      socket.on("active", () => {
        setActive(true);
      });

      socket.on("unactive", () => {
        setActive(false);
      });

      socket.on("env", (data) => {
        setRelease(data.release / 50 + 0.2);
        setAttack(data.attack / 50 + 0.2);
        setHold(data.hold * 10);
      });

      socket.on("pitch", (data) => {
        setPitch(data);
      });
      // check if user refreshs the page
      window.addEventListener("beforeunload", () => {
        socket.emit("refresh");
      });
    }
    return window.removeEventListener("beforeunload", () => {
      socket.emit("refresh");
    });
  }, [socket]);

  //check if user is active
  useEffect(() => {
    if (active) {
      gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + attack);
      setTimeout(() => {
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + release);
      }, hold);
    }
  }, [active]);

  // change pitch
  useEffect(() => {
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  }, [pitch]);

  if (!start) {
    return (
      <div className="App">
        <div className="form">
          <h1>The Multi Synth</h1>
          <div className="formRow">
            <label htmlFor="name">Name</label>
            <input id="name" className="nameInput" ref={nameRef}></input>
          </div>
          <button onClick={handleClick}>START</button>
        </div>
      </div>
    );
  }

  return (
    <Visualizer
      socket={socket}
      active={active}
      setActive={setActive}
      pitch={pitch}
    />
  );
}

export default User;
