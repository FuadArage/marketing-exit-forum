import React from "react";
import { Routes, Route} from "react-router-dom";
import Home from "./Pages/Home";
import Landing from "./Pages/Landing";
import AskQuestions from "./Pages/AskQuestions";
import QuestionDetail from "./Pages/QuestionDetailAndAnswer";
import NotFound from "./Pages/NotFound";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ProtectedRoute } from "./Components/ProtectedRoute/ProtectedRoute";

import ForgotPassword from "./Pages/forgotpassword/ForgotPassword";
import ResetPassword from "./Pages/forgotpassword/ResetPassword";
import Profile from "./Pages/Profile";

function App() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route
          path="/ask-questions"
          element={
            <ProtectedRoute>
              <AskQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/question-detail/:question_id"
          element={<QuestionDetail />}
        />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Landing />} />
        <Route path="/sign-up" element={<Landing />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/profile/:user_id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
