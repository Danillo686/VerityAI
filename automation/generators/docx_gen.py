import os
from datetime import datetime
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from models.schemas import DocxRequest

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "generated_files")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def generate_docx(req: DocxRequest) -> dict:
    doc = Document()

    # Define color scheme: Deep Navy (#0A1128) and Cyan (#00B4D8)
    navy_color = RGBColor(10, 17, 40)
    cyan_color = RGBColor(0, 180, 216)
    slate_color = RGBColor(100, 116, 139)

    # Document Header / Brand
    brand_para = doc.add_paragraph()
    brand_para.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    brand_run = brand_para.add_run("VERITY AI  |  AUTOMATED DOCUMENT")
    brand_run.font.size = Pt(8.5)
    brand_run.font.bold = True
    brand_run.font.color.rgb = cyan_color

    # Title
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(12)
    title_p.paragraph_format.space_after = Pt(4)
    title_run = title_p.add_run(req.title)
    title_run.font.name = "Calibri"
    title_run.font.size = Pt(24)
    title_run.font.bold = True
    title_run.font.color.rgb = navy_color

    # Subtitle / Metadata
    meta_p = doc.add_paragraph()
    meta_p.paragraph_format.space_after = Pt(18)
    meta_text = f"Modo: {req.mode.upper()}  •  Autor: {req.author}  •  Data: {datetime.now().strftime('%d/%m/%Y às %H:%M')}"
    meta_run = meta_p.add_run(meta_text)
    meta_run.font.size = Pt(9.5)
    meta_run.font.italic = True
    meta_run.font.color.rgb = slate_color

    # Horizontal divider rule simulation
    divider_table = doc.add_table(rows=1, cols=1)
    divider_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = divider_table.cell(0, 0)
    set_cell_background(cell, "00B4D8")
    cell.paragraphs[0].paragraph_format.space_before = Pt(1)
    cell.paragraphs[0].paragraph_format.space_after = Pt(1)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Content paragraphs
    paragraphs = req.content.split("\n\n")
    for block in paragraphs:
        block = block.strip()
        if not block:
            continue
        
        # Check if line looks like a header (starts with # or **)
        if block.startswith("# "):
            h = doc.add_heading(level=1)
            h.paragraph_format.space_before = Pt(14)
            h.paragraph_format.space_after = Pt(6)
            r = h.add_run(block[2:].strip())
            r.font.size = Pt(16)
            r.font.color.rgb = navy_color
        elif block.startswith("## "):
            h = doc.add_heading(level=2)
            h.paragraph_format.space_before = Pt(12)
            h.paragraph_format.space_after = Pt(4)
            r = h.add_run(block[3:].strip())
            r.font.size = Pt(13)
            r.font.color.rgb = navy_color
        elif block.startswith("- ") or block.startswith("* "):
            for item in block.split("\n"):
                clean_item = item.strip().lstrip("-* ").strip()
                if clean_item:
                    p = doc.add_paragraph(style='List Bullet')
                    p.paragraph_format.space_after = Pt(3)
                    p.add_run(clean_item)
        else:
            # Regular paragraph
            p = doc.add_paragraph()
            p.paragraph_format.space_after = Pt(8)
            p.paragraph_format.line_spacing = 1.15
            run = p.add_run(block)
            run.font.size = Pt(11)

    # Callout / Footer Note
    doc.add_paragraph().paragraph_format.space_after = Pt(16)
    callout_table = doc.add_table(rows=1, cols=1)
    callout_cell = callout_table.cell(0, 0)
    set_cell_background(callout_cell, "F1F5F9")
    callout_p = callout_cell.paragraphs[0]
    callout_p.paragraph_format.space_before = Pt(8)
    callout_p.paragraph_format.space_after = Pt(8)
    c_run = callout_p.add_run("Este documento foi gerado de forma autônoma pela plataforma Verity AI — Sua empresa. Seu computador. Sua IA.")
    c_run.font.size = Pt(9)
    c_run.font.italic = True
    c_run.font.color.rgb = slate_color

    # Safe filename
    clean_name = os.path.basename(req.filename or "documento_verity.docx")
    if not clean_name.endswith(".docx"):
        clean_name += ".docx"
    filepath = os.path.join(OUTPUT_DIR, clean_name)

    doc.save(filepath)
    file_size = os.path.getsize(filepath)

    return {
        "success": True,
        "filename": clean_name,
        "file_size": file_size,
        "download_url": f"/api/v1/download/{clean_name}",
        "message": f"Documento Word '{clean_name}' gerado com sucesso."
    }
