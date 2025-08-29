import { useState } from "react";

export default function Chatbot({ mode }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, mode }),
    });
    const data = await res.json();
    setMessages([...messages, { from: "user", text: input }, { from: "bot", text: data.reply }]);
    setInput("");
  }

  return (
    <div className="chatbot-ui bg-black text-green-400 p-4 rounded-xl shadow-lg">
      <div className="messages h-64 overflow-y-auto border border-green-400 p-2 mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.from === "user" ? "text-right" : "text-left"}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-3/4 p-2 text-black"
      />
      <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-green-600 rounded">Send</button>
    </div>
  );
}