document.addEventListener("DOMContentLoaded", () => {
    const botIcon = document.getElementById("bot-icon");
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("user-input");
    const chatLog = document.getElementById("chat-log");
  
    // Toggle chatbox on bot click
    botIcon.addEventListener("click", () => {
      chatbox.classList.toggle("hidden");
      if (!chatbox.classList.contains("hidden")) {
        userInput.focus();
      }
    });
  
    // Handle input
    userInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter" && userInput.value.trim() !== "") {
        const message = userInput.value.trim();
        addMessage("You", message);
        userInput.value = "";
  
        // Load knowledge.json for responses
        const response = await getBotResponse(message);
        addMessage("Chroma Bot", response);
      }
    });
  
    function addMessage(sender, text) {
      const msg = document.createElement("div");
      msg.innerHTML = `<b>${sender}:</b> ${text}`;
      chatLog.appendChild(msg);
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  
    async function getBotResponse(userMessage) {
      try {
        const res = await fetch("knowledge.json");
        const data = await res.json();
  
        // Find response
        for (const item of data.knowledge) {
          if (userMessage.toLowerCase().includes(item.input.toLowerCase())) {
            return item.output;
          }
        }
        return "Hmm, I’m still learning 🌈 — can you rephrase?";
      } catch (err) {
        console.error("Error loading knowledge.json:", err);
        return "⚠️ Oops, I can’t access my knowledge base right now.";
      }
    }
  });