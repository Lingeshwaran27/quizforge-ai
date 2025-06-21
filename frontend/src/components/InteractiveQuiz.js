// src/components/InteractiveQuiz.js
import React, { useState, useEffect, useCallback } from 'react';
import './InteractiveQuiz.css';

function InteractiveQuiz({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState(null); // "per-question" or "total"
  const [quizStarted, setQuizStarted] = useState(false);
  const [totalTime, setTotalTime] = useState(120);
  const [timeLeft, setTimeLeft] = useState(120);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [bookmarked, setBookmarked] = useState([]);
  const [questionTimers, setQuestionTimers] = useState({});
  const [questionLocked, setQuestionLocked] = useState({});

  const handleOptionChange = (qIndex, selectedOption) => {
    if (questionLocked[qIndex]) return;
    setAnswers(prev => ({ ...prev, [qIndex]: selectedOption }));
  };

  const toggleBookmark = (index) => {
    setBookmarked(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleStart = () => {
    setQuizStarted(true);
    setTimeLeft(totalTime);
    if (mode === 'per-question') startPerQuestionTimer(currentQuestion);
  };

  const startPerQuestionTimer = useCallback((qIndex) => {
    if (questionTimers[qIndex] || submitted) return;
    const timer = setTimeout(() => {
      setQuestionLocked(prev => ({ ...prev, [qIndex]: true }));
    }, 30000); // 30s per question
    setQuestionTimers(prev => ({ ...prev, [qIndex]: timer }));
  }, [questionTimers, submitted]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    Object.values(questionTimers).forEach(clearTimeout);
  }, [questionTimers]);

  useEffect(() => {
    if (!quizStarted || submitted || mode !== 'total') return;

    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else {
      handleSubmit();
    }
  }, [quizStarted, submitted, timeLeft, mode, handleSubmit]);

  useEffect(() => {
    if (mode === 'per-question' && quizStarted && !submitted) {
      startPerQuestionTimer(currentQuestion);
    }
  }, [currentQuestion, mode, quizStarted, submitted, startPerQuestionTimer]);

  const score = Object.keys(answers).reduce((acc, key) => {
    const qIndex = parseInt(key);
    if (answers[qIndex] === quiz[qIndex].answer) return acc + 1;
    return acc;
  }, 0);

  if (!quizStarted) {
    return (
      <div>
        <h3>Choose Timer Mode</h3>
        <div className="mb-3">
          <label className="me-2">Mode:</label>
          <select value={mode || ''} onChange={(e) => setMode(e.target.value)}>
            <option value="">--Select--</option>
            <option value="per-question">Per Question Timer</option>
            <option value="total">Total Quiz Timer</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Time (in seconds):</label>
          <input
            type="number"
            value={totalTime}
            onChange={(e) => setTotalTime(parseInt(e.target.value))}
            className="form-control"
          />
        </div>
        <button className="btn btn-success" onClick={handleStart} disabled={!mode}>
          Start Quiz
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Take Quiz</h3>
        {mode === 'total' && !submitted && <span className="badge bg-info">{timeLeft}s left</span>}
      </div>

      {/* Progress Grid */}
      <div className="progress-grid">
        {quiz.map((_, i) => {
          const isAnswered = answers[i] !== undefined;
          const isActive = currentQuestion === i;
          const isBookmarked = bookmarked.includes(i);

          let className = 'grid-box';
          if (isBookmarked) className += ' bookmarked';
          else if (isAnswered) className += ' answered';
          else className += ' unanswered';
          if (isActive) className += ' active';

          return (
            <div
              key={i}
              className={className}
              onClick={() => !submitted && setCurrentQuestion(i)}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {submitted ? (
        <>
          <h4>Score: {score} / {quiz.length}</h4>
          <hr />
          {quiz.map((q, index) => (
            <div key={index} className="mb-4">
              <strong>Q{index + 1}: {q.question}</strong>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {q.options.map((opt, idx) => {
                  const isCorrect = q.answer === opt;
                  const isSelected = answers[index] === opt;
                  let className = '';
                  if (isCorrect) className = 'text-success';
                  else if (isSelected) className = 'text-danger';

                  return (
                    <li key={idx} className={className}>
                      <label>{opt}</label>
                    </li>
                  );
                })}
              </ul>
              <p>
                <strong>Correct Answer:</strong> {q.answer}
                <br />
                <strong>Explanation:</strong> {q.explanation || "No explanation provided."}
              </p>
              <hr />
            </div>
          ))}
        </>
      ) : (
        <>
          {/* Active Question Section */}
          <div className="mb-4">
            <strong>Q{currentQuestion + 1}: {quiz[currentQuestion].question}</strong>
            <button
              className={`btn btn-sm ms-2 ${bookmarked.includes(currentQuestion) ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => toggleBookmark(currentQuestion)}
            >
              🔖 Bookmark
            </button>

            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {quiz[currentQuestion].options.map((opt, idx) => {
                const isCorrect = quiz[currentQuestion].answer === opt;
                const isSelected = answers[currentQuestion] === opt;
                const shouldHighlight = questionLocked[currentQuestion];
                let className = '';

                if (shouldHighlight) {
                  if (isCorrect) className = 'text-success';
                  else if (isSelected) className = 'text-danger';
                }

                return (
                  <li key={idx} className={className}>
                    <label>
                      <input
                        type="radio"
                        name={`q-${currentQuestion}`}
                        value={opt}
                        disabled={questionLocked[currentQuestion]}
                        checked={isSelected}
                        onChange={() => handleOptionChange(currentQuestion, opt)}
                      />{' '}
                      {opt}
                    </label>
                  </li>
                );
              })}
            </ul>

            {questionLocked[currentQuestion] && (
              <p className="text-danger">
                <strong>Time's up for this question. Answer locked.</strong>
              </p>
            )}
          </div>

          {/* Nav & Submit */}
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCurrentQuestion((prev) => Math.min(quiz.length - 1, prev + 1))}
              disabled={currentQuestion === quiz.length - 1}
            >
              Next
            </button>
          </div>
          <button className="btn btn-primary mt-3" onClick={handleSubmit}>
            Submit Quiz
          </button>
        </>
      )}
    </div>
  );
}

export default InteractiveQuiz;
