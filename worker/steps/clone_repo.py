import os
import shutil
import stat
from git import Repo, GitCommandError

# 💡 LA MAGIE DU "NUKE" SUR WINDOWS : 
# Si un fichier refuse de se faire supprimer (Lecture seule), cette fonction fait sauter le verrou.
def remove_readonly(func, path, excinfo):
    os.chmod(path, stat.S_IWRITE) # On force les droits d'écriture
    func(path)                    # On relance la suppression

def execute_clone(url: str, branch: str, target_path: str):
    try:
        # ==========================================
        # 💣 ÉTAPE "NUKE" : On rase l'ancien dossier
        # ==========================================
        if os.path.exists(target_path):
            print(f"🧹 Nettoyage de l'ancien dossier : {target_path}")
            # On utilise notre fonction magique en cas d'erreur de permission
            shutil.rmtree(target_path, onerror=remove_readonly)
            
        # ==========================================
        # 🏗️ ÉTAPE "PAVE" : On reconstruit par-dessus
        # ==========================================
        os.makedirs(target_path, exist_ok=True)

        print(f"🚀 [ÉTAPE 1] CLONAGE EN COURS (Branche: {branch})")
        Repo.clone_from(url, target_path, branch=branch, depth=1)
        print(f"✅ [ÉTAPE 1] SUCCÈS : Cloné dans {target_path}")
        
        return {"success": True, "error": None}

    except GitCommandError as e:
        error_msg = str(e).lower()
        if "not found" in error_msg or "repository" in error_msg:
            reason = "Dépôt introuvable ou token invalide."
        elif "invalid username" in error_msg or "authentication" in error_msg:
            reason = "Token GitHub invalide ou expiré."
        elif "branch" in error_msg:
            reason = f"Branche '{branch}' introuvable sur ce dépôt."
        else:
            reason = str(e)
            
        return {"success": False, "error": reason}
        
    except Exception as e:
        return {"success": False, "error": str(e)}