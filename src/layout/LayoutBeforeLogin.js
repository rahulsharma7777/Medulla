import React from "react";
import { Outlet } from "react-router-dom";
import LoginBackground from "../Assests/Images/LoginBackground.jpg";

const LayoutBeforeLogin = () => {
  return (
    <div className="main-layout">
      <div className="left-side">
        <img src={LoginBackground} alt="Login" />
      </div>
      <Outlet />
    </div>
  );
};

export default LayoutBeforeLogin;
