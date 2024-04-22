import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import "./Nav.css";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className={`navbar-menu`}>
      <div className="logo">
        <h1>IOT</h1>
      </div>
      <div className="menu">
        <ul>
          <li>
            <Link to={"/"}>Dashboard</Link>
          </li>
          <li>
            <Link to={"/data-sensor"}>Data Sensor</Link>
          </li>
          <li>
            <Link to={"/action-history"}>Action History</Link>
          </li>
          <li>
            <Link to={"/profile"}>Profile</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
