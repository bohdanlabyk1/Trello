import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Trello = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h1>Вітаємо в кабінеті користувача!</h1>
      <button onClick={handleLogout}>Вийти</button>
    </div>
  );
};
