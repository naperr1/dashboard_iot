import React from "react";
import "../Content/Content.css";

const Header = ({ data }) => {
  return (
    <div className="header">
      <h1>{data}</h1>
      <span>Welcome to your {data}</span>
    </div>
  );
};

export default Header;
