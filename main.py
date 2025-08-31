from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import openai, os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Serve static files (index.html, assets, etc.)
app.mount("/assets", StaticFiles(directory="chroma-bot/assets"), name="assets")

@app.get("/")
async def root():
    return FileResponse("index.html")

class ChatRequest(BaseModel):
    message: str
    character: str

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    arcs = {
        "maya": "You are Maya, a curious but cautious explorer trapped in a digital labyrinth.",
        "eli": "You are Eli, a pragmatic but haunted engineer who mistrusts the AI.",
        "stanley": "You are Stanley, the reluctant archivist who knows too much about Chroma's secrets."
    }

    system_prompt = arcs.get(req.character, "You are a mysterious AI entity.")

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": req.message}
            ]
        )
        reply = response["choices"][0]["message"]["content"]
        return JSONResponse({"reply": reply})
    except Exception as e:
        return JSONResponse({"reply": f"Error: {str(e)}"}, status_code=500)