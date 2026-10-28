import os
import shutil
from pathlib import Path
from typing import Dict, Any, List
from models.schemas import FileOrganizeRequest

# File extension mappings for categorization
CATEGORIES = {
    "Documentos": [".pdf", ".docx", ".doc", ".txt", ".rtf", ".odt", ".pptx", ".md"],
    "Planilhas": [".xlsx", ".xls", ".csv", ".tsv", ".ods"],
    "Imagens": [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".bmp", ".ico"],
    "Audios_Videos": [".mp3", ".wav", ".mp4", ".mov", ".mkv", ".avi"],
    "Arquivos_Compactados": [".zip", ".rar", ".7z", ".tar", ".gz"],
    "Codigos": [".py", ".rs", ".js", ".ts", ".html", ".css", ".json", ".sql", ".sh"]
}

# Restricted system directories that must NEVER be organized
RESTRICTED_KEYWORDS = [
    "windows", "system32", "program files", "program files (x86)",
    "appdata", "system volume information", "$recycle.bin", "/etc", "/usr", "/bin", "/sbin"
]

def is_path_safe(target_path: Path) -> bool:
    target_str = str(target_path.resolve()).lower()
    
    # Reject root drive directly (e.g. C:\ or /)
    if target_path.resolve() == Path(target_path.anchor).resolve():
        return False
        
    for restricted in RESTRICTED_KEYWORDS:
        if restricted in target_str:
            return False
            
    return True

def organize_files(req: FileOrganizeRequest) -> Dict[str, Any]:
    target_dir_path = Path(req.target_directory).expanduser()
    
    if not target_dir_path.exists():
        return {
            "success": False,
            "error": f"O diretório especificado não existe: '{req.target_directory}'"
        }
    if not target_dir_path.is_dir():
        return {
            "success": False,
            "error": f"O caminho especificado não é uma pasta válida: '{req.target_directory}'"
        }
        
    resolved_path = target_dir_path.resolve()
    if not is_path_safe(resolved_path):
        return {
            "success": False,
            "error": "Operação bloqueada por segurança: diretório restrito ou caminho do sistema operacional."
        }

    # Inspect files in directory (non-recursive to be safe)
    planned_actions: List[Dict[str, str]] = []
    
    for item in resolved_path.iterdir():
        if item.is_file():
            ext = item.suffix.lower()
            category = "Outros"
            for cat_name, extensions in CATEGORIES.items():
                if ext in extensions:
                    category = cat_name
                    break
            
            dest_folder = resolved_path / category
            dest_file = dest_folder / item.name
            
            planned_actions.append({
                "file_name": item.name,
                "current_path": str(item),
                "target_category": category,
                "target_path": str(dest_file),
                "action": "move"
            })

    # If is_preview is True or user hasn't explicitly confirmed, return preview
    if req.is_preview or not req.confirm:
        return {
            "success": True,
            "status": "preview",
            "message": f"Identificados {len(planned_actions)} arquivos para organização em categorias.",
            "directory": str(resolved_path),
            "requires_confirmation": True,
            "planned_actions": planned_actions,
            "summary_by_category": {
                cat: len([a for a in planned_actions if a["target_category"] == cat])
                for cat in set(a["target_category"] for a in planned_actions)
            }
        }

    # Execute moves safely with confirmation
    executed_moves = []
    failed_moves = []

    for action in planned_actions:
        src = Path(action["current_path"])
        dest = Path(action["target_path"])
        try:
            dest.parent.mkdir(parents=True, exist_ok=True)
            # Avoid overwriting existing files
            target_dest = dest
            counter = 1
            while target_dest.exists():
                target_dest = dest.parent / f"{dest.stem}_{counter}{dest.suffix}"
                counter += 1
            
            shutil.move(str(src), str(target_dest))
            executed_moves.append({
                "from": str(src),
                "to": str(target_dest),
                "category": action["target_category"]
            })
        except Exception as e:
            failed_moves.append({
                "file": str(src),
                "error": str(e)
            })

    return {
        "success": True,
        "status": "completed",
        "message": f"Organização concluída! {len(executed_moves)} arquivos organizados com sucesso.",
        "directory": str(resolved_path),
        "executed_count": len(executed_moves),
        "failed_count": len(failed_moves),
        "details": executed_moves,
        "errors": failed_moves
    }
