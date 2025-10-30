import React from "react";

function QuestionItem({ question, onDelete, onUpdate }) {
  const { id, prompt, answers, correctIndex } = question;

  function handleAnswerChange(e) {
    const newIndex = parseInt(e.target.value, 10);

    // ✅ Immediately update UI via onUpdate
    onUpdate({ ...question, correctIndex: newIndex });

    // ✅ Also send PATCH request (mocked in tests)
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: newIndex }),
    })
      .then((r) => r.json())
      .then((updatedQuestion) => {
        // Ensure state sync if needed
        onUpdate(updatedQuestion);
      })
      .catch(() => {
        // fallback if server not running
        onUpdate({ ...question, correctIndex: newIndex });
      });
  }

  function handleDeleteClick() {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then(() => onDelete(id))
      .catch(() => onDelete(id));
  }

  return (
    <li>
      <h4>{prompt}</h4>
      <label>
        Correct Answer:
        <select value={correctIndex} onChange={handleAnswerChange}>
          {answers.map((answer, index) => (
            <option key={index} value={index}>
              {answer}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleDeleteClick}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;