import os
import subprocess
import torch
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# LangChain & integrations
from langchain.agents import initialize_agent, Tool
from langchain.tools import PythonTool
from slack_sdk import WebClient
from github import Github
from trello import TrelloClient
from transformers import AutoTokenizer, AutoModelForCausalLM

# ---------------------------
# Load Environment Variables
# ---------------------------
load_dotenv()

QWEN_API_KEY = os.getenv("QWEN_API_KEY")
SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")
TRELLO_API_KEY = os.getenv("TRELLO_API_KEY")
TRELLO_API_SECRET = os.getenv("TRELLO_API_SECRET")
TRELLO_TOKEN = os.getenv("TRELLO_TOKEN")
TRELLO_TOKEN_SECRET = os.getenv("TRELLO_TOKEN_SECRET")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

# ---------------------------
# Initialize Integrations
# ---------------------------
# Hugging Face model & tokenizer
model_name = "Qwen/Qwen2.5-Coder-7B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name, token=QWEN_API_KEY)
model = AutoModelForCausalLM.from_pretrained(model_name, token=QWEN_API_KEY)

# Slack, GitHub, Trello clients
slack_client = WebClient(token=SLACK_BOT_TOKEN)
github = Github(GITHUB_TOKEN)
trello = TrelloClient(
    api_key=TRELLO_API_KEY,
    api_secret=TRELLO_API_SECRET,
    token=TRELLO_TOKEN,
    token_secret=TRELLO_TOKEN_SECRET
)

# ---------------------------
# Helper Functions
# ---------------------------
def send_slack_message(channel, message):
    slack_client.chat_postMessage(channel=channel, text=message)

def generate_code_with_qwen(prompt: str) -> str:
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, padding=True, max_length=512)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)
    with torch.no_grad():
        outputs = model.generate(inputs['input_ids'].to(device), max_length=512, num_beams=5, early_stopping=True)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def generate_front_end_code(tech_stack: str) -> str:
    prompt = f"Create a {tech_stack} front-end application using React.js. Include a modern UI with responsive design."
    return generate_code_with_qwen(prompt)

def generate_back_end_code(tech_stack: str) -> str:
    prompt = f"Create a {tech_stack} back-end application with FastAPI/Flask, including RESTful APIs and database integration."
    return generate_code_with_qwen(prompt)

def deploy_to_netlify(site_name: str, build_dir: str) -> str:
    subprocess.run(["netlify", "deploy", "--prod", "--dir", build_dir, "--site", site_name], check=True)
    return "Deployed to Netlify successfully."

def create_github_repo(repo_name: str) -> str:
    repo = github.get_user().create_repo(repo_name)
    return repo.clone_url

def push_code_to_github(repo_name: str, code_dir: str) -> str:
    subprocess.run(["git", "add", "."], cwd=code_dir, check=True)
    subprocess.run(["git", "commit", "-m", "Initial commit of generated code"], cwd=code_dir, check=True)
    subprocess.run(["git", "push", "origin", "main"], cwd=code_dir, check=True)
    return f"Code pushed to GitHub repository {repo_name}."

def automate_testing(code_dir: str, language: str) -> str:
    if language.lower() == "python":
        subprocess.run(["pytest", code_dir], check=True)
    elif language.lower() == "javascript":
        subprocess.run(["npm", "test"], cwd=code_dir, check=True)
    return f"Automated testing completed for {language}."

def fetch_trello_tasks(board_id: str):
    board = trello.get_board(board_id)
    tasks = []
    for trello_list in board.list_lists():
        for card in trello_list.list_cards():
            tasks.append(card.name)
    return tasks

def product_manager_task() -> str:
    requirements = "Develop a web application with user authentication and data visualization."
    send_slack_message("#general", f"Product Manager: Defined requirements: {requirements}")
    return requirements

def architect_task(requirements: str) -> str:
    architecture = f"Designing architecture based on requirements: {requirements}"
    send_slack_message("#general", f"Architect: {architecture}")
    return architecture

