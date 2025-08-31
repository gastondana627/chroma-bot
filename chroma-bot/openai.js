// chroma-bot/openai.js

// Calls backend API route (server.js -> /api/chat)
// Keeps key hidden inside server (via .env)
export async function getAIResponse(userMessage) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMessage }]
        }),
      });
  
      const data = await response.json();
  
      if (data.error) {
        console.error("OpenAI error:", data.error);
        return "⚠️ AI error. Try again later.";
      }
  
      return data.choices?.[0]?.message?.content || "⚠️ No response from AI.";
    } catch (error) {
      console.error("Request failed:", error);
      return "⚠️ Error reaching AI.";
    }
  }