import React, { useState, useRef, useEffect } from "react";
import "./../style/header.css";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { SiTrello } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "./../boards/apiboardc";
import HeaderSearch from "../Sreach/Sreach";
import Aliert from "./../User/aliert";
import { getNotificationsCount } from "../api/api"; // твоя функція

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

  // ===== Вихід =====
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ===== Клік по логотипу =====
  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  // ===== Outside click =====
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setIsNotificationsOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ===== Оновлення цифри сповіщень одразу =====
  useEffect(() => {
    if (!token) return;

    const fetchCount = async () => {
      try {
        const count = await getNotificationsCount(token);
        setInviteCount(count);
      } catch (e) {
        console.error(e);
      }
    };

    fetchCount(); // одразу після завантаження
    const interval = setInterval(fetchCount, 5000); // кожні 5 сек
    return () => clearInterval(interval);
  }, [token]);

  return (
    <header className="header">
      <button onClick={toggleTheme}>{theme === "light" ? "🌙" : "☀️"}</button>

      <div className="header__left" onClick={handleLogoClick}>
        <SiTrello className="header__logo" />
        <span className="header__logo-text">TeamTrack</span>
      </div>

      <div className="header__center">
        <HeaderSearch />
      </div>

      <div className="header__right">
        {/* 🔔 СПОВІЩЕННЯ */}
        <div className="notification-container" ref={bellRef}>
          <FaBell
            className="header__icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsNotificationsOpen((prev) => !prev);
            }}
          />

          {inviteCount > 0 && <span className="notification-badge">{inviteCount}</span>}

          {isNotificationsOpen && (
            <div className="notifications-dropdown">
              <Aliert token={token} onUpdateCount={setInviteCount} />
            </div>
          )}
        </div>

        {/* 👤 USER MENU */}
        <div className="user-menu" ref={menuRef}>
          <FaUserCircle
            className="header__icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
          />

          {isMenuOpen && (
            <div className="dropdown-menu">
              <div className="user-info">
                <strong>{user?.first_name}</strong>
                <strong>{user?.last_name}</strong>
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