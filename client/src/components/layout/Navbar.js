import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar bg-dark">
      <h1>
        <a href="index.html">BridgeTheGap</a>
      </h1>
      <ul>
        <li>
          <a href="!#">Developers</a>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;