use chrono::Utc;
use serde_json::json;
use uuid::Uuid;
use crate::error::AppError;
use crate::models::chat::{ChatMessage, SendMessageRequest, SendMessageResponse};
use crate::db::DbPool;

pub struct AiService {
    db: DbPool,
    ai_provider: String,
    ai_api_key: Option<String>,
}

impl AiService {
    pub fn new(db: DbPool, ai_provider: String, ai_api_key: Option<String>) -> Self {
        Self {
            db,
            ai_provider,
            ai_api_key,
        }
    }

    pub async fn process_message(&self, user_id: &str, req: SendMessageRequest) -> Result<SendMessageResponse, AppError> {
        let session_id = req.session_id.unwrap_or_else(|| Uuid::new_v4().to_string());
        let mode = req.mode.unwrap_or_else(|| "empresa".to_string()).to_lowercase();
        let prompt_text = req.message.trim();

        // 1. Save user message to database
        let user_msg = ChatMessage {
            id: Uuid::new_v4().to_string(),
            session_id: session_id.clone(),
            user_id: user_id.to_string(),
            sender: "user".to_string(),
            content: prompt_text.to_string(),
            mode: mode.clone(),
            action_type: None,
            action_payload: None,
            created_at: Utc::now().to_rfc3339(),
        };
        self.db.insert_message(&user_msg)?;

        // 2. Determine response: Live AI or Demonstration Intelligence Engine
        let (assistant_content, action_type, action_payload, is_simulation) = if let Some(ref _api_key) = self.ai_api_key {
            // If API key is configured and not "demo", could call external API.
            // If network fails or provider is demo, gracefully fall back to local engine.
            self.generate_smart_response(prompt_text, &mode)
        } else {
            self.generate_smart_response(prompt_text, &mode)
        };

        // 3. Save assistant message
        let assistant_msg = ChatMessage {
            id: Uuid::new_v4().to_string(),
            session_id: session_id.clone(),
            user_id: user_id.to_string(),
            sender: "assistant".to_string(),
            content: assistant_content,
            mode,
            action_type,
            action_payload,
            created_at: Utc::now().to_rfc3339(),
        };
        self.db.insert_message(&assistant_msg)?;

        Ok(SendMessageResponse {
            session_id,
            message: assistant_msg,
            is_simulation,
        })
    }

