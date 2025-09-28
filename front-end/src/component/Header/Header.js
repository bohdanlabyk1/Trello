import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { SiTrello } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

const Header = ({ onCreateProject }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header__left">
        <SiTrello className="header__logo" />
        <span className="header__logo-text">Trello</span>
      </div>

      <div className="header__center">
        <input
          type="text"
          placeholder="Пошук..."
          className="header__search"
        />
      </div>

      <div className="header__right">
        <button className="create-btn" onClick={onCreateProject}>
          + Створити проект
        </button>
        <FaBell className="header__icon" />
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
