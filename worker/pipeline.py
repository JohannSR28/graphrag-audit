import time
from steps.clone_repo import execute_clone
from steps.analyze_ast import execute_analysis

def run_pipeline(url: str, branch: str, repo_name: str, job_id: str, job_status: dict):
    target_path = f"./temp_analysis/{job_id}"

    try:
        # ==========================================
        # ÉTAPE 1 : CLONAGE
        # ==========================================
        job_status[job_id]["current_step"] = "cloning"
        job_status[job_id]["message"] = "Téléchargement des fichiers source..."
        
        clone_result = execute_clone(url, branch, target_path)
        
        if not clone_result["success"]:
            # Si le clonage rate, on arrête tout
            print(f"❌ ERREUR CLONAGE : {clone_result['error']}")
            job_status[job_id]["status"] = "error"
            job_status[job_id]["error"] = clone_result["error"]
            return

        # ==========================================
        # ÉTAPE 2 : PARSING AST
        # ==========================================
        job_status[job_id]["current_step"] = "parsing_ast"
        job_status[job_id]["message"] = "Analyse de la syntaxe et découpage..."
        
        stats = execute_analysis(target_path)
        time.sleep(1) # Petit délai pour que l'interface affiche l'étape
        
        # ==========================================
        # ÉTAPE 3 : GRAPH & IA (Bientôt)
        # ==========================================
        # job_status[job_id]["current_step"] = "building_graph"
        # job_status[job_id]["message"] = "Création du graphe de dépendances..."
        # execute_graph_building(target_path)

        # ==========================================
        # FIN DU PIPELINE
        # ==========================================
        print(f"🎉 PIPELINE TERMINÉ AVEC SUCCÈS POUR : {repo_name}")
        job_status[job_id].update({
            "status": "done",
            "current_step": "completed",
            "path": target_path,
            "stats": stats
        })

    except Exception as e:
        print(f"❌ ERREUR CRITIQUE PIPELINE : {str(e)}")
        job_status[job_id]["status"] = "error"
        job_status[job_id]["error"] = str(e)