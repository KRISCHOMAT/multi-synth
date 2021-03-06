/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

import Controls from "../components/Controls";

function Admin() {
  const location = useLocation();

  const [name, setName] = useState();
  const [uuid, setUuid] = useState();
  const [socket, setSocket] = useState();

  const [users, setUsers] = useState([]);
  const [usersCheck, setUsersCheck] = useState([]);
  const [count, setCount] = useState(0);

  const speedRef = useRef();
  const attackRef = useRef();
  const releaseRef = useRef();
  const holdRef = useRef();
  const basePitchRef = useRef();
  const countRef = useRef(0);

  useEffect(() => {
    setName(location.state.name);
    setUuid(location.state.uuid);
    //setSocket(io.connect("http://192.168.1.111:8080"));
    setSocket(io());
  }, []);

  const handleChange = () => {
    socket.emit("data", {
      attack: attackRef.current.value,
      release: releaseRef.current.value,
      hold: holdRef.current.value,
      basePitch: parseFloat(basePitchRef.current.value),
      room: uuid,
    });
  };

  const speedRange = (speed) => {
    return (speed * -1 + 101) * 20;
  };

  const removeUser = (id) => {
    const newUsers = users.filter((user) => user.id !== id);
    setUsers(newUsers);
    countRef.current = users.length;
  };

  // listening for sockets when socket is available
  useEffect(() => {
    if (socket) {
      socket.on("userJoining", (data) => {
        setUsers((prev) => {
          return [...prev, { name: data.name, id: data.id }];
        });
        socket.emit("initUser", {
          name,
          id: data.id,
          attack: attackRef.current.value,
          release: releaseRef.current.value,
          hold: holdRef.current.value,
          basePitch: parseFloat(basePitchRef.current.value),
        });
      });

      socket.on("isHere", (data) => {
        setUsersCheck((prev) => {
          return [...prev, data];
        });
      });

      socket.emit("createRoom", { uuid });
    }
  }, [socket]);

  // listen for users to go
  useEffect(() => {
    if (socket) {
      socket.on("leaving", (id) => {
        const newUsers = users.filter((user) => user.id !== id);
        setUsers(newUsers);
      });
      countRef.current = users.length;
    }
  }, [users]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countRef.current <= 1) {
        setCount(0);
        return;
      }
      setCount(count + 1);
      if (count >= countRef.current) {
        setCount(1);
      }
    }, speedRange(speedRef.current.value));
    return () => clearInterval(timer); // clearing interval
  }, [count, usersCheck]);

  return (
    <div className="App">
      <h1>{name}</h1>
      <p>your id: {uuid}</p>
      <label htmlFor="speed">Speed</label>
      <input
        id="speed"
        ref={speedRef}
        type="range"
        min="0"
        max="100"
        onChange={speedRange}
      ></input>

      <label htmlFor="attack">Attack</label>
      <input
        id="attack"
        ref={attackRef}
        type="range"
        min="0"
        max="100"
        onChange={handleChange}
      ></input>

      <label htmlFor="release">Release</label>
      <input
        id="release"
        ref={releaseRef}
        type="range"
        min="0"
        max="100"
        onChange={handleChange}
      ></input>

      <label htmlFor="hold">Hold</label>
      <input
        id="hold"
        ref={holdRef}
        type="range"
        min="0"
        max="100"
        onChange={handleChange}
      ></input>

      <label htmlFor="tune">Tune</label>
      <input
        id="tune"
        type="range"
        min="130.813"
        max="523.251"
        ref={basePitchRef}
        onChange={handleChange}
      ></input>

      <h3>{count}</h3>
      {users
        ? users.map((user, id) => {
            return (
              <Controls
                key={id}
                id={id + 1}
                socket={socket}
                userId={user.id}
                userName={user.name}
                count={count}
                removeUser={removeUser}
              />
            );
          })
        : null}
    </div>
  );
}

export default Admin;
