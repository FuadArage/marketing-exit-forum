import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "./questionDetailAndAnswer.module.css";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "../../Utility/axios";
import LayOut from "../../Components/Layout/Layout";
import { UserContext } from "../../Components/Context";
import getTimeDifference from "../../Utility/helpers";
import VoteButtons from "../../Components/VoteButtons/VoteButtons";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";

function QuestionDetailAndAnswer() {
  const { userData, setUserData } = useContext(UserContext);
  const token = userData?.token;
  const { question_id } = useParams();
  const navigate = useNavigate();

  const [answer, setAnswer] = useState({
    user_id: userData?.userid,
    question_id,
    answer: "",
  });

  const [loading, setLoading] = useState(false);
  const [editQuestionMode, setEditQuestionMode] = useState(false);
  const [editAnswerMode, setEditAnswerMode] = useState(null); // answer_id of the answer being edited
  const [editedQuestion, setEditedQuestion] = useState(null);
  const [editedAnswer, setEditedAnswer] = useState("");
  const [filterYourAnswers, setFilterYourAnswers] = useState(false); // State for filtering user's answers

  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [loadingQuestionDetail, setLoadingQuestionDetail] = useState(false);
  const [error, setError] = useState({
    getAnswerError: null,
    getQuestionDetailError: null,
  });

  const [answersForQuestion, setAllQuestionAnswers] = useState([]);
  const [answerPage, setAnswerPage] = useState(1);
  const [answerPageSize] = useState(10);
  const [answerPagination, setAnswerPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 5,
    totalPages: 1,
  });
  const [questionDetail, setQuestionDetail] = useState(null);
  const [successAnswer, setSuccessAnswer] = useState(false);
  const [answerSort, setAnswerSort] = useState("recent");

  // Check if the user has any answers to this question
  const hasUserAnswers = answersForQuestion.some(
    (ans) => ans.user_id === userData?.userid
  );

  // Fetch question details
  const getQuestionDetail = async () => {
    setLoadingQuestionDetail(true);
    setError({ ...error, getQuestionDetailError: null });
    try {
      const res = await axios.get(`/question/${question_id}`);
      setQuestionDetail(res.data.question);
      setEditedQuestion({
        title: res.data.question.question_title,
        description: res.data.question.question_description || "",
        tag: res.data.question.tag || "",
      });
    } catch (err) {
      console.error(`Failed to ${action} ${type}`, err);
      toast.error(`Failed to ${action} ${type}.`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoadingQuestionDetail(false);
    }
  };

  // Fetch answers
  const getAllAnswers = async () => {
    setLoadingAnswers(true);
    setError({ ...error, getAnswerError: null });
    try {
      const res = await axios.get(
        `/answer/${question_id}?page=${answerPage}&pageSize=${answerPageSize}&sort=${answerSort}`
      );
      if (Array.isArray(res.data.answers)) {
        setAllQuestionAnswers(res.data.answers);
        setAnswerPagination(
          res.data.pagination || {
            total: 0,
            page: 1,
            pageSize: 5,
            totalPages: 1,
          }
        );
      } else {
        setAllQuestionAnswers([]);
        setAnswerPagination({
          total: 0,
          page: 1,
          pageSize: 5,
          totalPages: 1,
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";
      setError((prev) => ({ ...prev, getAnswerError: errorMessage }));
      setAllQuestionAnswers([]);
      setAnswerPagination({
        total: 0,
        page: 1,
        pageSize: 5,
        totalPages: 1,
      });
    } finally {
      setLoadingAnswers(false);
    }
  };

  // Post answer
  const submitAnswer = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!token) {
      setLoading(false);
      toast.error("Login to post answer");
      return;
    }
    try {
      await axios.post("/answer", answer);
      getAllAnswers();
      setSuccessAnswer(true);
      setAnswer({ ...answer, answer: "" });
      toast.success("Answer Posted Successfully");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Edit question
  const handleEditQuestion = async () => {
    if (!token) {
      toast.error("Please log in to edit the question.");
      return;
    }
    const result = await Swal.fire({
      title: "Save changes?",
      text: "Are you sure you want to update this question?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.put(`/question/${question_id}`, editedQuestion);
      setQuestionDetail((prev) => ({ ...prev, ...editedQuestion }));
      setEditQuestionMode(false);
      toast.success("Question updated successfully.");
    } catch (err) {
      console.error("Failed to edit question", err);
      toast.error(err.response?.data?.error || "Failed to edit question.");
    }
  };

  // Delete question
  const handleDeleteQuestion = async () => {
    if (!token) {
      toast.error("Please log in to delete the question.");
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/question/${question_id}`);
      toast.success("Question deleted successfully.");
      navigate("/home");
    } catch (err) {
      console.error("Failed to delete question", err);
      toast.error(err.response?.data?.error || "Failed to delete question.");
    }
  };

  // Edit answer
  const handleEditAnswer = async (answerId) => {
    if (!token) {
      toast.error("Please log in to edit the answer.");
      return;
    }
    const result = await Swal.fire({
      title: "Save changes?",
      text: "Are you sure you want to update this answer?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.put(`/answer/${answerId}`, { answer: editedAnswer });
      setAllQuestionAnswers((prev) =>
        prev.map((ans) =>
          ans.answer_id === answerId ? { ...ans, answer: editedAnswer } : ans
        )
      );
      setEditAnswerMode(null);
      setEditedAnswer("");
      toast.success("Answer updated successfully.");
    } catch (err) {
      console.error("Failed to edit answer", err);
      toast.error(err.response?.data?.error || "Failed to edit answer.");
    }
  };

  // Delete answer
  const handleDeleteAnswer = async (answerId) => {
    if (!token) {
      toast.error("Please log in to delete the answer.");
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/answer/${answerId}`);
      setAllQuestionAnswers((prev) =>
        prev.filter((ans) => ans.answer_id !== answerId)
      );
      toast.success("Answer deleted successfully.");
    } catch (err) {
      console.error("Failed to delete answer", err);
      toast.error(err.response?.data?.error || "Failed to delete answer.");
    }
  };

  // Handle input changes for new answer
  const handleChange = (e) => {
    setSuccessAnswer(false);
    const { name, value } = e.target;
    setAnswer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for editing question
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle filter for user's answers
  const handleFilterYourAnswers = () => {
    setFilterYourAnswers((prev) => !prev);
    setAnswerPage(1); // Reset to first page when filter changes
  };

  // Load question detail and answers when component mounts
  useEffect(() => {
    getQuestionDetail();
    getAllAnswers();
  }, [
    question_id,
    successAnswer,
    answerPage,
    answerPageSize,
    answerSort,
    editQuestionMode,
  ]);

  // Update answer state when userData changes
  useEffect(() => {
    setAnswer((prev) => ({
      ...prev,
      user_id: userData?.userid,
    }));
  }, [userData?.userid]);

  // Vote handler
  const handleVote = async (type, id, action) => {
    if (!token) {
      toast.error("Please log in to vote.");
      return;
    }
    try {
      const res = await axios.post(`/${type}s/${id}/${action}`);
      const { likes, dislikes } = res.data;
      if (type === "question") {
        setQuestionDetail((prev) => ({ ...prev, likes, dislikes }));
      } else if (type === "answer") {
        setAllQuestionAnswers((prevAnswers) =>
          prevAnswers.map((ans) =>
            ans.answer_id === id ? { ...ans, likes, dislikes } : ans
          )
        );
      }
    } catch (err) {
      console.error(`Failed to ${action} ${type}`, err);
      toast.error(`Failed to ${action} ${type}.`);
    }
  };

  // Filter answers based on filterYourAnswers state
  const displayedAnswers = filterYourAnswers
    ? answersForQuestion.filter((ans) => ans.user_id === userData?.userid)
    : answersForQuestion;

  return (
    <LayOut>
      <div className={styles.outer__container}>
        <div className={styles.theQuestion}>
          <h3 className={styles.title}>Question</h3>
          {loadingQuestionDetail ? (
            <div className={styles.loading_container}>
              <ClipLoader
                color={"var(--primary)"}
                loading={loadingQuestionDetail}
                size={50}
              />
            </div>
          ) : questionDetail ? (
            <>
              {editQuestionMode ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditQuestion();
                  }}
                  className={styles.editQuestionForm}
                >
                  <input
                    type="text"
                    name="title"
                    value={editedQuestion.title}
                    onChange={handleQuestionChange}
                    placeholder="Question title"
                    required
                  />
                  <textarea
                    name="description"
                    value={editedQuestion.description}
                    onChange={handleQuestionChange}
                    placeholder="Question description"
                  />
                  <input
                    type="text"
                    name="tag"
                    value={editedQuestion.tag}
                    onChange={handleQuestionChange}
                    placeholder="Tag"
                  />
                  <div>
                    <button className={styles.saveBtn} type="submit">
                      Save
                    </button>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setEditQuestionMode(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className={styles.Qtitle}>
                    {questionDetail.question_title}
                  </p>
                  <p>{questionDetail.question_description}</p>
                  <p>
                    Asked by{" "}
                    {questionDetail.user_id === userData?.userid
                      ? "you"
                      : "@" + questionDetail.user_name}
                  </p>
                  {questionDetail.user_id === userData?.userid && (
                    <div className={styles.edit_delete_buttons}>
                      <button
                        className={styles.editBtn}
                        onClick={() => setEditQuestionMode(true)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={handleDeleteQuestion}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  )}
                  <VoteButtons
                    likes={questionDetail.likes}
                    dislikes={questionDetail.dislikes}
                    userVote={questionDetail.user_vote_type}
                    onVote={(action) =>
                      handleVote("question", questionDetail.question_id, action)
                    }
                  />
                </>
              )}
            </>
          ) : (
            <p>{error?.getQuestionDetailError}</p>
          )}
        </div>

        <div className={styles.community_answer}>
          <hr />
          <div className={styles.questions_sort_row}>
            <h2 className={styles.title}>Answers From the Community</h2>
            <div className={styles.sort_container}>
              <label htmlFor="answer-sort-select" className={styles.sort_label}>
                Sort by:
              </label>
              <select
                id="answer-sort-select"
                className={styles.sort_select}
                value={answerSort}
                onChange={(e) => {
                  setAnswerSort(e.target.value);
                  setAnswerPage(1);
                }}
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
          <hr />
          <div>
            {hasUserAnswers && (
              <button
                className={styles.filter_btn}
                onClick={handleFilterYourAnswers}
                disabled={!token} // Disable if not logged in
              >
                {filterYourAnswers ? "Show All Answers" : "Your Answers"}
              </button>
            )}
          </div>
          <div className={styles.answers_container}>
            {loadingAnswers ? (
              <div className={styles.loading_container}>
                <ClipLoader
                  color={"var(--primary)"}
                  loading={loadingAnswers}
                  size={50}
                />
              </div>
            ) : error.getAnswerError ? (
              <p>{error?.getAnswerError}</p>
            ) : displayedAnswers.length === 0 ? (
              <p>
                {questionDetail?.user_id === userData?.userid
                  ? "Your question has no answers yet."
                  : "This question has no answers yet."}
              </p>
            ) : (
              <>
                {displayedAnswers.map((answerItem) => (
                  <div
                    key={answerItem.answer_id}
                    className={styles.question_item_wrapper}
                  >
                    <div className={styles.user_container}>
                      <div className={styles.user_question}>
                        <div className={styles.usericon_and_username}>
                          <div className={styles.inner_center}>
                            <FaUserCircle
                              size={80}
                              className={styles.usericon}
                              style={{
                                background: "var(--white)",
                                color: "#1e3a5f",
                                borderRadius: "50%",
                                padding: "5px",
                              }}
                            />
                            <span>
                              {answerItem.user_id === userData?.userid
                                ? "You"
                                : "@" + answerItem.user_name}
                            </span>
                          </div>
                        </div>

                        {editAnswerMode === answerItem.answer_id ? (
                          <form
                            className={styles.editAnswerForm}
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleEditAnswer(answerItem.answer_id);
                            }}
                          >
                            <textarea
                              value={editedAnswer}
                              onChange={(e) => setEditedAnswer(e.target.value)}
                              required
                            />
                            <div>
                              <button className={styles.saveBtn} type="submit">
                                Save
                              </button>
                              <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={() => {
                                  setEditAnswerMode(null);
                                  setEditedAnswer("");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className={styles.Qbox}>
                            <p className={styles.Qtitle}>{answerItem.answer}</p>
                            <p className={styles.timestamp_title}>
                              {getTimeDifference(answerItem.created_at)}
                            </p>
                            {answerItem.user_id === userData?.userid && (
                              <div className={styles.edit_delete_buttons}>
                                <button
                                  className={styles.editBtn}
                                  onClick={() => {
                                    setEditAnswerMode(answerItem.answer_id);
                                    setEditedAnswer(answerItem.answer);
                                  }}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className={styles.deleteBtn}
                                  onClick={() =>
                                    handleDeleteAnswer(answerItem.answer_id)
                                  }
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className={styles.vote_section}>
                        <VoteButtons
                          likes={answerItem.likes}
                          dislikes={answerItem.dislikes}
                          userVote={answerItem.user_vote_type}
                          onVote={(action) =>
                            handleVote("answer", answerItem.answer_id, action)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className={styles.pagination_container}>
                  <button
                    className={styles.pagination_btn}
                    onClick={() => setAnswerPage((p) => Math.max(1, p - 1))}
                    disabled={answerPage === 1}
                  >
                    Previous
                  </button>
                  <span className={styles.pagination_info}>
                    Page {answerPagination.page} of{" "}
                    {answerPagination.totalPages}
                  </span>
                  <button
                    className={styles.pagination_btn}
                    onClick={() =>
                      setAnswerPage((p) =>
                        Math.min(answerPagination.totalPages, p + 1)
                      )
                    }
                    disabled={answerPage === answerPagination.totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.answer__box}>
          <div className={styles.answer_form_container}>
            <h3 className={styles.title}>Answer the Question</h3>
            <form onSubmit={submitAnswer} className={styles.answer_form}>
              <textarea
                name="answer"
                id="answer"
                cols="30"
                rows="5"
                placeholder="Write your answer here..."
                onChange={handleChange}
                value={answer.answer}
                required
              ></textarea>
              <button
                type="submit"
                className={styles.answerBtn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ClipLoader color={"#fff"} loading={loading} size={20} />
                    <span style={{ marginLeft: "10px" }}>Posting . . .</span>
                  </>
                ) : (
                  "Post Your Answer"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </LayOut>
  );
}

export default QuestionDetailAndAnswer;
