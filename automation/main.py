import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from models.schemas import (
    DocxRequest,
    XlsxRequest,
    PdfRequest,
    EmailRequest,
    CalculationRequest,
    FileOrganizeRequest
)
from generators.docx_gen import generate_docx
from generators.xlsx_gen import generate_xlsx
from generators.pdf_gen import generate_pdf
from services.email_service import process_email
from services.calculator import perform_calculations
from services.file_organizer import organize_files

OUTPUT_DIR = Path(__file__).parent / "generated_files"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="Verity AI Automation Service",
    description="Serviço interno especializado em automações: Word, Excel, PDF, SMTP, Cálculos e Arquivos.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Verity AI Automation Engine",
        "capabilities": ["docx", "xlsx", "pdf", "email", "calculations", "file_organization"],
        "version": "1.0.0"
    }

@app.post("/api/v1/generate/docx")
def api_generate_docx(req: DocxRequest):
    try:
        return generate_docx(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar documento Word: {str(e)}")

@app.post("/api/v1/generate/xlsx")
def api_generate_xlsx(req: XlsxRequest):
    try:
        return generate_xlsx(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar planilha Excel: {str(e)}")

@app.post("/api/v1/generate/pdf")
def api_generate_pdf(req: PdfRequest):
    try:
        return generate_pdf(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar relatório PDF: {str(e)}")

@app.post("/api/v1/email/send")
def api_send_email(req: EmailRequest):
    try:
        result = process_email(req)
        if not result.get("success"):
            raise HTTPException(status_code=400, detail=result.get("error", "Erro ao processar e-mail"))
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno de processamento de e-mail: {str(e)}")

@app.post("/api/v1/calc/financial")
def api_calculate_financial(req: CalculationRequest):
    try:
        return perform_calculations(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao realizar cálculos: {str(e)}")

@app.post("/api/v1/files/organize")
def api_organize_files(req: FileOrganizeRequest):
    try:
        result = organize_files(req)
        if not result.get("success"):
            raise HTTPException(status_code=400, detail=result.get("error", "Falha na organização"))
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno na organização de arquivos: {str(e)}")

@app.get("/api/v1/download/{filename}")
def download_generated_file(filename: str):
    # Path traversal protection
    clean_name = os.path.basename(filename)
    file_path = OUTPUT_DIR / clean_name
    
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Arquivo não encontrado ou expirado.")

    media_type = "application/octet-stream"
    if clean_name.endswith(".docx"):
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif clean_name.endswith(".xlsx"):
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    elif clean_name.endswith(".pdf"):
        media_type = "application/pdf"

    return FileResponse(
        path=file_path,
        media_type=media_type,
        filename=clean_name
    )

@app.get("/api/v1/files/list")
def list_generated_files():
    files = []
    for item in OUTPUT_DIR.iterdir():
        if item.is_file():
            stat = item.stat()
            files.append({
                "filename": item.name,
                "size_bytes": stat.st_size,
                "modified_at": stat.st_mtime,
                "download_url": f"/api/v1/download/{item.name}"
            })
    files.sort(key=lambda x: x["modified_at"], reverse=True)
    return {"files": files}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("AUTOMATION_PORT", "5001"))
    uvicorn.run("main:app", host="127.0.0.1", port=port, reload=False)
