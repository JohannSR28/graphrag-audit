from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pipeline import run_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IngestRequest(BaseModel):
    repo_name: str
    branch: str
    github_access_token: str

# Notre base de données en mémoire pour suivre l'avancement
job_status: dict[str, dict] = {}

@app.post("/ingest")
async def ingest_repo(data: IngestRequest, background_tasks: BackgroundTasks):
    safe_branch = data.branch.replace('/', '_')
    job_id = f"{data.repo_name.replace('/', '_')}_{safe_branch}"

    # Verrou intelligent
    if job_status.get(job_id, {}).get("status") == "running":
        return {
            "status": "already_running", 
            "job_id": job_id, 
            "message": f"Le traitement de {data.repo_name} est déjà en cours, reconnexion..."
        }

    auth_url = f"https://{data.github_access_token}@github.com/{data.repo_name}.git"

    job_status[job_id] = {
        "status": "running", 
        "repo": data.repo_name, 
        "branch": data.branch,
        "current_step": "init",
        "message": "Initialisation du pipeline..."
    }

    # On passe job_status au pipeline pour qu'il puisse le mettre à jour !
    background_tasks.add_task(run_pipeline, auth_url, data.branch, data.repo_name, job_id, job_status)

    return {
        "status": "accepted", 
        "job_id": job_id, 
        "message": f"Clonage de {data.repo_name} démarré."
    }

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    job = job_status.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job introuvable.")
    return job

@app.get("/hello")
async def hello_world():
    return {"message": "Hello World"}