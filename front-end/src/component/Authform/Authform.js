import React, { useState } from "react";
import "./../style/authform.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser, registerUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "./../boards/apiboardc";

export const Authform = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useProjectStore.getState();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repit_password: "",
  });

  const usernameRegex = /^[a-z0-9]{4,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.repit_password) {
      setMessage("Passwords do not match");
      return;
    }
    if (!isLogin) {
      if (!usernameRegex.test(formData.username)) {
        setMessage(
          "Username must be at least 4 characters long and contain only lowercase letters and numbers"
        );
        return;
      }

      if (!passwordRegex.test(formData.password)) {
        setMessage(
          "Пароль має містити щонайменше 5 символів та містити великі, малі літери "
        );
        return;
      }
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

      const token = result.token || result.data?.token;
      const user = result.user;

      if (!token) throw new Error("Token not received");

      setToken(token);
      setUser(user);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    }
  };

  const toggleForm = () => {
    setAnimating(true);
    setTimeout(() => {
      setIsLogin((prev) => !prev);
      setMessage("");
      setAnimating(false);
    }, 300);
  };

  return (
    <div className="auth-container">
      <div className={`form-wrapper ${animating ? "fade-out" : "fade-in"}`}>
        <form onSubmit={handleSubmit}>
          <h1>{isLogin ? "Login" : "Register"}</h1>

          {!isLogin && (
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <span
                className="eye-icon"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {!isLogin && (
            <div className="input-group">
              <label>Repeat Password</label>

              <div className="password-wrapper">
                <input
                  type={showRepeatPassword ? "text" : "password"}
                  name="repit_password"
                  placeholder="Repeat password"
                  value={formData.repit_password}
                  onChange={handleChange}
                  required
                />

                <span
                  className="eye-icon"
                  onClick={() => setShowRepeatPassword((prev) => !prev)}
                >
                  {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          )}

          {message && <div className="error">{message}</div>}

          <button className="btn" type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>

      <div className="panel">
        <h2>{isLogin ? "Welcome Back!" : "Hello, Friend!"}</h2>

        <p className="panel-text">
          {isLogin
            ? "Sign in to continue your journey with us"
            : "Create an account and start your journey with us"}
        </p>

        <div className="panel-divider"></div>

        <p className="panel-small">
          {isLogin
            ? "We are glad to see you again"
            : "It takes only a few seconds to get started"}
        </p>

        <button className="toggle-btn" onClick={toggleForm}>
          {isLogin ? "Create account" : "Sign in"}
        </button>
      </div>
    </div>
  );
};
