import React, { useState } from 'react';
import './../style/style.css';
import { loginUser, registerUser } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from './../boards/apiboardc';

export const Authform = () => {
  const navigate = useNavigate();
  const { setToken } = useProjectStore.getState(); // ⚡ отримуємо setToken зі store

  const [isLogin, setIsLogin] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repit_password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.repit_password) {
      setMessage('Паролі не співпадають');
      return;
    }

    try {
      const result = isLogin
        ? await loginUser(formData.email, formData.password)
        : await registerUser(
            formData.username,
            formData.email,
            formData.password,
            formData.repit_password
          );

      // ⚡ Перевірка токена
      const token = result.token || result.data?.token;
      if (!token) throw new Error('Токен не отримано від сервера');

      setToken(token); // ⚡ зберігаємо токен у Zustand
      navigate('/dashboard');

      setFormData({
        username: '',
        email: '',
        password: '',
        repit_password: '',
      });
      setMessage('');
    } catch (error) {
      setMessage('Помилка: ' + error.message);
    }
  };

  const toggleForm = () => {
    setAnimating(true);
    setTimeout(() => {
      setIsLogin(prev => !prev);
      setAnimating(false);
      setMessage('');
    }, 300);
  };

  return (
    <div className="box-content">
      <div className={`form-wrapper ${animating ? 'fade-out' : 'fade-in'}`}>
        <form onSubmit={handleSubmit}>
          <h1>{isLogin ? 'Login' : 'Register'}</h1>

          {!isLogin && (
            <>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </>
          )}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {!isLogin && (
            <>
              <label htmlFor="repit_password">Repeat Password</label>
              <input
                type="password"
                name="repit_password"
                placeholder="Repeat Password"
                value={formData.repit_password}
                onChange={handleChange}
                required
              />
            </>
          )}

          {message && <p className="error">{message}</p>}

          <input type="submit" value={isLogin ? 'Login' : 'Register'} className="btn" />
        </form>
      </div>

      <div className="panel">
        <h2>{isLogin ? "Don't have an account?" : "Already have an account?"}</h2>
        <button className="toggle-btn" onClick={toggleForm}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </div>
    </div>
  );
};
