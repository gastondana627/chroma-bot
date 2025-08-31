// chroma-bot/server.js
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Load characters dynamically
function loadCharacterConfig(character) {
  try {
    const data = fs.readFileSync(`./chroma-bot/characters/${character}.json`, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, character } = req.body;

    // Default fallback
    let systemPrompt = "You are Chroma Bot, a helpful AI assistant.";
    const characterConfig = loadCharacterConfig(character);

    if (characterConfig) {
      systemPrompt = `${characterConfig.name} is a ${characterConfig.role}. Style: ${characterConfig.style}. 
      Lore: ${characterConfig.lore.join(" ")} 
      If the user makes unsafe decisions, trigger failure mode: ${characterConfig.failure}`;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "..." });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ reply: "⚠️ System glitch. Try again." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));