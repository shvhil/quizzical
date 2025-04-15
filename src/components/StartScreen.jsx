import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./StartScreen.css";

// animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({
    category: "",
    difficulty: "easy",
    type: "multiple",
  });

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.trivia_categories || []);
        setLoadingCategories(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
        setLoadingCategories(false);
      });
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));
  }

  function handleStart() {
    startQuiz(selectedOptions);
  }

  return (
    <motion.div
      className="start-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.p variants={itemVariants} className="start-description">
        Answer the questions and test your knowledge!
      </motion.p>

      <motion.div className="options-form" variants={itemVariants}>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={selectedOptions.category}
            onChange={handleChange}
            disabled={loadingCategories}
          >
            <option value="">Any Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            name="difficulty"
            value={selectedOptions.difficulty}
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="type">Type of questions:</label>
          <select
            id="type"
            name="type"
            value={selectedOptions.type}
            onChange={handleChange}
          >
            <option value="multiple">Multiple Choice</option>
            <option value="boolean">True / False</option>
          </select>
        </div>
      </motion.div>

      <motion.button
        className="start-button"
        onClick={handleStart}
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loadingCategories}
      >
        {loadingCategories ? "Loading..." : "Start Quiz"}
      </motion.button>
    </motion.div>
  );
}

export default StartScreen;
