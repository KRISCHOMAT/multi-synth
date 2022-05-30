import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="App">
      <h1>Welcome</h1>
      <div className="links">
        <Link className="link" to="/user">
          User
        </Link>
        <Link className="link" to="/admin">
          Admin
        </Link>
      </div>
    </div>
  );
};

export default Landing;
