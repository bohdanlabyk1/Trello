import React, { useState, useRef, useEffect } from "react";
import "./../style/header.css";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { SiTrello } from "react-icons/si";
import { useNavigate } from "react-router-dom";

import AllNotificationsPanel from "./../User/aliert";
import { useProjectStore } from "./../boards/apiboardc";
import HeaderSearch from "../Sreach/Sreach";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [inviteCount, setInviteCount] = useState(0);
  const menuRef = useRef(null);
  const bellRef = useRef(null);
  const toggleTheme = useProjectStore((state) => state.toggleTheme);
  const theme = useProjectStore((state) => state.theme);
  const user = useProjectStore((state) => state.user);
  const logout = useProjectStore((state) => state.logout);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const updateInviteCount = (count) => {
    setInviteCount(count);
  };

  return (
    <header className="header">
      <button onClick={toggleTheme}>{theme === "light" ? "🌙" : "☀️"}</button>

      <div className="header__left" onClick={handleLogoClick}>
        <SiTrello className="header__logo" />
        <span className="header__logo-text">Trello</span>
      </div>

      <div className="header__center">
        <HeaderSearch />
      </div>

      <div className="header__right">
       
        <div className="notification-container" ref={bellRef}>
          <FaBell
            className="header__icon"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
          />

          {inviteCount > 0 && <span className="notification-badge">{inviteCount}</span>}

          {isNotificationsOpen && (
            <div className="notifications-dropdown">
              <AllNotificationsPanel token={token} onUpdateCount={updateInviteCount} />
            </div>
          )}
        </div>

        <div className="user-menu" ref={menuRef}>
          <FaUserCircle
            className="header__icon"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          />
          {isMenuOpen && (
            <div className="dropdown-menu">
              <div className="user-info">
                <strong>{user?.username}</strong>
              </div>
              <button onClick={handleLogout}>Вийти</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
