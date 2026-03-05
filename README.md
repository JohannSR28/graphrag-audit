# GraphRAG-Audit (AstroRAG) 🚀

**Analyseur de Dette Technique Architecturale à Haute Fidélité**

Plateforme universelle d'intelligence logicielle utilisant un moteur GraphRAG hybride. Conçue pour démocratiser l'analyse de la dette technique, elle permet à tout développeur — du junior au lead architext — de visualiser la structure complexe de son code via une ingestion asynchrone sécurisée et une extraction déterministe d'AST.

## 🏗️ Architecture du Système

Le projet repose sur 5 piliers architecturaux garantissant une scalabilité de niveau production :

1. **API Gateway Asynchrone (FastAPI)** : Gestion des requêtes via la norme ASGI, validation stricte avec Pydantic et découplage total du plan d'exécution.
2. **Plan d'Exécution Distribué (Celery & Redis)** : Orchestration des tâches lourdes (clonage, parsing) avec gestion de la contre-pression (*backpressure*) et politiques d'idempotence.
3. **Analyseur Déterministe (Tree-sitter)** : Extraction haute performance de l'AST pour calculer la complexité cognitive et identifier les goulots d'étranglement structurels.
4. **Moteur GraphRAG Hybride (Neo4j & pgvector)** : 
   - **Topologie** : Relations de dépendances strictes dans Neo4j (`CALLS`, `INHERITS`).
   - **Sémantique** : Embeddings vectoriels dans PostgreSQL pour la recherche floue.
5. **Infrastructure & Conformité** : Isolation totale via Docker et design orienté vers la **Loi 25 (Québec)** pour la protection des données.

## ✨ Le "Wow Factor" : DKB vs LLM-KB

La plupart des implémentations GraphRAG délèguent l'extraction de graphes aux LLM, ce qui est coûteux et imprécis. 
**AstroRAG** utilise une approche hybride :
- **Extraction déterministe** via Tree-sitter (Couverture de 100% des fichiers, coût nul).
- **Synthèse intelligente** via LLM uniquement pour la couche finale de réponse utilisateur.

## 🛠️ Stack Technique

- **Backend** : Python 3.11+, FastAPI, Celery
- **Frontend** : Next.js 14 (App Router), Tailwind CSS, React Flow (Visualisation)
- **Bases de données** : Neo4j (Graphe), PostgreSQL + pgvector (Vecteurs), Redis (Broker)
- **Infrastructure** : Docker, GitHub Actions (CI/CD)

## 🚀 Installation Rapide

1. **Cloner le projet**
   ```bash
   git clone [https://github.com/JohannSR28/graphrag-audit.git](https://github.com/JohannSR28/graphrag-audit.git)
   cd graphrag-audit
