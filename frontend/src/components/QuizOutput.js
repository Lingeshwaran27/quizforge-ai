// src/components/QuizOutput.js
import React from 'react';

function QuizOutput({ quiz }) {
  if (!Array.isArray(quiz)) {
    return <div>Error: Quiz format invalid or not parsed yet.</div>;
  }

  return (
    <div>
      <h3>Quiz Output</h3>
      {quiz.map((item, index) => (
        <div key={index} className="mb-3">
          <strong>Q{index + 1}: {item.question}</strong>
          <ul>
            {item.options.map((opt, idx) => (
              <li key={idx}>{opt}</li>
            ))}
          </ul>
          <em>Answer: {item.answer}</em>
        </div>
      ))}
    </div>
  );
}

export default QuizOutput;
