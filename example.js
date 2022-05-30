import React from "react";
import { useState, useEffect } from "react";

const App = () => {
  const [heading, setHeading] = useState();

  useEffect(() => {
    setHeading("My heading");
  }, []);
  return <h1>{heading}</h1>;
};

export default App;
