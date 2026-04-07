# GraphRAG Audit

Connexion GitHub, choix d’un dépôt et d’une branche, analyse via un **service Python** (FastAPI), interface **Next.js**.

## Fonctionnement

1. Le navigateur parle à **Next.js** (pages + `/api/...`).
2. Next vérifie que l’utilisateur est connecté (NextAuth).
3. Next appelle le **worker** avec l’URL `WORKER_URL` (côté serveur uniquement) et y met le **jeton GitHub** ; le navigateur ne l’envoie pas lui-même dans le JSON d’ingestion.
4. Le worker clone le dépôt et fait l’analyse.

## Prérequis

- Node.js (voir `graph-rag-audit/package.json`)
- Python 3.11+
- App OAuth GitHub + variables dans `.env.local` (voir `.env.example`)

## Lancer le projet

**Worker (terminal 1)**

```bash
cd worker
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Doc API du worker : [http://localhost:8000/docs](http://localhost:8000/docs)

**Next (terminal 2)**

```bash
cd graph-rag-audit
copy .env.example .env.local
npm install
npm run dev
```

Site : [http://localhost:3000](http://localhost:3000)

## Variables utiles

| Fichier | Variable | Rôle |
|---------|----------|------|
| `graph-rag-audit/.env.local` | `WORKER_URL` | Adresse du worker (utilisée par le serveur Next, pas exposée au bundle client comme URL de polling direct) |
| `graph-rag-audit/.env.local` | `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET` | Connexion GitHub |

Détail : `graph-rag-audit/.env.example`.

## API Next (ce que le front appelle)

- **Endpoints détaillés** (méthodes, corps, codes, exemples) : [`docs/API-NEXT-BFF.md`](docs/API-NEXT-BFF.md)
- Même chose pour outils : [`docs/openapi-next-bff.yaml`](docs/openapi-next-bff.yaml)
- API du worker : [http://localhost:8000/docs](http://localhost:8000/docs)

## Dossiers

| Dossier | Contenu |
|---------|---------|
| `graph-rag-audit/` | App Next |
| `worker/` | FastAPI + pipeline |
| `docs/` | Doc API Next + YAML |

## Si ça bloque

| Problème | À vérifier |
|----------|------------|
| 401 sur l’ingestion | Connecté ? `NEXTAUTH_SECRET` défini ? |
| Next ne joint pas le worker | `WORKER_URL` dans `.env.local`, worker démarré |
| CORS | `worker/main.py` — `allow_origins` (surtout hors localhost) |
