// Components/VoteButtons/VoteButtons.jsx
import React from "react";
import { LuArrowBigUpDash, LuArrowBigDownDash } from "react-icons/lu"; // Corrected import
import styles from "./voteButtons.module.css";

const formatVotes = (num) => {
  if (typeof num !== "number") return "0";
  if (Math.abs(num) >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (Math.abs(num) >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};

function VoteButtons({ likes = 0, dislikes = 0, userVote, onVote }) {
  const netVotes = likes - dislikes;

  const handleUpvoteClick = (e) => {
    e.stopPropagation();
    onVote("like");
  };

  const handleDownvoteClick = (e) => {
    e.stopPropagation();
    onVote("dislike");
  };

  return (
    <div className={styles.vote_container}>
      <button
        onClick={handleUpvoteClick}
        className={`${styles.vote_button} ${styles.upvote_button} ${
          userVote === "up" ? styles.upvoted : ""
        }`}
        aria-label="Upvote"
      >
        <LuArrowBigUpDash className={styles.icon} /> {/* Corrected usage */}
        <span className={styles.upvote_text}>Upvote</span>
        <span className={styles.vote_count}>{formatVotes(netVotes)}</span>
      </button>
      <button
        onClick={handleDownvoteClick}
        className={`${styles.vote_button} ${styles.downvote_button} ${
          userVote === "down" ? styles.downvoted : ""
        }`}
        aria-label="Downvote"
      >
        <LuArrowBigDownDash className={styles.icon} /> {/* Corrected usage */}
      </button>
    </div>
  );
}

export default VoteButtons;