    fn generate_smart_response(
        &self,
        prompt: &str,
        mode: &str,
    ) -> (String, Option<String>, Option<serde_json::Value>, bool) {
        let p = prompt.to_lowercase();

        // 1. Excel / Planilha
        if p.contains("planilha") || p.contains("excel") || p.contains("tabela") || p.contains(".xlsx") {
            let content = if mode == "empresa" {
                "Analisei sua solicitação corporativa e estruturei uma planilha financeira e operacional completa com fórmulas de soma automática, estilização navy/cyan e formatação monetária. Você pode revisar e gerar o arquivo Excel (.xlsx) imediatamente abaixo:"
            } else {
                "Preparei uma planilha organizada com formatação limpa e fórmulas para o seu computador. Veja a estrutura pré-configurada e gere o arquivo Excel (.xlsx) abaixo:"
            };

            let payload = json!({
                "filename": if mode == "empresa" { "relatorio_financeiro_empresa.xlsx" } else { "minhas_despesas_pessoais.xlsx" },
                "sheet_name": if mode == "empresa" { "Demonstrativo_DRE" } else { "Despesas" },
                "title": if mode == "empresa" { "Demonstrativo de Receitas e Custos — Verity AI" } else { "Controle Financeiro Pessoal" },
                "headers": if mode == "empresa" {
                    vec!["Mês / Período", "Receita Bruta", "Custos Operacionais", "Margem Bruta", "Status"]
                } else {
                    vec!["Categoria", "Descrição", "Valor Previsto", "Valor Realizado", "Data"]
                },
                "rows": if mode == "empresa" {
                    vec![
                        vec!["Janeiro", "45000", "18000", "27000", "Concluído"],
                        vec!["Fevereiro", "52000", "21000", "31000", "Concluído"],
                        vec!["Março", "61000", "24000", "37000", "Projetado"],
                        vec!["Abril", "68000", "26500", "41500", "Projetado"]
                    ]
                } else {
                    vec![
                        vec!["Moradia", "Aluguel e Condomínio", "2200", "2200", "05/01/2026"],
                        vec!["Alimentação", "Supermercado Semanal", "1400", "1320", "12/01/2026"],
                        vec!["Transporte", "Combustível e Mobilidade", "600", "550", "20/01/2026"],
                        vec!["Lazer", "Assinaturas e streaming", "250", "250", "25/01/2026"]
                    ]
                }
            });

            return (
                format!("{}\n\n*(Demonstração assistida: Automação real disponível no botão de execução)*", content),
                Some("generate_xlsx".to_string()),
                Some(payload),
                true
            );
        }

        // 2. Word / Documento
        if p.contains("documento") || p.contains("word") || p.contains(".docx") || p.contains("texto") || p.contains("proposta") || p.contains("contrato") {
            let content = if mode == "empresa" {
                "Elaborei um documento corporativo formal pronto para exportação em Word (.docx), incluindo cabeçalhos, logotipo da Verity AI, espaçamentos padronizados e seções executivas."
            } else {
                "Criei a estrutura do documento de texto para o seu computador. Você pode exportar diretamente em Word (.docx) com formatação profissional."
            };

            let payload = json!({
                "title": if mode == "empresa" { "Proposta de Automação Empresarial — Verity AI" } else { "Documento de Planejamento Pessoal" },
                "filename": if mode == "empresa" { "proposta_comercial_verity.docx" } else { "planejamento_anual.docx" },
                "author": "Verity AI Engine",
                "mode": mode,
                "content": if mode == "empresa" {
                    "# 1. Sumário Executivo\nA Verity AI integra inteligência artificial avançada para automatizar processos de administração, relatórios e geração de documentos empresariais.\n\n## 2. Escopo dos Serviços\n- Geração autônoma de planilhas e demonstrativos financeiros.\n- Emissão de relatórios em PDF com sumários analíticos.\n- Redação e preparação de e-mails corporativos com validação prévia.\n\n## 3. Benefícios Estratégicos\n- Redução de até 75% no tempo gasto em tarefas operacionais de rotina.\n- Maior acurácia em cálculos e padronização visual impecável."
                } else {
                    "# Planejamento Pessoal e Metas\n\n## 1. Organização do Computador e Rotina\n- Limpeza e categorização periódica das pastas de Downloads e Documentos.\n- Backup dos arquivos importantes e relatórios de despesas.\n\n## 2. Objetivos Principais\n- Concluir projetos em andamento com apoio das automações Verity AI.\n- Manter a agenda e tarefas sincronizadas semanalmente."
                }
            });

            return (
                format!("{}\n\n*(Demonstração assistida: Automação real conectada ao motor python-docx)*", content),
                Some("generate_docx".to_string()),
                Some(payload),
                true
            );
        }

        // 3. PDF / Relatório
        if p.contains("pdf") || p.contains("relatorio") || p.contains("relatório") || p.contains("laudo") {
            let content = "Gerei o modelo analítico do relatório executivo em PDF utilizando a biblioteca ReportLab. A formatação contém cabeçalho institucional, linha de destaque ciano e aviso legal corporativo.";
            let payload = json!({
                "title": "Relatório Executivo de Produtividade & Automação",
                "subtitle": "Análise Estratégica Mensal",
                "filename": "relatorio_executivo_verity.pdf",
                "author": "Verity AI Analytics",
                "content": "Este relatório consolidado apresenta os indicadores de eficiência obtidos através da plataforma Verity AI, demonstrando ganhos operacionais substanciais.",
                "sections": [
                    {
                        "heading": "1. Indicadores de Desempenho",
                        "text": "Foram processadas 142 tarefas automatizadas neste ciclo, incluindo a geração de 58 relatórios, 43 planilhas financeiras e 41 e-mails corporativos validados."
                    },
                    {
                        "heading": "2. Diagnóstico de Eficiência",
                        "text": "A velocidade de entrega de demonstrativos aumentou 4x em comparação a processos manuais, com índice de precisão nos cálculos de 100%."
                    }
                ]
            });

            return (
                format!("{}\n\n*(Demonstração assistida: Automação real conectada ao motor ReportLab)*", content),
                Some("generate_pdf".to_string()),
                Some(payload),
                true
            );
        }

        // 4. E-mail
        if p.contains("email") || p.contains("e-mail") || p.contains("mensagem") || p.contains("enviar") {
            let content = "Preparei a minuta do e-mail com todas as diretrizes de etiqueta e clareza. Por motivos de segurança, a Verity AI exige uma prévia e a sua confirmação explícita antes de qualquer envio real via SMTP.";
            let payload = json!({
                "recipient": "cliente@exemplo.com",
                "subject": "Atualização do Projeto e Relatório de Entregas — Verity AI",
                "body": "Prezada equipe,\n\nGostaríamos de compartilhar o fechamento das atividades do período. Todas as planilhas financeiras e relatórios operacionais foram validados com êxito.\n\nEstamos à disposição para eventuais alinhamentos.\n\nAtenciosamente,\nEquipe Verity AI",
                "sender_name": "Verity AI Assistant",
                "is_preview": true,
                "confirm": false
            });

            return (
                format!("{}\n\n*(Atenção: Nenhum e-mail é enviado sem sua confirmação explícita)*", content),
                Some("send_email".to_string()),
                Some(payload),
                true
            );
        }

        // 5. Cálculos / Finanças / ROI
        if p.contains("calcul") || p.contains("cálcul") || p.contains("roi") || p.contains("margem") || p.contains("lucro") || p.contains("financeir") {
            let content = "Efetuei a projeção financeira analítica com base nas variáveis informadas. Note que os dados gerados são ferramentas de auxílio gerencial e não substituem parecer contábil profissional.";
            let payload = json!({
                "calc_type": "financial",
                "inputs": {
                    "revenue": 150000.0,
                    "costs": 65000.0,
                    "operating_expenses": 32000.0,
                    "tax_rate": 15.0,
                    "initial_investment": 50000.0,
                    "expected_gain": 85000.0
                },
                "generate_report": true
            });

            return (
                format!("{}\n\n*(Demonstração assistida: Motor de cálculo analítico e DRE gerencial)*", content),
                Some("financial_calc".to_string()),
                Some(payload),
                true
            );
        }

        // 6. Organização de arquivos / Pastas
        if p.contains("organizar") || p.contains("pasta") || p.contains("arquivo") || p.contains("downloads") {
            let content = "A Verity AI pode organizar seus arquivos em pastas categorizadas (Documentos, Planilhas, Imagens, etc.) apenas em diretórios expressamente autorizados. O sistema sempre apresentará uma prévia das alterações para sua aprovação antes de mover qualquer arquivo.";
            let payload = json!({
                "target_directory": "C:\\Users\\uqual\\Downloads",
                "rule": "by_extension",
                "is_preview": true,
                "confirm": false
            });

            return (
                format!("{}\n\n*(Segurança ativa: Modo sandbox com proteção contra path traversal e diretórios do sistema)*", content),
                Some("file_organize".to_string()),
                Some(payload),
                true
            );
        }

        // Default smart contextual response
        let default_text = if mode == "empresa" {
            format!(
                "Entendido. Como assistente no **Modo Empresa** da Verity AI, estou pronto para gerenciar tarefas administrativas, criar planilhas (.xlsx), emitir relatórios em PDF, redigir minutas em Word (.docx), simular cálculos de margem e preparar e-mails corporativos.\n\nComo posso acelerar sua operação hoje? Você pode digitar comandos diretos como *'Crie uma planilha de vendas'* ou *'Gere um relatório executivo em PDF'*."
            )
        } else {
            format!(
                "Olá! No **Modo Normal** da Verity AI, posso ajudar você a organizar pastas e arquivos no seu computador, gerar documentos de texto em Word (.docx), criar planilhas de controle pessoal e redigir e-mails do dia a dia.\n\nO que você gostaria de automatizar agora?"
            )
        };

        (
            format!("{}\n\n*(Modo de Demonstração Inteligente — Verity AI Core)*", default_text),
            None,
            None,
            true
        )
    }
}
