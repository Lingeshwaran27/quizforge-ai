// src/components/DownloadPDFButton.js
import React from 'react';
import html2pdf from 'html2pdf.js';

function DownloadPDFButton() {
  const handleDownload = () => {
    const element = document.getElementById('quiz-pdf-content');

    if (!element) {
      alert('PDF content not found');
      return;
    }

    const opt = {
      margin:       0.5,
      filename:     'quiz-summary.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <button className="btn btn-outline-primary mt-2" onClick={handleDownload}>
      📄 Download Quiz as PDF
    </button>
  );
}

export default DownloadPDFButton;
