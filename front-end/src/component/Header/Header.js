import React, { useState, useRef, useEffect } from 'react';
import './../style/header.css';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { SiTrello } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import InvitationsPanel from '../User/invitation';
import { useProjectStore } from './../boards/apiboardc';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const menuRef = useRef(null);
  const bellRef = useRef(null);

  const navigate = useNavigate();

  const toggleTheme = useProjectStore(state => state.toggleTheme);
  const theme = useProjectStore(state => state.theme);
  const user = useProjectStore(state => state.user);
  const logout = useProjectStore(state => state.logout);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleNotifications = () => setIsNotificationsOpen(prev => !prev);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const token = localStorage.getItem('token');

  return (
    <header className="header">
      {/* THEME */}
      <button onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* LOGO */}
      <div
        className="header__left"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      >
        <SiTrello className="header__logo" />
        <span className="header__logo-text">Trello</span>
      </div>

      {/* SEARCH */}
      <div className="header__center">
        <input
          type="text"
          placeholder="Пошук..."
          className="header__search"
        />
      </div>

      {/* RIGHT */}
      <div className="header__right">
        {/* NOTIFICATIONS */}
        <div className="notification-container" ref={bellRef}>
          <FaBell
            className="header__icon"
            onClick={toggleNotifications}
          />
          {isNotificationsOpen && (
            <div className="notifications-dropdown">
              <InvitationsPanel token={token} />
            </div>
          )}
        </div>

        {/* USER MENU */}
        <div className="user-menu" ref={menuRef}>
          <FaUserCircle
            className="header__icon"
            onClick={toggleMenu}
          />

          {isMenuOpen && (
            <div className="dropdown-menu">
              <div className="user-info">
                <strong>{user?.username}</strong>
              </div>

              <button onClick={handleLogout}>
                Вийти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
