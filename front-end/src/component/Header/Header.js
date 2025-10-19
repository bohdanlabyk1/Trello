import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { SiTrello } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import InvitationsPanel from '../User/invitation';

const Header = ({ onCreateProject }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const menuRef = useRef(null);
  const bellRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/dashboard'); // ✅ Перехід на головну сторінку з проєктами
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
      <div className="header__left" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <SiTrello className="header__logo" />
        <span className="header__logo-text">Trello</span>
      </div>

      <div className="header__center">
        <input type="text" placeholder="Пошук..." className="header__search" />
      </div>

      <div className="header__right">
        <button className="create-btn" onClick={onCreateProject}>
          + Створити проект
        </button>

        <div className="notification-container" ref={bellRef}>
          <FaBell className="header__icon" onClick={toggleNotifications} />
          {isNotificationsOpen && (
            <div className="notifications-dropdown">
              <InvitationsPanel token={token} />
            </div>
          )}
        </div>

        <div className="user-menu" ref={menuRef}>
          <FaUserCircle className="header__icon" onClick={toggleMenu} />
          {isMenuOpen && (
            <div className="dropdown-menu">
              <button onClick={handleLogout}>Вийти</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
