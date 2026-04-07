# Endpoints Next.js (`/api`)

Toutes les URLs ci-dessous sont relatives à la base du site (ex. en local : `http://localhost:3000`).

**Auth** : session NextAuth (cookie). Pas besoin d’en-tête `Authorization` depuis le front.

**Rôle** : Next reçoit les appels du navigateur, vérifie la session, appelle le worker avec `WORKER_URL` et y ajoute le jeton GitHub pour `POST /api/ingest`. Le navigateur n’envoie pas ce token dans le JSON.

---

## 1. Démarrer une ingestion

| | |
|---|---|
| **Méthode** | `POST` |
| **Chemin** | `/api/ingest` |
| **Content-Type** | `application/json` |

### Corps (JSON)

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `repoName` | string | oui | Dépôt GitHub `owner/repo` (ex. `facebook/react`). |
| `branch` | string | oui | Branche à cloner / analyser (ex. `main`). |

### Exemple de corps

```json
{
  "repoName": "org/mon-repo",
  "branch": "main"
}
```

### Exemple avec curl (session : à adapter selon ton cookie)

```http
POST /api/ingest HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cookie: next-auth.session-token=...

{"repoName":"org/mon-repo","branch":"main"}
```

### Réponses

| Code | Signification |
|------|----------------|
| **200** | Le worker a répondu (souvent `status`, `job_id`, `message` — détail selon le worker). |
| **400** | Corps invalide : `repoName` ou `branch` manquant. |
| **401** | Non connecté (pas de session valide). |
| **502** (ou autre 5xx) | Worker injoignable ou erreur renvoyée par le worker (Next fait relais). |

Réponse d’erreur typique :

```json
{ "error": "Non authentifié." }
```

---

## 2. Statut d’un job (polling)

| | |
|---|---|
| **Méthode** | `GET` |
| **Chemin** | `/api/ingest/status/{jobId}` |

### Paramètre d’URL

| Paramètre | Description |
|-----------|-------------|
| `jobId` | Id retourné par le worker (souvent du type `owner_repo_branch`). |

### Exemple d’URL complète

```
GET http://localhost:3000/api/ingest/status/JohannSR28_graphrag-audit_main
```

### Réponses

| Code | Signification |
|------|----------------|
| **200** | Objet JSON de statut (`status`, `message`, `current_step`, etc. selon l’étape). |
| **401** | Non connecté. |
| **404** | Job inconnu (id faux ou worker redémarré — la mémoire des jobs est volatile en dev). |

---

## 3. Erreurs JSON

Souvent :

```json
{ "error": "..." }
```

Si l’erreur vient du worker, le corps peut contenir un champ `detail` (proxifié par Next).

---

## Fichier machine (Postman, scripts)

Même contrat au format OpenAPI : [`openapi-next-bff.yaml`](openapi-next-bff.yaml).

Doc du worker (clone, schémas bruts) quand il tourne : [http://localhost:8000/docs](http://localhost:8000/docs).
