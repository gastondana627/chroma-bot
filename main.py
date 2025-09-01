# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("❌ OPENAI_API_KEY not found! Check your .env or export it before running FastAPI.")
else:
    print("✅ OPENAI_API_KEY loaded successfully.")

client = OpenAI(api_key=api_key)

# FastAPI app setup
app = FastAPI()

# Allow frontend (Node/Vercel/localhost) to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # during dev, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class ChatRequest(BaseModel):
    message: str
    character: str

@app.post("/api/chat")
async def chat(req: ChatRequest):
    character = req.character
    user_message = req.message
    print(f"[{character}] User: {user_message}")

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # efficient & cheap for dev
            messages=[
                {"role": "system", "content": f"You are {character}. Stay in character and respond only with their style and lore."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=200,
            temperature=0.8
        )
        reply = response.choices[0].message.content
        print(f"[{character}] Bot: {reply}")
        return {"reply": reply}
    except Exception as e:
        print("❌ Error in /api/chat:", e)
        return {"reply": "⚠️ Backend error, please try again later."}