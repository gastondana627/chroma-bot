document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const messages = document.getElementById("messages");
  
    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
  
      // Display user message
      const userMsg = document.createElement("div");
      userMsg.className = "message user";
      userMsg.textContent = text;
      messages.appendChild(userMsg);
  
      input.value = "";
  
      // Fetch AI response
      const aiResponse = await getAIResponse(text);
  
      const aiMsg = document.createElement("div");
      aiMsg.className = "message ai";
      aiMsg.textContent = aiResponse;
      messages.appendChild(aiMsg);
  
      messages.scrollTop = messages.scrollHeight;
    }
  
    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  });