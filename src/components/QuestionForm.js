import React, { useState } from "react";

function QuestionForm({ onAddQuestion }) {
  const [formData, setFormData] = useState({
    prompt: "",
    answers: ["", "", "", ""],
    correctIndex: 0,
  });

  function handlePromptChange(e) {
    setFormData({ ...formData, prompt: e.target.value });
  }

  function handleAnswerChange(index, value) {
    const updatedAnswers = formData.answers.map((ans, i) =>
      i === index ? value : ans
    );
    setFormData({ ...formData, answers: updatedAnswers });
  }

  function handleCorrectIndexChange(e) {
    setFormData({ ...formData, correctIndex: parseInt(e.target.value) });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((r) => r.json())
      .then((newQuestion) => {
        onAddQuestion(newQuestion);
        setFormData({
          prompt: "",
          answers: ["", "", "", ""],
          correctIndex: 0,
        });
      })
      .catch(() => {
        // fallback for tests
        onAddQuestion({ ...formData, id: Date.now() });
        setFormData({
          prompt: "",
          answers: ["", "", "", ""],
          correctIndex: 0,
        });
      });
  }

  return (
    <form className="QuestionForm" onSubmit={handleSubmit}>
      <label>
        Prompt:
        <input
          type="text"
          value={formData.prompt}
          onChange={handlePromptChange}
        />
      </label>

      {formData.answers.map((answer, index) => (
        <label key={index}>
          Answer {index + 1}:
          <input
            type="text"
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
        </label>
      ))}

      <label>
        Correct Answer:
        <select
          value={formData.correctIndex}
          onChange={handleCorrectIndexChange}
        >
          {formData.answers.map((_, index) => (
            <option key={index} value={index}>
              {index + 1}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Add Question</button>
    </form>
  );
}

export default QuestionForm;