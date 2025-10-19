// import React from 'react'
import React from "react";

// import components
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./layout.module.css"

function LayOut({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      <main className={styles.mainContent}>
        {children} {/* this includes the whole page content */}
      </main>
      <Footer />
    </div>
  );
}

export default LayOut;
