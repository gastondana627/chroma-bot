// chroma-bot/script.js
import { getAIResponse } from "./openai.js";

document.addEventListener("DOMContentLoaded", async () => {
  const chatBox = document.getElementById("chat-box");
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("userInput");
  const messages = document.getElementById("messages");
  const video = document.getElementById("chroma-video");
  const videoContainer = document.getElementById("video-container");

  let characterStates = null;
  let currentState = "normal";
  let wrongCount = 0;

  // Load character states
  try {
    const res = await fetch("./chroma-bot/assets/config/character.json");
    characterStates = await res.json();
  } catch (err) {
    console.error("Could not load character.json:", err);
  }

  // When clicking video → stop & show chat
  videoContainer.addEventListener("click", () => {
    video.loop = false;
    video.pause();
    videoContainer.style.display = "none";
    chatBox.style.display = "flex";
  });

  // Add message helper
  function addMessage(sender, text) {
    const msg = document.createElement("p");
    msg.innerHTML = `<b>${sender}:</b> ${text}`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  // Handle chat form submit
  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = userInput.value.trim();
      if (!text) return;

      addMessage("You", text);
      userInput.value = "";

      const reply = await getBotResponse(text);
      addMessage("Bot", reply);
    });
  }

  // Bot response logic
  async function getBotResponse(userMessage) {
    // 1. Knowledge base lookup
    try {
      const res = await fetch("knowledge.json");
      const data = await res.json();
      for (const item of data.knowledge) {
        if (userMessage.toLowerCase().includes(item.input.toLowerCase())) {
          return item.output;
        }
      }

      // Track wrong answers → state transitions
      wrongCount++;
      if (characterStates) {
        if (wrongCount >= characterStates.thresholds.critical) {
          currentState = "broken";
        } else if (wrongCount >= characterStates.thresholds.wrongAnswers) {
          currentState = "tired";
        }
      }
    } catch (err) {
      console.error("Error loading knowledge.json:", err);
    }

    // 2. AI fallback (OpenAI API)
    const aiReply = await getAIResponse(userMessage);
    return aiReply;
  }

  // Fireworks animation
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Firework {
    constructor(x, y, color, velocity) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.velocity = velocity;
      this.alpha = 1;
      this.radius = 2;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    update() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= 0.01;
      this.draw();
    }
  }

  let fireworks = [];
  function createFirework(x, y) {
    const colors = ["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff"];
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      fireworks.push(
        new Firework(x, y, colors[Math.floor(Math.random() * colors.length)], {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        })
      );
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((f, i) => {
      f.update();
      if (f.alpha <= 0) fireworks.splice(i, 1);
    });
  }

  window.addEventListener("click", (e) => {
    createFirework(e.clientX, e.clientY);
  });

  animate();
});