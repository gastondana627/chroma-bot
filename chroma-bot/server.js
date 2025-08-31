// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors()); // Allows requests from your frontend
app.use(express.json()); // Parses incoming JSON requests

// This line serves all files from the parent directory (Data_Bleed_VSC).
// This is how your index.html, video, and assets will be accessible.
app.use(express.static(path.join(__dirname, '..')));

// --- OpenAI Client ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Dynamic Character Loader ---
function loadCharacterConfig(character) {
  const filePath = path.join(__dirname, 'characters', `${character}.json`);
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Could not load character config for: ${character}`, error);
    return null;
  }
}

// --- API Endpoint ---
app.post("/api/chat", async (req, res) => {
  const { message, character } = req.body;
  
  if (!message || !character) {
    return res.status(400).json({ error: "Message and character are required." });
  }

  let systemPrompt = "You are Chroma Bot, a helpful AI assistant.";
  const characterConfig = loadCharacterConfig(character);

  if (characterConfig) {
    systemPrompt = `${characterConfig.name} is a ${characterConfig.role}. Style: ${characterConfig.style}. Lore: ${characterConfig.lore.join(" ")}. If the user makes unsafe decisions, trigger failure mode: ${characterConfig.failure}`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });
    
    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("OpenAI API Error:", err);
    res.status(500).json({ reply: "⚠️ System glitch. My connection to the AI brain is down." });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`Serving static files from the root project directory.`);
});