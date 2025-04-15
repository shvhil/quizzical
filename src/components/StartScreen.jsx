import React from "react";
import { motion } from "framer-motion";
import "./StartScreen.css";

// animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

function StartScreen({ startQuiz }) {
  return (
    <motion.div
      className="start-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.p variants={itemVariants}>Test your trivia knowledge!</motion.p>
      <motion.button
        className="start-button"
        onClick={startQuiz}
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Quiz
      </motion.button>
    </motion.div>
  );
}

export default StartScreen;