def engineer_task(architecture: str):
    front_end_code = generate_front_end_code("React.js")
    back_end_code = generate_back_end_code("FastAPI")
    send_slack_message("#general", "Engineer: Implemented front-end and back-end code.")
    return front_end_code, back_end_code

def project_manager_task(board_id: str):
    tasks = fetch_trello_tasks(board_id)
    send_slack_message("#general", f"Project Manager: Current tasks: {tasks}")
    return tasks

# ---------------------------
# LangChain Tools & Agent Setup
# ---------------------------
tools = [
    Tool(name="Generate Front-End Code", func=generate_front_end_code, description="Generate React.js front-end code."),
    Tool(name="Generate Back-End Code", func=generate_back_end_code, description="Generate back-end code using FastAPI/Flask."),
    Tool(name="Deploy to Netlify", func=deploy_to_netlify, description="Deploy the app to Netlify."),
    Tool(name="Push Code to GitHub", func=push_code_to_github, description="Push the generated code to GitHub."),
    Tool(name="Automated Testing", func=automate_testing, description="Run automated tests for the generated app."),
    Tool(name="Fetch Trello Tasks", func=fetch_trello_tasks, description="Fetch tasks from Trello boards."),
]
llm = None  # Using the Qwen model directly
agent = initialize_agent(tools, llm, agent="zero-shot-react-description", verbose=True)

def query_agent(prompt: str):
    return agent.invoke(prompt)

# ---------------------------
# FastAPI Application Setup
# ---------------------------
app = FastAPI()

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production with specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Request Models for Additional Endpoints
# ---------------------------
class GithubRequest(BaseModel):
    repo_name: str
    code_dir: str

class TestingRequest(BaseModel):
    code_dir: str
    language: str

class TrelloRequest(BaseModel):
    board_id: str

class AgentQueryRequest(BaseModel):
    prompt: str

# ---------------------------
# Endpoints
# ---------------------------
@app.post("/generate_code")
async def generate_code(prompt: str):
    code = generate_code_with_qwen(prompt)
    return {"generated_code": code}

@app.post("/generate_front_end")
async def generate_front_end(tech_stack: str):
    code = generate_front_end_code(tech_stack)
    return {"generated_front_end_code": code}

@app.post("/generate_back_end")
async def generate_back_end(tech_stack: str):
    code = generate_back_end_code(tech_stack)
    return {"generated_back_end_code": code}

@app.post("/deploy")
async def deploy_app(site_name: str, build_dir: str):
    result = deploy_to_netlify(site_name, build_dir)
    return {"message": result}

@app.post("/send_slack_message")
async def send_message(channel: str, message: str):
    send_slack_message(channel, message)
    return {"message": "Slack message sent successfully."}

@app.post("/create_github_repo")
async def create_repo(repo: GithubRequest):
    url = create_github_repo(repo.repo_name)
    return {"repo_url": url}

@app.post("/push_github")
async def push_code(repo: GithubRequest):
    result = push_code_to_github(repo.repo_name, repo.code_dir)
    return {"message": result}

@app.post("/automate_testing")
async def automate_test(req: TestingRequest):
    result = automate_testing(req.code_dir, req.language)
    return {"message": result}

@app.post("/fetch_trello_tasks")
async def get_trello_tasks(req: TrelloRequest):
    tasks = fetch_trello_tasks(req.board_id)
    return {"tasks": tasks}

@app.get("/workflow")
async def run_workflow():
    requirements = product_manager_task()
    architecture = architect_task(requirements)
    front_end_code, back_end_code = engineer_task(architecture)
    tasks = project_manager_task("your_trello_board_id")  # Replace with your board id or parameterize
    return {
        "requirements": requirements,
        "architecture": architecture,
        "front_end_code_sample": front_end_code[:200],
        "back_end_code_sample": back_end_code[:200],
        "trello_tasks": tasks,
    }

@app.post("/query_agent")
async def query(request: AgentQueryRequest):
    result = query_agent(request.prompt)
    return {"result": result}

# ---------------------------
# Run the FastAPI Server
# ---------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)