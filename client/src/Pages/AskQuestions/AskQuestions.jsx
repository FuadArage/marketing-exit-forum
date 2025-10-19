import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./askQuestions.module.css";
import axios from "../../Utility/axios";
import LayOut from "../../Components/Layout/Layout";
import { UserContext } from "../../Components/Context";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function AskQuestions() {
  const { userData } = useContext(UserContext);
  const token = userData?.token;
  const navigate = useNavigate(); // Initialize navigation
  const [question, setQuestion] = useState({
    title: "",
    description: "",
    tag: "",
    userId: userData?.userid || null,
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update question.userId if userData.userid changes after initial load
  useEffect(() => {
    if (userData?.userid) {
      setQuestion((prev) => ({ ...prev, userId: userData.userid }));
    }
  }, [userData?.userid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Ensure user is authenticated before posting
    if (!token || !userData?.userid) {
      toast.error("Authentication required. Redirecting to login.");
      navigate("/landing", {
        state: { message: "Please login to ask a question." },
      });
      setLoading(false);
      return;
    }

    try {
      // Post the question
      await axios.post("/questions", question, {});

      // Reset question state after successful submission
      setQuestion({
        title: "",
        description: "",
        tag: "",
        userId: userData.userid,
      });
      navigate("/home");
      toast.success("Question posted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/landing");
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.message === "Tag must be 20 characters or less"
      ) {
        setError(
          "Tag is too long. Please use a tag with 20 characters or less."
        );
        toast.error(
          "Tag is too long. Please use a tag with 20 characters or less."
        );
      } else {
        toast.error("Server error. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <LayOut>
      <div className={styles.outer__container}>
        <div className={styles.steps__container}>
          <h2>Steps to write a good question.</h2>
          <ul>
            <li>Summarize your problem in one-line title.</li>
            <li>Describe your problem in more detail.</li>
            <li>Describe what you tried and what you expected to happen.</li>
            <li>Review your question and post it to the site.</li>
          </ul>
        </div>
        <div className={styles.question__container}>
          <h3 className={styles.title}>Ask a Public Question</h3>
          <Link to="/home">Go to Question page</Link>
          <form onSubmit={handleSubmit} className={styles.askform}>
            <input
              type="text"
              placeholder="Title"
              name="title"
              id="question_title"
              onChange={handleChange}
              value={question.title}
              required
            />
            <textarea
              placeholder="Question Description ..."
              name="description"
              id="question_description"
              onChange={handleChange}
              value={question.description}
              required
            />
            <input
              type="text"
              placeholder="Tag (optional)"
              name="tag"
              onChange={handleChange}
              value={question.tag}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.askBtn} disabled={loading}>
              {loading ? "Posting..." : "Post Your Question"}
            </button>
          </form>
        </div>
      </div>
    </LayOut>
  );
}

export default AskQuestions;
