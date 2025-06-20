// src/components/InteractiveQuiz.js
import React, { useState } from 'react';

function InteractiveQuiz({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (qIndex, selectedOption) => {
    setAnswers({ ...answers, [qIndex]: selectedOption });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = Object.keys(answers).reduce((acc, key) => {
    const qIndex = parseInt(key);
    if (answers[qIndex] === quiz[qIndex].answer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div>
      <h3>Take Quiz</h3>
      {quiz.map((q, index) => (
        <div key={index} className="mb-4">
          <strong>Q{index + 1}: {q.question}</strong>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {q.options.map((opt, idx) => (
              <li key={idx}>
                <label>
                  <input
                    type="radio"
                    name={`q-${index}`}
                    value={opt}
                    disabled={submitted}
                    checked={answers[index] === opt}
                    onChange={() => handleOptionChange(index, opt)}
                  />
                  {' '}
                  {opt}
                </label>
              </li>
            ))}
          </ul>
          {submitted && (
            <>
              <p>
                <strong>Correct Answer:</strong> {q.answer}
                <br />
                <strong>Explanation:</strong> {q.explanation || "No explanation provided."}
              </p>
              <hr />
            </>
          )}
        </div>
      ))}

      {!submitted ? (
        <button className="btn btn-primary" onClick={handleSubmit}>Submit Quiz</button>
      ) : (
        <div className="mt-3">
          <h4>Score: {score} / {quiz.length}</h4>
        </div>
      )}
    </div>
  );
}

export default InteractiveQuiz;
