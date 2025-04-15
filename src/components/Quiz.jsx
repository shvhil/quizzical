import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Question from "./Question";
import "./Quiz.css";

// animation variants
const quizContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const questionItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const resultsVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      delay: 0.2,
    },
  },
};

function Quiz({ questionsData, restartQuiz }) {
  const [questions, setQuestions] = useState(questionsData);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  function handleSelectAnswer(questionId, answer) {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, selectedAnswer: answer } : q
      )
    );
  }

  function checkAnswers() {
    let currentScore = 0;
    questions.forEach((q) => {
      if (q.selectedAnswer === q.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setQuizFinished(true);
  }

  const questionElements = questions.map((q) => (
    <motion.div key={q.id} variants={questionItemVariants}>
      <Question
        questionData={q}
        handleSelectAnswer={handleSelectAnswer}
        quizFinished={quizFinished}
      />
    </motion.div>
  ));

  return (
    <motion.div
      className="quiz-container"
      variants={quizContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {questionElements}
      <div className="quiz-footer">
        <AnimatePresence mode="wait">
          {quizFinished ? (
            <motion.div
              key="results"
              className="results-container"
              variants={resultsVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              <p className="score-text">
                You scored {score}/{questions.length} correct answers
              </p>
              <motion.button
                className="play-again-button"
                onClick={restartQuiz}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              key="check"
              className="check-answers-button"
              onClick={checkAnswers}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Check Answers
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Quiz;
