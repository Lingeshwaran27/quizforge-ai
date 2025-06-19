# QuizForge AI Backend

## Setup
```bash
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt

### POST /upload

Upload a document (PDF/DOCX) and get extracted raw text.

**Request:**
- `multipart/form-data` with `file` field

**Response:**
```json
{
  "filename": "example.pdf",
  "text_snippet": "First 300 characters...",
  "full_text": "Entire extracted text"
}
