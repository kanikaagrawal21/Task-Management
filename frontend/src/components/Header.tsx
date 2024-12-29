import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="header-container">
      <div className="header-links">
        <Link to="/dashboard" className="header-link">
          Dashboard
        </Link>
        <Link to="/tasks" className="header-link">
          Task List
        </Link>
      </div>
      <button onClick={handleSignOut} className="signout-button">
        Sign Out
      </button>
    </header>
  );
};

export default Header;
