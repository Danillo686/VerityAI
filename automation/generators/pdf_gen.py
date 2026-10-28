import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from models.schemas import PdfRequest

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "generated_files")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_pdf(req: PdfRequest) -> dict:
    clean_name = os.path.basename(req.filename or "relatorio_verity.pdf")
    if not clean_name.endswith(".pdf"):
        clean_name += ".pdf"
    filepath = os.path.join(OUTPUT_DIR, clean_name)

    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        rightMargin=45,
        leftMargin=45,
        topMargin=45,
        bottomMargin=45
    )

    story = []
    styles = getSampleStyleSheet()

    # Custom styles
    brand_navy = colors.HexColor("#0A1128")
    accent_cyan = colors.HexColor("#00B4D8")
    text_dark = colors.HexColor("#1E293B")
    text_muted = colors.HexColor("#64748B")

    brand_style = ParagraphStyle(
        'BrandHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=accent_cyan,
        alignment=2 # Right aligned
    )

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=brand_navy,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=text_muted,
        spaceAfter=12
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=brand_navy,
        spaceBefore=14,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=text_dark,
        spaceAfter=8
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=12,
        textColor=text_muted
    )

    # 1. Header brand tag
    story.append(Paragraph("VERITY AI  |  EXECUTIVE REPORT", brand_style))
    story.append(Spacer(1, 10))

    # 2. Main Title
    story.append(Paragraph(req.title, title_style))
    meta_info = f"{req.subtitle}  •  Data: {datetime.now().strftime('%d/%m/%Y às %H:%M')}  •  Autor: {req.author}"
    story.append(Paragraph(meta_info, subtitle_style))

    # 3. Cyan decorative line
    story.append(HRFlowable(width="100%", thickness=2, color=accent_cyan, spaceBefore=4, spaceAfter=14))

    # 4. Main content summary
    if req.content:
        for p in req.content.split("\n\n"):
            p_clean = p.strip()
            if p_clean:
                story.append(Paragraph(p_clean, body_style))
        story.append(Spacer(1, 10))

    # 5. Sections
    if req.sections:
        for sec in req.sections:
            story.append(Paragraph(sec.heading, section_heading))
            for p in sec.text.split("\n\n"):
                p_clean = p.strip()
                if p_clean:
                    story.append(Paragraph(p_clean, body_style))
            story.append(Spacer(1, 6))

    # 6. Callout table at bottom
    story.append(Spacer(1, 16))
    notice_text = Paragraph(
        "<b>Aviso:</b> Este relatório foi gerado automaticamente pela plataforma Verity AI "
        "(Sua empresa. Seu computador. Sua IA). Os dados foram processados de acordo com os parâmetros configurados.",
        callout_style
    )
    notice_table = Table([[notice_text]], colWidths=[520])
    notice_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LINELEFT', (0,0), (0,0), 3, accent_cyan),
    ]))
    story.append(notice_table)

    # Build PDF
    doc.build(story)
    file_size = os.path.getsize(filepath)

    return {
        "success": True,
        "filename": clean_name,
        "file_size": file_size,
        "download_url": f"/api/v1/download/{clean_name}",
        "message": f"Relatório PDF '{clean_name}' gerado com sucesso."
    }
