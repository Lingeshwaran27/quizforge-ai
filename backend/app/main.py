from fastapi import FastAPI
from fastapi import File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import io
import PyPDF2
import docx
from pydantic import BaseModel
from openai import OpenAI
import httpx

load_dotenv()

app = FastAPI()

# Enable CORS (allow frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    contents = await file.read()
    text = ""

    if file.filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(io.BytesIO(contents))
        for page in reader.pages:
            text += page.extract_text() or ""
    elif file.filename.endswith(".docx"):
        document = docx.Document(io.BytesIO(contents))
        for para in document.paragraphs:
            text += para.text + "\n"
    else:
        return JSONResponse(content={"error": "Unsupported file type"}, status_code=400)

    return {"filename": file.filename, "text_snippet": text[:300], "full_text": text}

# Read API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class QuizRequest(BaseModel):
    text: str
    num_questions: int = 5
    type: str = "mcq"
    difficulty: str = "mixed"

@app.post("/generate-quiz")
async def generate_quiz(data: QuizRequest):
    prompt = f"""
    Generate {data.num_questions} {data.type.upper()} quiz questions from the content below.
    Difficulty: {data.difficulty}.
    Return output as a JSON list with 'question', 'options', 'answer'.

    Content:
    {data.text}
    """

    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}"
                },
                json={
                    "model": "llama3-70b-8192",
                    "messages": [
                        {"role": "system", "content": "You are a helpful quiz generator."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7
                }
            )
            res.raise_for_status()
            result = res.json()["choices"][0]["message"]["content"]
            return {"quiz": result}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})