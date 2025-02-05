// Chat.js
import React, { useState } from "react";
import { generateCode } from "./api";

const Chat = () => {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setChatLog((prev) => [...prev, { sender: "user", text: input }]);
    try {
      const response = await generateCode(input);
      const generatedCode = response.data.generated_code;
      setChatLog((prev) => [...prev, { sender: "ai", text: generatedCode || "No code generated." }]);
    } catch (error) {
      setChatLog((prev) => [...prev, { sender: "ai", text: "Error generating code." }]);
    }
    setInput("");
  };

  return (
    <div style={{ padding: 20, border: "1px solid #ddd", marginBottom: 20 }}>
      <h2>Chat Assistant</h2>
      <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
        {chatLog.map((entry, index) => (
          <div key={index} style={{ textAlign: entry.sender === "ai" ? "left" : "right", marginBottom: "10px" }}>
            <strong>{entry.sender === "ai" ? "AI" : "You"}:</strong>
            <pre style={{ display: "inline-block", margin: 0, padding: "5px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
              {entry.text}
            </pre>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Enter your prompt..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "70%", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px", marginLeft: 5 }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;