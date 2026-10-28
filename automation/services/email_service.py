import os
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from models.schemas import EmailRequest

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

def process_email(req: EmailRequest) -> dict:
    # 1. Validation
    if not EMAIL_REGEX.match(req.recipient.strip()):
        return {
            "success": False,
            "error": f"Endereço de e-mail inválido: '{req.recipient}'",
            "is_preview": req.is_preview
        }

    # 2. Preview mode
    if req.is_preview or not req.confirm:
        return {
            "success": True,
            "status": "preview",
            "message": "Pré-visualização gerada com sucesso. Confirmação explícita necessária para disparo.",
            "preview_data": {
                "recipient": req.recipient,
                "sender_name": req.sender_name or "Verity AI Assistant",
                "subject": req.subject,
                "body": req.body,
                "requires_confirmation": True
            }
        }

    # 3. Check SMTP configuration in environment
    smtp_host = os.environ.get("SMTP_HOST")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER")
    smtp_password = os.environ.get("SMTP_PASSWORD")
    sender_email = os.environ.get("SMTP_FROM", smtp_user or "nao-responder@verityai.com")

    # If SMTP is not fully configured, run simulated demo mode
    if not smtp_host or not smtp_user or not smtp_password:
        return {
            "success": True,
            "status": "demo_simulated",
            "message": (
                "Modo de demonstração: simulação concluída com sucesso. "
                "Nenhum e-mail real foi disparado pois as credenciais de SMTP não estão configuradas no ambiente. "
                "Para envio real, configure as variáveis SMTP_HOST, SMTP_USER e SMTP_PASSWORD no arquivo .env."
            ),
            "sent_details": {
                "recipient": req.recipient,
                "subject": req.subject,
                "sender": f"{req.sender_name} <{sender_email}>",
                "is_simulation": True
            }
        }

    # 4. Real SMTP send if credentials present
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = req.subject
        msg["From"] = f"{req.sender_name} <{sender_email}>"
        msg["To"] = req.recipient

        # Plain text and HTML version
        html_content = f"""
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #0A1128; color: #00B4D8; padding: 16px 24px; font-weight: bold; font-size: 16px;">
                Verity AI
              </div>
              <div style="padding: 24px;">
                <p style="white-space: pre-wrap;">{req.body}</p>
              </div>
              <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 12px 24px; font-size: 12px; color: #64748b;">
                Mensagem enviada através da plataforma Verity AI — Sua empresa. Seu computador. Sua IA.
              </div>
            </div>
          </body>
        </html>
        """
        msg.attach(MIMEText(req.body, "plain", "utf-8"))
        msg.attach(MIMEText(html_content, "html", "utf-8"))

        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(sender_email, [req.recipient], msg.as_string())

        return {
            "success": True,
            "status": "sent",
            "message": f"E-mail enviado com sucesso para {req.recipient}.",
            "sent_details": {
                "recipient": req.recipient,
                "subject": req.subject,
                "sender": sender_email,
                "is_simulation": False
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Falha ao enviar e-mail via SMTP: {str(e)}"
        }
