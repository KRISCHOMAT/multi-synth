/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";

import Controls from "../components/Controls";
import useSocket from "../hooks/useSocket";

function Admin() {
  const { socket } = useSocket("http://192.168.1.111:8080");
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  // const [basePitch, setBasePitch] = useState(130.813);

  const speedRef = useRef();
  const attackRef = useRef();
  const releaseRef = useRef();
  const holdRef = useRef();

  const handleChange = () => {
    socket.emit("env", {
      attack: attackRef.current.value,
      release: releaseRef.current.value,
      hold: holdRef.current.value,
    });
  };

  // const changeBasePitch = (e) => {
  //   setBasePitch(e.target.value);
  // };

  const speedRange = (speed) => {
    return (speed * -1 + 101) * 20;
  };

  // listening for sockets when socket is available
  useEffect(() => {
    if (socket) {
      socket.on("userJoining", (data) => {
        setUsers((prev) => {
          return [...prev, { name: data.name, id: data.id }];
        });
      });
    }
  }, [socket]);

  // listen for users to go
  useEffect(() => {
    if (socket) {
      socket.on("userdisconnecting", (id) => {
        const newUsers = users.filter((user) => user.id !== id);
        setUsers(newUsers);
      });
    }
  }, [users]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (users.length === 0) return;
      setCount(count + 1);
      if (count >= users.length) {
        setCount(1);
      }
    }, speedRange(speedRef.current.value)); // clearing interval
    return () => clearInterval(timer);
  });

  return (
    <div className="App">
      <h1>Admin</h1>

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

      {/* <label htmlFor="tune">Tune</label>
      <input
        id="tune"
        type="range"
        min="130.813"
        max="523.251"
        onChange={changeBasePitch}
      ></input> */}

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
                //basePitch={parseFloat(basePitch)}
              />
            );
          })
        : null}
    </div>
  );
}

export default Admin;
