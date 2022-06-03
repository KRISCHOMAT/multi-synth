import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

const Create = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [uuid] = useState(uuidv4().slice(0, 8));

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleClick = () => {
    if (!name) {
      console.log("please provide Sequence Name");
      return;
    }
    navigate("/admin", { state: { name, uuid } });
  };

  return (
    <div className="App">
      <div className="form">
        <h1>Create A Sequence</h1>
        <div className="formRow">
          <label htmlFor="name">Sequence Name</label>
          <input
            onChange={handleChange}
            id="name"
            className="nameInput"
            value={name}
          ></input>
        </div>
        <button onClick={handleClick}>START</button>
      </div>
    </div>
  );
};

export default Create;
