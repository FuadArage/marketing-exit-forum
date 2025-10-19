import React from "react";
import styles from "./notFound.module.css";
import LayOut from "../../Components/Layout/Layout";

function NotFound() {
  return (
    <LayOut>
      <div className={styles.container}>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.message}>
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </LayOut>
  );
}

export default NotFound;
