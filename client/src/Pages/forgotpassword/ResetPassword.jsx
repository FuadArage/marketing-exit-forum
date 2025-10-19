// src/Pages/ResetPassword.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Utility/axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Layout from "../../Components/Layout/Layout";
import styles from "./ResetPassword.module.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      return toast.warn("Password must be at least 8 characters long.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    setLoading(true);
    try {
      const response = await api.post(`/user/reset-password/${token}`, {
        password,
      });
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit}>
            <h2 className={styles.title}>Reset Your Password</h2>
            <p className={styles.subtitle}>
              Choose a new, strong password for your account.
            </p>
            <div className={styles.inputGroup}>
              <label className={styles.label}>New Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter new password"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                placeholder="Confirm new password"
                required
              />
            </div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader color="#fff" size={20} />
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default ResetPassword;
