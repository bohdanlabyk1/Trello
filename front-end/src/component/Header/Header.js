import React, { useState, useRef, useEffect } from "react";
import "./../style/header.css";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { SiTrello } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import InvitationsPanel from "../User/invitation";
import { useProjectStore } from "./../boards/apiboardc";
import { getInvitationsCount, getNotificationsCount } from "../api/api";

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
    if (!token) return;

    const loadCounts = async () => {
      try {
        const invites = await getInvitationsCount(token);
        const notifications = await getNotificationsCount(token);

        setInviteCount(invites.count + notifications.count);
      } catch (e) {
        console.error(e);
      }
    };

    loadCounts();
  }, [token]);

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
  const refreshInviteCount = async () => {
    if (!token) return;
    const invites = await getInvitationsCount(token);
    const notifications = await getNotificationsCount(token);
    setInviteCount(invites.count + notifications.count);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
  };
  return (
    <header className="header">
      <button onClick={toggleTheme}>{theme === "light" ? "🌙" : "☀️"}</button>
      <div className="header__left" onClick={handleLogoClick}>
        <SiTrello className="header__logo" />
        <span className="header__logo-text">Trello</span>
      </div>
      <div className="header__center">
        <input type="text" placeholder="Пошук..." className="header__search" />
      </div>
      <div className="header__right">
        <div className="notification-container" ref={bellRef}>
          <FaBell
            className="header__icon"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
          />
          {inviteCount > 0 && (
            <span className="notification-badge">{inviteCount}</span>
          )}
          {isNotificationsOpen && (
            <div className="notifications-dropdown">
              <InvitationsPanel
                token={token}
                onUpdateCount={refreshInviteCount}
              />
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
