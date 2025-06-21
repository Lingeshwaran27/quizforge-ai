import React, { useState } from 'react';
import './FlashcardMode.css'; // For flipping animation

function FlashcardMode({ flashcards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const nextCard = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="flashcard-container">
      <h3>Flashcard Mode</h3>
      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
        <div className="front">{flashcards[index].term}</div>
        <div className="back">{flashcards[index].definition}</div>
      </div>
      <div className="navigation">
        <button onClick={prevCard}>← Prev</button>
        <span>{index + 1} / {flashcards.length}</span>
        <button onClick={nextCard}>Next →</button>
      </div>
    </div>
  );
}

export default FlashcardMode;
