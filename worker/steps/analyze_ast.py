import os
import re

def extract_imports(file_content: str):
    # Cherche : import { X } from "chemin"
    pattern = r'import\s+(?:.*?\s+from\s+)?[\'"](.*?)[\'"]'
    return re.findall(pattern, file_content)

def execute_analysis(target_path: str):
    IGNORE_DIRS = {'.git', 'node_modules', 'dist', 'build', '__pycache__', 'venv', '.next', '.vscode'}
    
    nodes = []  
    edges = []  
    total_lines_of_code = 0
    
    print(f"\n🔍 [ÉTAPE 2] ANALYSE DU CODE ET EXTRACTION DES RELATIONS...")
    print("-" * 50)

    for root, dirs, files in os.walk(target_path):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            if not file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                continue 
                
            file_path = os.path.join(root, file)
            relative_path = os.path.relpath(file_path, target_path).replace("\\", "/")
            
            nodes.append({"id": relative_path, "type": "file", "name": file})
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    total_lines_of_code += len(content.splitlines())
                    
                    imports = extract_imports(content)
                    
                    # --- 💡 NOUVEAU : AFFICHAGE DANS LE TERMINAL ---
                    if imports:
                        print(f"📄 Fichier lu : {relative_path}")
                        for imported_path in imports:
                            print(f"   🔗 importe -> {imported_path}")
                            
                            # On ajoute la flèche à notre graphe
                            edges.append({
                                "source": relative_path,
                                "target": imported_path,
                                "relationship": "IMPORTS"
                            })
            except Exception as e:
                continue 
                
    print("-" * 50)
    print(f"✅ [ÉTAPE 2] SUCCÈS : {len(nodes)} fichiers (Nœuds) et {len(edges)} relations (Flèches) trouvées.")
    print("-" * 50)
    
    n = len(nodes)
    e = len(edges)
    return {
        "total_nodes": n,
        "total_edges": e,
        "total_files_parsed": n,
        "total_lines_of_code": total_lines_of_code,
        "sample_edges": edges[:5],
    }