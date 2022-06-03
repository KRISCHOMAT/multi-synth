import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="App">
      <div className="form">
        <h1>The Multi Web SQ</h1>
        <div className="links">
          <Link className="link" to="/create">
            Create A Sequence
          </Link>
          <Link className="link" to="/user">
            Log Into Sequence
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
