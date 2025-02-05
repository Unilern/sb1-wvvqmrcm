// IDE.js
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { generateFrontEndCode, generateBackEndCode } from "./api";

const IDE = () => {
  const [code, setCode] = useState("// Your code will appear here...");
  const [techStack, setTechStack] = useState("React.js");

  const handleGenerateFrontEnd = async () => {
    try {
      const response = await generateFrontEndCode(techStack);
      setCode(response.data.generated_front_end_code);
    } catch (error) {
      setCode("Error generating front-end code.");
    }
  };

  const handleGenerateBackEnd = async () => {
    try {
      const response = await generateBackEndCode(techStack);
      setCode(response.data.generated_back_end_code);
    } catch (error) {
      setCode("Error generating back-end code.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Integrated IDE</h2>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Tech stack (e.g., React.js, FastAPI)"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          style={{ padding: "8px", width: "60%" }}
        />
        <button onClick={handleGenerateFrontEnd} style={{ padding: "8px 16px", marginLeft: 5 }}>
          Generate Front-End Code
        </button>
        <button onClick={handleGenerateBackEnd} style={{ padding: "8px 16px", marginLeft: 5 }}>
          Generate Back-End Code
        </button>
      </div>
      <Editor height="400px" language="javascript" value={code} onChange={(value) => setCode(value)} theme="vs-dark" />
    </div>
  );
};

export default IDE;