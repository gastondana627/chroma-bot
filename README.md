📖 Project README (Updated)

🚀 Overview

This project is a Chroma Bot AI Chat Experience with:
	•	FastAPI backend (AI responses via OpenAI).
	•	Node/Express (server.js) serving static files for local testing & Vercel deployment.
	•	Frontend animations (Chroma logo animation + fireworks).
	•	Story arcs with potential “scam” failure sequences (logo breaking).

Currently tested locally on MacOS + Python 3.12 + Node.js.

---

## Workflow

- Keep this repo **standalone** for now (UI/UX experiments).  
- Once the Chroma Bot sequences are stable → merge into main game repo under a `/modules/chroma-bot/` directory.  
- This keeps development modular and avoids blocking the larger game flow.  

---

## Localhost → Production Notes

- Localhost will be simple (static file server, e.g. `npm run dev` or `python3 -m http.server`).  
- Production on **Vercel** will auto-deploy this repo once connected.  
- When integrated into main repo → Vercel can be configured with separate build outputs for `game/` and `chroma-bot/`.

---

## Next Steps

- Add the 5 **Chroma breaking images** under `/assets/images/`.  
- Add glitch/horror audio under `/assets/audio/`.  
- Scaffold a simple A-Frame scene in `src/index.html`.  
- Test UI cracking logic in isolation before merging with main game.


## Workflow structure
Data_Bleed_VSC/
│── chroma-bot/          # Frontend (static files, served by Node.js or Vercel)
│   ├── assets/          # Images, video, configs
│   ├── script.js        # Main frontend logic (chat + fireworks + state logic)
│   ├── chatbot.html     # Chatbot UI
│   └── server.js        # Node server for local static hosting
│
│── main.py              # FastAPI backend for AI responses
│── .env                 # Environment variables (API keys)
│── venv/                # Python virtual environment


🔑 Environment Variables

Create a file named .env inside chroma-bot/ or project root:
OPENAI_API_KEY=sk-xxxxxx

🖥️ Local Development

1. Setup Python (FastAPI backend)
cd ~/Downloads/Data_Bleed_VSC
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

Run FastAPI:
uvicorn main:app --reload --port 3001

You should see:
✅ OPENAI_API_KEY loaded successfully.
Uvicorn running on http://127.0.0.1:3001


2. Setup Node (Frontend static files)

cd ~/Downloads/Data_Bleed_VSC/chroma-bot
npm install
node server.js

You should see:
✅ Server running at http://localhost:3001

3. Open in Browser

Go to:
👉 http://localhost:3001/chatbot.html


✨ Features

✅ Already Working
	•	Frontend chat box (script.js) with AI backend fallback.
	•	Fireworks animation on click.
	•	State transitions (normal → tired → broken).
	•	FastAPI successfully connected to OpenAI API.
