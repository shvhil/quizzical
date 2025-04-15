import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import StartScreen from "./components/StartScreen";
import Quiz from "./components/Quiz";
import Footer from "./components/Footer";
import "./App.css";

function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -50,
  },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.4,
};

function App() {
  const [quizState, setQuizState] = useState("start");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [quizOptions, setQuizOptions] = useState({ amount: 5 });

  useEffect(() => {
    if (quizState !== "loading") return;

    setError(null);
    setTimeout(() => {
      let apiUrl = `https://opentdb.com/api.php?amount=${quizOptions.amount}`;
      if (quizOptions.category) {
        apiUrl += `&category=${quizOptions.category}`;
      }
      if (quizOptions.difficulty) {
        apiUrl += `&difficulty=${quizOptions.difficulty}`;
      }
      if (quizOptions.type) {
        apiUrl += `&type=${quizOptions.type}`;
      }

      console.log("Fetching URL:", apiUrl);

      fetch(apiUrl)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          if (data.response_code !== 0) {
            if (data.response_code === 1) {
              throw new Error(
                "Could not return results. The API does not have enough questions for your query."
              );
            } else if (data.response_code === 2) {
              throw new Error(
                "Invalid parameter contains an invalid argument."
              );
            } else {
              throw new Error(
                "API returned an error code: " + data.response_code
              );
            }
          }
          if (!data.results || data.results.length === 0) {
            throw new Error("No questions found for the selected criteria.");
          }

          const formattedQuestions = data.results.map((q, index) => {
            const incorrectAnswers = q.incorrect_answers.map((a) =>
              decodeHtml(a)
            );
            const correctAnswer = decodeHtml(q.correct_answer);
            const allAnswers = [...incorrectAnswers, correctAnswer];

            const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

            return {
              id: `q-${index}-${fetchTrigger}-${quizOptions.category}-${quizOptions.difficulty}-${quizOptions.type}`,
              question: decodeHtml(q.question),
              correctAnswer: correctAnswer,
              allAnswers: shuffledAnswers,
              selectedAnswer: null,
            };
          });
          setQuestions(formattedQuestions);
          setQuizState("active");
        })
        .catch((err) => {
          console.error("Failed to fetch questions:", err);
          setError(
            err.message || "Failed to load questions. Please try again later."
          );
          setQuizState("error");
        });
    }, 500);
  }, [quizState, fetchTrigger, quizOptions]);

  function startQuiz(options) {
    setQuizOptions((prevOptions) => ({ ...prevOptions, ...options }));
    setQuizState("loading");
    setQuestions([]);
  }

  function restartQuiz() {
    setQuizState("start");
    setQuestions([]);
    setError(null);
  }

  function tryAgain() {
    setQuizState("loading");
    setFetchTrigger((prev) => prev + 1);
  }

  return (
    <div className="App-container">
      <Header />
      <main className="App">
        <AnimatePresence mode="wait">
          {quizState === "start" && (
            <motion.div
              key="start"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <StartScreen startQuiz={startQuiz} />
            </motion.div>
          )}

          {quizState === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="loading-container"
            >
              <p>Loading questions...</p>
            </motion.div>
          )}

          {quizState === "error" && (
            <motion.div
              key="error"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="error-container"
            >
              <p style={{ color: "#e74c3c" }}>Error: {error}</p>
              <motion.button
                onClick={tryAgain}
                className="try-again-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            </motion.div>
          )}

          {quizState === "active" && questions.length > 0 && (
            <motion.div
              key="quiz"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Quiz questionsData={questions} restartQuiz={restartQuiz} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
