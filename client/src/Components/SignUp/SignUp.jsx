import React, { useState, useContext } from "react";
import { FiEyeOff, FiEye } from "react-icons/fi";
import styles from "./signup.module.css";
import { ClipLoader } from "react-spinners";
import axios from "../../Utility/axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context";
import { toast } from "react-toastify";

function SignUp() {
  const { userData, setUserData } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // clear the error for the field being edited and any general API error / when the user starts typing
    setErrors((prevErrors) => {
      // clear only the error of the current filed being edited
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[name];
      delete updatedErrors.api;
      return updatedErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      newErrors.email = "Please enter a valid email address.";
      toast.warn("Please enter a valid email address.");
    }
    if (!formData.firstName) {
      newErrors.firstName = "First name is required.";
      toast.warn("First name is required.");
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required.";
      toast.warn("Last name is required.");
    }
    if (!formData.userName) {
      newErrors.userName = "User name is required.";
      toast.warn("User name is required.");
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      toast.warn("Password must be at least 8 characters.");
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous form errors displayed below inputs

    try {
      const response = await axios.post("/user/register", {
        username: formData.userName,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Registration successful!");
      setUserData({
        userid: response.data.userid, // Fixed response structure
        username: response.data.username,
        email: response.data.email,
        token: response.data.token,
        firstname: response.data.first_name,
      });
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
      });
      navigate("/home");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setErrors({
        api: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Join the network</h2>
        <p className={styles.subtitle}>
          Already have an account?{" "}
          <a onClick={() => navigate("/login")} className={styles.signInLink}>
            Sign in
          </a>
        </p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={
            styles.input + (errors.email ? " " + styles.inputError : "")
          }
          required
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <div className={styles.errorMessage}>{errors.email}</div>
        )}
        <div className={styles.nameRow}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className={
              styles.input + (errors.firstName ? " " + styles.inputError : "")
            }
            required
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className={
              styles.input + (errors.lastName ? " " + styles.inputError : "")
            }
            required
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        {(errors.firstName || errors.lastName) && (
          <div className={styles.errorMessage}>
            {errors.firstName || errors.lastName}
          </div>
        )}
        <input
          type="text"
          name="userName"
          placeholder="User Name"
          className={
            styles.input + (errors.userName ? " " + styles.inputError : "")
          }
          required
          value={formData.userName}
          onChange={handleChange}
        />
        {errors.userName && (
          <div className={styles.errorMessage}>{errors.userName}</div>
        )}
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className={
              styles.input + (errors.password ? " " + styles.inputError : "")
            }
            required
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="button"
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <FiEye size={22} color="#6c757d" />
            ) : (
              <FiEyeOff size={22} color="#6c757d" />
            )}
          </button>
        </div>
        {errors.password && (
          <div className={styles.errorMessage}>{errors.password}</div>
        )}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
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
              Signing up...
            </span>
          ) : (
            "Agree and Join"
          )}
        </button>
        {errors.api && (
          <div
            className={styles.errorMessage}
            style={{ textAlign: "center", marginBottom: "1em" }}
          >
            {errors.api}
          </div>
        )}
        <p className={styles.agreeText}>
          I agree to the{" "}
          <a href="#" className={styles.link}>
            privacy policy
          </a>{" "}
          and{" "}
          <a href="#" className={styles.link}>
            terms of service
          </a>
          .
        </p>
        <p className={styles.alreadyAccount}>
          <a onClick={() => navigate("/login")} className={styles.link}>
            Already have an account?
          </a>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
