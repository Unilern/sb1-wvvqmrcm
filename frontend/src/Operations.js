// Operations.js
import React, { useState } from "react";
import { createGithubRepo, pushGithubCode, automateTesting, fetchTrelloTasks, runWorkflow } from "./api";

const Operations = () => {
  const [repoName, setRepoName] = useState("");
  const [codeDir, setCodeDir] = useState("");
  const [boardId, setBoardId] = useState("");
  const [workflowResult, setWorkflowResult] = useState(null);

  const handleCreateRepo = async () => {
    try {
      const response = await createGithubRepo(repoName, codeDir);
      alert("Repository created: " + response.data.repo_url);
    } catch (error) {
      alert("Error creating repository");
    }
  };

  const handlePushRepo = async () => {
    try {
      const response = await pushGithubCode(repoName, codeDir);
      alert(response.data.message);
    } catch (error) {
      alert("Error pushing code");
    }
  };

  const handleTesting = async () => {
    try {
      const response = await automateTesting(codeDir, "python"); // Change language as needed
      alert(response.data.message);
    } catch (error) {
      alert("Error running tests");
    }
  };

  const handleFetchTrello = async () => {
    try {
      const response = await fetchTrelloTasks(boardId);
      alert("Trello Tasks: " + response.data.tasks.join(", "));
    } catch (error) {
      alert("Error fetching Trello tasks");
    }
  };

  const handleWorkflow = async () => {
    try {
      const response = await runWorkflow();
      setWorkflowResult(response.data);
    } catch (error) {
      alert("Error running workflow");
    }
  };

  return (
    <div style={{ padding: 20, border: "1px solid #ddd", marginBottom: 20 }}>
      <h2>Advanced Operations</h2>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="GitHub Repo Name"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          style={{ padding: "8px", marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Code Directory"
          value={codeDir}
          onChange={(e) => setCodeDir(e.target.value)}
          style={{ padding: "8px", marginRight: 10 }}
        />
        <button onClick={handleCreateRepo} style={{ padding: "8px 16px", marginRight: 5 }}>
          Create Repo
        </button>
        <button onClick={handlePushRepo} style={{ padding: "8px 16px", marginRight: 5 }}>
          Push Code
        </button>
      </div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleTesting} style={{ padding: "8px 16px", marginRight: 5 }}>
          Run Automated Testing
        </button>
      </div>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Trello Board ID"
          value={boardId}
          onChange={(e) => setBoardId(e.target.value)}
          style={{ padding: "8px", marginRight: 10 }}
        />
        <button onClick={handleFetchTrello} style={{ padding: "8px 16px", marginRight: 5 }}>
          Fetch Trello Tasks
        </button>
      </div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleWorkflow} style={{ padding: "8px 16px" }}>
          Run Full Workflow
        </button>
      </div>
      {workflowResult && (
        <div style={{ marginTop: 20 }}>
          <h3>Workflow Results:</h3>
          <pre>{JSON.stringify(workflowResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Operations;