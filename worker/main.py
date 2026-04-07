from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pipeline import run_pipeline

app = FastAPI(
    title="GraphRAG Audit — Worker",
    version="0.1.0",
    description=(
        "Ingestion : clone GitHub + pipeline d’analyse. "
        "Exposé en local pour le BFF Next.js ; en production, ne pas publier sans couche d’auth réseau."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IngestRequest(BaseModel):
    """Corps attendu depuis le serveur Next (pas depuis le navigateur brut : le token y est injecté)."""

    repo_name: str = Field(..., description="Nom complet GitHub `owner/repo` (ex. org/repository).")
    branch: str = Field(..., description="Branche à cloner.")
    github_access_token: str = Field(
        ...,
        description="Jeton OAuth ; transmis par le BFF pour éviter de l’exposer au client.",
    )


# Mémoire volatile : suffisant pour le dev ; la persistance multi-instance est un autre sujet produit.
job_status: dict[str, dict] = {}


@app.post("/ingest", tags=["Ingestion"])
async def ingest_repo(data: IngestRequest, background_tasks: BackgroundTasks):
    """Démarre (ou reprend la connexion à) un clone + pipeline pour ce dépôt/branche."""
    safe_branch = data.branch.replace('/', '_')
    job_id = f"{data.repo_name.replace('/', '_')}_{safe_branch}"

    # Évite deux clones concurrents pour la même clé (même dépôt + branche) : même coût disque / GitHub.
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

    # BackgroundTasks : répondre vite au client tout en laissant le clone/AST tourner hors requête HTTP.
    background_tasks.add_task(run_pipeline, auth_url, data.branch, data.repo_name, job_id, job_status)

    return {
        "status": "accepted", 
        "job_id": job_id, 
        "message": f"Clonage de {data.repo_name} démarré."
    }

@app.get("/status/{job_id}", tags=["Ingestion"])
async def get_status(job_id: str):
    """État courant du job pour le polling UI (souvent via le proxy Next)."""
    job = job_status.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job introuvable.")
    return job

@app.get("/hello", tags=["Health"])
async def hello_world():
    """Vérification légère du service ; hors parcours métier ingestion."""
    return {"message": "Hello World"}