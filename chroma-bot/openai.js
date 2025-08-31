// chroma-bot/openai.js
// Calls backend API route (server.js -> /api/chat)

export async function getAIResponse(userMessage, character = "eli") {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, character })
      });
  
      const data = await response.json();
  
      if (data.error) {
        console.error("OpenAI error:", data.error);
        return "⚠️ AI error. Try again later.";
      }
  
      return data.reply || "⚠️ No response from AI.";
    } catch (error) {
      console.error("Request failed:", error);
      return "⚠️ Error reaching AI.";
    }
  }