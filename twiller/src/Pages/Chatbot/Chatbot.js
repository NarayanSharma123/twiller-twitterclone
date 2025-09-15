import React, { useState } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! 👋 Ask me anything and I'll fetch tweets for you.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: input }]);

    try {
      const res = await fetch(`http://localhost:5000/chatbot?q=${input}`);
      const data = await res.json();

      if (data.success) {
        const tweetsText =
          data.tweets.length > 0
            ? data.tweets.map((t) => `📝 ${t.text}`).join("\n\n")
            : "No tweets found.";
        setMessages((prev) => [...prev, { from: "bot", text: tweetsText }]);
      } else {
        const fallbackText = data.fallback
          .map((f) => `📝 ${f.text}`)
          .join("\n\n");
        setMessages((prev) => [...prev, { from: "bot", text: fallbackText }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error fetching tweets. Try again later." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="chatbot-container">
      {/* Chat window */}
      <div className="chat-window">
        {/* Header */}
        <div className="chat-header">
          <SmartToyIcon />
          <h2>Chatbot</h2>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.from}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input">
          <input
            type="text"
            value={input}
            placeholder="Ask about cricket, physics, tech..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
