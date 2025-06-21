// src/App.js
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import QuizForm from './components/QuizForm';
import InteractiveQuiz from './components/InteractiveQuiz';
import FlashcardMode from './components/FlashcardMode';
import DownloadPDFButton from './components/DownloadPDFButton';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [quiz, setQuiz] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [mode, setMode] = useState('default'); // "quiz", "flashcard", "default"

  const handleGenerateFlashcards = async () => {
    try {
      const res = await axios.post('http://localhost:8000/generate-flashcards', {
        text: extractedText,
        num_questions: 5,
        difficulty: 'easy',
        type: 'mcq'
      });

      const raw = res.data.flashcards;
      const jsonStart = raw.indexOf('[');
      const jsonEnd = raw.lastIndexOf(']') + 1;
      const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd));
      setFlashcards(parsed);
      setMode('flashcard');
    } catch (err) {
      alert('Flashcard generation failed');
      console.error(err);
    }
  };

  const handleQuizGenerated = (quizData) => {
    setQuiz(quizData);
    setMode('quiz');
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">QuizForge AI</h1>

      <FileUpload setExtractedText={setExtractedText} />

      {extractedText && (
        <div className="mt-4">
          <QuizForm text={extractedText} setQuiz={handleQuizGenerated} />
          <button
            className="btn btn-outline-info mt-2"
            onClick={handleGenerateFlashcards}
          >
            Generate Flashcards
          </button>
        </div>
      )}

      {mode === 'quiz' && quiz && (
        <>
          {/* Visible Content for PDF */}
          <div id="quiz-pdf-content" className="p-4 bg-white text-dark">
            <h3 className="mb-4">Generated Quiz</h3>
            {quiz.map((item, index) => (
              <div key={index} className="mb-3">
                <strong>Q{index + 1}: {item.question}</strong>
                <ul>
                  {item.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
                <p>
                  <strong>Answer:</strong> {item.answer}<br />
                  <strong>Explanation:</strong> {item.explanation}
                </p>
                <hr />
              </div>
            ))}
          </div>

          {/* Download Button */}
          <DownloadPDFButton />

          {/* Quiz Interaction */}
          <InteractiveQuiz quiz={quiz} />
        </>
      )}

      {mode === 'flashcard' && flashcards.length > 0 && (
        <FlashcardMode flashcards={flashcards} />
      )}
    </div>
  );
}

export default App;
