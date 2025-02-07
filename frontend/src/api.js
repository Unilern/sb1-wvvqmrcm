// api.js
import axios from "axios";

// Use an environment variable. When deployed, set REACT_APP_BACKEND_URL
// in Vercel's dashboard to your public backend URL.
// For local testing, it falls back to http://127.0.0.1:8000.
const API_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
});

export const generateCode = (prompt) => api.post("/generate_code", { prompt });
export const generateFrontEndCode = (tech_stack) => api.post("/generate_front_end", { tech_stack });
export const generateBackEndCode = (tech_stack) => api.post("/generate_back_end", { tech_stack });
export const deployApp = (site_name, build_dir) => api.post("/deploy", { site_name, build_dir });
export const sendSlackMessage = (channel, message) => api.post("/send_slack_message", { channel, message });
export const createGithubRepo = (repo_name, code_dir) => api.post("/create_github_repo", { repo_name, code_dir });
export const pushGithubCode = (repo_name, code_dir) => api.post("/push_github", { repo_name, code_dir });
export const automateTesting = (code_dir, language) => api.post("/automate_testing", { code_dir, language });
export const fetchTrelloTasks = (board_id) => api.post("/fetch_trello_tasks", { board_id });
export const runWorkflow = () => api.get("/workflow");
