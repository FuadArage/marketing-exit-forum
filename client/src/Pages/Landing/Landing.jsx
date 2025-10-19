import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "../../Components/Login/Login";
import SignUp from "../../Components/SignUp/SignUp";
import About from "../../Components/About/About";
import LayOut from "../../Components/Layout/Layout";
import styles from "./landing.module.css";
import { UserContext } from "../../Components/Context/UserContext";
import { toast } from "react-toastify";

function Landing() {
  const { userData } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const message = location.state?.message;

  const isSignupPage = location.pathname === "/sign-up";

  useEffect(() => {
    if (userData?.userid) {
      navigate("/home");
    }
  }, [userData, navigate]);

  useEffect(() => {
    if (message) {
      toast.info(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [message]);

  return (
    <LayOut>
      <div className={styles.landingPageContainer}>
        <div className={styles.login}>
          <div
            className={styles.sliderWrapper}
            style={{
              transform: isSignupPage ? "translateX(-50%)" : "translateX(0)",
            }}
          >
            <div className={`${styles.formPane} ${styles.shrink}`}>
              <Login />
            </div>
            <div className={`${styles.formPane} ${styles.shrink}`}>
              <SignUp />
            </div>
          </div>
        </div>
        <div className={`${styles.about} ${styles.shrinkAbout}`}>
          <About />
        </div>
      </div>
    </LayOut>
  );
}

export default Landing;