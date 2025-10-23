import React, { useContext, useEffect, useState } from "react";
import styles from "./login.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../Utility/axios";
import { UserContext } from "../Context";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
function Login() {
  const { userData, setUserData } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous inline errors

    // Basic validation
    if (!formData.email) {
      toast.warn("Please enter your email.");
      setLoading(false);
      return;
    }
    if (!formData.password) {
      toast.warn("Please enter your password.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/user/login", formData);

      setUserData({
        userid: response.data.userid, // Fixed response structure
        username: response.data.username,
        email: response.data.email,
        token: response.data.token,
        firstname: response.data.first_name,
      });

      navigate("/home");
      toast.success("Logged in successfully!");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (error.response?.status === 401) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.response?.status === 404) {
        errorMessage = "User not found. Please register first.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2 className={styles.loginTitle}>Login to your account</h2>
        <p className={styles.createAccountPrompt}>
          Don't have an account?{" "}
          <a
            onClick={() => navigate("/sign-up")}
            className={styles.createAccountLink}
          >
            Create a new account
          </a>
        </p>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <div className={styles.formGroup}>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            disabled={loading}
          />
        </div>
        <div className={styles.formGroup}>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your Password"
              required
              disabled={loading}
            />
            <span
              className={styles.passwordToggle}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FiEye size={17} /> : <FiEyeOff size={17} />}
            </span>
          </div>
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "center",
              }}
            >
              <ClipLoader color={"var(--white)"} loading={loading} size={20} />
              Logging in...
            </span>
          ) : (
            "LOG IN"
          )}
        </button>

        <div className={styles.forgotPasswordLink}>
          <a onClick={() => navigate("/forgot-password")}>Forgot Password?</a>
        </div>
        <a
          onClick={() => navigate("/sign-up")}
          className={styles.createAccountLinkBottom}
        >
          Create an account?
        </a>
      </form>
    </div>
  );
}

export default Login;
