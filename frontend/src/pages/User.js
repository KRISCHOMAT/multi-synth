/* eslint-disable react-hooks/exhaustive-deps */
import Visualizer from "../components/Visualizer";

import io from "socket.io-client";

import { useEffect, useRef, useState } from "react";
import useAudioContext from "../hooks/useAudioContext";

function User() {
  const { audioCtx, gain, oscillator } = useAudioContext();

  const [socket, setSocket] = useState();

  const [active, setActive] = useState(false);

  const [start, setStart] = useState(false);
  const [room, setRoom] = useState("");

  const [loginValues, setLoginvalues] = useState({ name: "", roomId: "" });

  const [attack, setAttack] = useState(0.3);
  const [release, setRelease] = useState(0.5);
  const [hold, setHold] = useState(0.1);
  const [pitch, setPitch] = useState(1);
  const [basePitch, setBasePitch] = useState(200);

  const handleChange = (e) => {
    setLoginvalues((prevValues) => {
      return {
        ...prevValues,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleClick = async () => {
    oscillator.start();
    setStart(true);
    socket.emit("enterUser", loginValues);
  };

  useEffect(() => {
    //setSocket(io.connect("http://localhost:8080"));
    setSocket(io());
  }, []);

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
        setRelease(data.release / 50 + 0.3);
        setAttack(data.attack / 50 + 0.3);
        setHold(data.hold * 10 + 0.3);
        setBasePitch(data.basePitch);
      });

      socket.on("receiveRoomName", (data) => {
        setRoom(data);
      });

      socket.on("pitch", (data) => {
        console.log(data);
        setPitch(data);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (active) {
      //check if user is active
      socket.emit("available", loginValues.roomId);

      gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + attack);
      setTimeout(() => {
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + release);
      }, hold);
    }
  }, [active]);

  // change pitch
  useEffect(() => {
    oscillator.frequency.setValueAtTime(
      basePitch + (basePitch * pitch) / 12,
      audioCtx.currentTime
    );
  }, [pitch, basePitch]);

  useEffect(() => {
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
  }, []);

  if (!start) {
    return (
      <div className="App">
        <div className="form">
          <h1>The Multi Synth</h1>
          <div className="formRow">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              name="name"
              className="nameInput"
              onChange={handleChange}
            ></input>
            <label htmlFor="roomId">Room ID</label>
            <input
              id="roomId"
              name="roomId"
              className="nameInput"
              onChange={handleChange}
            ></input>
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
      basePitch={basePitch}
      room={room}
    />
  );
}

export default User;
