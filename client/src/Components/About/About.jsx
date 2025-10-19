import React from "react";

import styles from "./About.module.css";

function About() {
  // This toggles the visibility of the "How It Works" section
  const handleHowItWorks = (e) => {
    const section = document.querySelector(`.${styles.how_it_works_section}`);
    section.classList.toggle(styles.show);

    // If showing, add global click listener
    if (section.classList.contains(styles.show)) {
      const handleOutsideClick = (event) => {
        const isClickInside =
          section.contains(event.target) || e.target.contains(event.target);
        if (!isClickInside) {
          section.classList.remove(styles.show);
          document.removeEventListener("click", handleOutsideClick);
        }
      };

      // Delay to avoid immediate closing from the same click
      setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
      }, 0);
    }
  };
  return (
    <>
      <div className={styles.about_section}>
        <p className={styles.about_title}>About</p>
        <h1>Marketing Networks Q&A</h1>
        <p className={styles.about_text}>
          Marketing Networks Q&A is a dedicated learning hub designed
          specifically for final-year marketing students preparing for their
          exit exams. Our platform offers a focused, collaborative space to ask
          questions, exchange insights, and master key concepts in marketing
          strategy, consumer behavior, digital trends, and more.
        </p>
        <p className={styles.about_text}>
          We believe that academic success is built on shared knowledge and
          active engagement. That’s why our mission is to connect students with
          peers, mentors, and curated resources that make exam prep more
          effective, efficient, and empowering
        </p>
        <p className={styles.about_text}>
          Whether you're clarifying complex topics, reviewing past questions, or
          contributing your own expertise, Marketing Networks Q&A helps you stay
          confident and exam-ready. Join the conversation, sharpen your
          understanding, and be part of a community that’s committed to growth,
          excellence, and professional readiness
        </p>
        <button className={styles.how_it_works_btn} onClick={handleHowItWorks}>
          HOW IT WORKS
        </button>

        <div className={styles.how_it_works_section}>
          <h2>How It Works</h2>

          <div className={styles.steps}>
            <div className={styles.step}>
              <h3>1. Ask Questions</h3>
              <p>
                Submit your marketing-related questions to get clarity and
                support.
              </p>
            </div>

            <div className={styles.step}>
              <h3>2. Get Answers</h3>
              <p>
                Receive expert insights and peer responses tailored to your
                needs.
              </p>
            </div>

            <div className={styles.step}>
              <h3>3. Share Knowledge</h3>
              <p>Contribute your experience to help others succeed.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
