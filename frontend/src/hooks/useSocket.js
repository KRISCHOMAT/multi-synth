/* eslint-disable react-hooks/exhaustive-deps */
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";

const useSocket = (connectionString) => {
  const [socket, setSocket] = useState();
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      setSocket(io.connect(connectionString));
    }
    didMountRef.current = true;
  }, []);

  return { socket };
};

export default useSocket;
