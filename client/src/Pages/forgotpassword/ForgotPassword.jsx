import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Utility/axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Layout from "../../Components/Layout/Layout";
import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.warn("Please enter your email address.");
    }
    setLoading(true);
    try {
      await api.post("/user/forgot-password", { email });
      toast.success("Password reset link sent! Please check your email.");
      setIsSubmitted(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send reset link. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          {isSubmitted ? (
            <>
              <h2 className={styles.title}>Request Sent</h2>
              <p className={styles.subtitle}>
                If an account with that email exists, a password reset link has
                been sent. Please check your inbox.
              </p>
              <button
                onClick={() => navigate("/login")}
                className={styles.submitButton}
              >
                Back to Login
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className={styles.title}>Forgot Password</h2>
              <p className={styles.subtitle}>
                Enter your email and we'll send you a reset link.
              </p>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="you@example.com"
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
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ForgotPassword;
