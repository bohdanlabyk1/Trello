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
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    repit_password: "",
  });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===== VALIDATION =====
    if (!isLogin) {
      if (!formData.first_name || !formData.last_name) {
        setMessage("Ім'я та прізвище обов'язкові");
        return;
      }

      if (formData.password !== formData.repit_password) {
        setMessage("Паролі не співпадають");
        return;
      }

      if (!passwordRegex.test(formData.password)) {
        setMessage(
          "Пароль має містити щонайменше 5 символів, великі та малі літери"
        );
        return;
      }
    }

    try {
      const result = isLogin
        ? await loginUser(formData.email, formData.password)
        : await registerUser(
            formData.first_name,
            formData.last_name,
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
      setMessage(error.message || "Щось пішло не так");
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

          {/* ===== REGISTER FIELDS ===== */}
          {!isLogin && (
            <>
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* ===== EMAIL ===== */}
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

          {/* ===== PASSWORD ===== */}
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

          {/* ===== REPEAT PASSWORD ===== */}
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
                  onClick={() =>
                    setShowRepeatPassword((prev) => !prev)
                  }
                >
                  {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          )}

          {/* ===== ERROR ===== */}
          {message && <div className="error">{message}</div>}

          <button className="btn" type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>

      {/* ===== RIGHT PANEL ===== */}
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