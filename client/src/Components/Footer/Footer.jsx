import React from "react";
import styles from "./Footer.module.css";
import logo from "../../assets/imgs/logo.png";
import { FaYoutube, FaTelegram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Logo and Socials */}
      <div className={styles.logoSection}>
        <img src={logo} alt="Marketing Logo" className={styles.logo} />
        <div className={styles.iconsWrapper}>
          <a
            href="https://t.me/marketingexam2026"
            aria-label="Telegram"
            target="_blank"
          >
            <FaTelegram className={styles.icon} />
          </a>
          <a
            href="https://www.youtube.com/@marketers2026"
            aria-label="YouTube"
            target="_blank"
          >
            <FaYoutube className={styles.icon} />
          </a>
        </div>
      </div>

      {/* Useful Links */}
      <div className={styles.linksSection}>
        <h3>Useful Links</h3>
        <ul>
          <li>
            <a href="#">Terms of Service</a>
          </li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
          <li>
            <a
              href="https://t.me/marketingexam2026"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join our Telegram Group
            </a>
          </li>
        </ul>
      </div>

      {/* Contact Info */}
      <div className={styles.contactSection}>
        <h3>Contact Info</h3>
        <ul>
          <li>
            <a href="fuadarage101@gmail.com">Marketing Networks</a>
          </li>
          <li>
            <a href="fuadarage101@gmail.com">fuadarage101@gmail.com</a>
          </li>
          <li>
            <a href="tel:+251-945-465-428">+251-945-465-428</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
