import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="custom-navbar">
      <div className="nav-container">
        <div className="logo">StayEase</div>

        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/rooms">Rooms</a></li>
          <li><a href="/about">About</a></li>
          <li>
            <a href="/login" className="login-btn">
              Login
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;