import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessage = { sender: "User", text: input };
    setMessages([...messages, newMessage]);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_API_KEY`, // Replace with your GPT API key
          },
        }
      );

      const botReply = response.data.choices[0].message.content;
      setMessages([...messages, newMessage, { sender: "Bot", text: botReply }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...messages, newMessage, { sender: "Bot", text: "Error fetching response." }]);
    }

    setInput("");
  };

  return (
    <div className="chatbot-container">
      <h1>Interactive Chatbot</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender.toLowerCase()}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default App;
