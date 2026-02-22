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

  // 🔹 Закриття меню по кліку поза ним
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

  // 🔹 Функція для оновлення лічильника з дочірнього компонента
  const updateInviteCount = (count) => {
    setInviteCount(count);
  };

  return (
    <header className="header">
      {/* Тема */}
      <button onClick={toggleTheme}>{theme === "light" ? "🌙" : "☀️"}</button>

      {/* Логотип */}
      <div className="header__left" onClick={handleLogoClick}>
        <SiTrello className="header__logo" />
        <span className="header__logo-text">Trello</span>
      </div>

      {/* Пошук */}
      <div className="header__center">
        <HeaderSearch />
      </div>

      {/* Правий блок */}
      <div className="header__right">
        {/* 🔔 Notifications */}
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

        {/* 👤 User */}
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
