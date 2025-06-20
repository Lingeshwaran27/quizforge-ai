// src/App.js
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import QuizForm from './components/QuizForm';
import QuizOutput from './components/QuizOutput';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [quiz, setQuiz] = useState('');

  return (
    <div className="container mt-5">
      <h1>QuizForge AI</h1>
      <FileUpload setExtractedText={setExtractedText} />
      {extractedText && (
        <QuizForm text={extractedText} setQuiz={setQuiz} />
      )}
      {quiz && (
        <QuizOutput quiz={quiz} />
      )}
    </div>
  );
}

export default App;
