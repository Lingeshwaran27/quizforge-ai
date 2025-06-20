import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ setExtractedText }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post('http://localhost:8000/upload', formData);
    setExtractedText(response.data.full_text);
  };

  return (
    <div className="mb-4">
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button className="btn btn-primary mt-2" onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUpload;