import { useContext } from "react";
import { UserContext } from "../Context";
import { ClipLoader } from "react-spinners";
import { Navigate } from "react-router-dom";
import styles from "./protected.module.css"

export function ProtectedRoute({ children }) {
  const { userData, loadingAuth } = useContext(UserContext);
  
  if (loadingAuth) {
    return (
      <div className={styles.spinner_container}>
        <ClipLoader color="var(--primary)" size={50} />
      </div>
    );
  }


  if (!userData?.token || !userData?.userid) {
    return <Navigate to="/landing" replace />;
  }
  return children;
}
