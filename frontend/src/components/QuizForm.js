// src/components/QuizForm.js
import React, { useState } from 'react';
import axios from 'axios';

function QuizForm({ text, setQuiz }) {
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [type, setType] = useState("mcq");

  const handleGenerate = async () => {
    try {
      const response = await axios.post("http://localhost:8000/generate-quiz", {
        text,
        num_questions: numQuestions,
        difficulty,
        type,
      });

      const raw = response.data.quiz.trim();

      // Remove ``` and any markdown-like fences
      const cleaned = raw
        .replace(/^```(?:json)?/i, '')  // remove opening ```
        .replace(/```$/, '')           // remove closing ```
        .trim();

      // Attempt to extract valid JSON array
      const jsonStart = cleaned.indexOf("[");
      const jsonEnd = cleaned.lastIndexOf("]") + 1;
      const jsonSlice = cleaned.slice(jsonStart, jsonEnd);

      const parsed = JSON.parse(jsonSlice);
      setQuiz(parsed);
    } catch (err) {
      alert("❌ Error parsing quiz. Check console for details.");
      console.error("Quiz parse error:", err);
    }
  };

  return (
    <div className="mb-4">
      <h3>Generate Quiz</h3>
      <label>Number of Questions: </label>
      <input
        type="number"
        value={numQuestions}
        onChange={(e) => setNumQuestions(e.target.value)}
        className="form-control"
      />
      <br />
      <label>Difficulty: </label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="form-select"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
        <option value="mixed">Mixed</option>
      </select>
      <br />
      <label>Type: </label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="form-select"
      >
        <option value="mcq">MCQ</option>
      </select>
      <br />
      <button className="btn btn-success mt-2" onClick={handleGenerate}>
        Generate Quiz
      </button>
    </div>
  );
}

export default QuizForm;
