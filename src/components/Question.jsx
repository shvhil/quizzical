import React from "react";
import "./Question.css";

function Question({ questionData, handleSelectAnswer, quizFinished }) {
  const { id, question, allAnswers, selectedAnswer, correctAnswer } =
    questionData;

  function getButtonClass(answer) {
    if (!quizFinished) {
      // highlight selected
      return selectedAnswer === answer ? "selected" : "";
    }
    if (answer === correctAnswer) {
      return "correct";
    }
    if (answer === selectedAnswer && answer !== correctAnswer) {
      return "incorrect";
    }
    return "disabled";
  }

  return (
    <div className="question-container">
      <h3 className="question-text">{question}</h3>
      <div className="answers-container">
        {allAnswers.map((answer, index) => (
          <button
            key={index}
            className={`answer-button ${getButtonClass(answer)}`}
            onClick={() => !quizFinished && handleSelectAnswer(id, answer)}
            disabled={quizFinished}
          >
            {answer}
          </button>
        ))}
      </div>
      <hr className="question-divider" />
    </div>
  );
}

export default Question;
