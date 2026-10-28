import React, { useState } from 'react';
import { api } from '../services/api';
import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Mail,
  Calculator,
  FolderSync,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  X,
  Play,
  Send,
} from 'lucide-react';

export const AutomationsPage: React.FC = () => {
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultSuccess, setResultSuccess] = useState<any>(null);
  const [resultError, setResultError] = useState<string | null>(null);

  // Form states
  // 1. Docx
  const [docxForm, setDocxForm] = useState({
    title: 'Proposta de Automação Corporativa — Verity AI',
    filename: 'proposta_comercial_verity.docx',
    author: 'Verity AI Engine',
    content: '# 1. Sumário Executivo\nA Verity AI integra inteligência artificial avançada para automatizar processos de administração, relatórios e geração de documentos empresariais.\n\n## 2. Escopo dos Serviços\n- Geração de planilhas financeiras com fórmulas.\n- Emissão de relatórios em PDF com sumários analíticos.\n- Redação e preparação de e-mails corporativos com validação prévia.',
  });

  // 2. Xlsx
  const [xlsxForm, setXlsxForm] = useState({
    filename: 'relatorio_financeiro_dre.xlsx',
    sheet_name: 'Demonstrativo_DRE',
    title: 'Demonstrativo de Receitas e Custos — Verity AI',
    headers: 'Mês / Período, Receita Bruta, Custos Operacionais, Margem Bruta, Status',
    rows: 'Janeiro, 45000, 18000, 27000, Concluído\nFevereiro, 52000, 21000, 31000, Concluído\nMarço, 61000, 24000, 37000, Projetado\nAbril, 68000, 26500, 41500, Projetado',
  });

  // 3. Pdf
  const [pdfForm, setPdfForm] = useState({
    title: 'Relatório Executivo de Produtividade & Automação',
    subtitle: 'Diagnóstico Operacional Mensal',
    filename: 'relatorio_executivo_verity.pdf',
    author: 'Verity AI Analytics',
    content: 'Este relatório consolidado apresenta os indicadores de eficiência obtidos através da plataforma Verity AI, demonstrando ganhos operacionais substanciais.',
    sections: '1. Indicadores de Desempenho | Foram processadas 142 tarefas automatizadas neste ciclo, gerando ganho de 75% em tempo.\n2. Diagnóstico de Eficiência | A velocidade de entrega de demonstrativos aumentou 4x com precisão matemática absoluta.',
  });

  // 4. Email
  const [emailForm, setEmailForm] = useState({
    recipient: 'cliente@exemplo.com',
    subject: 'Atualização do Projeto e Relatório de Entregas — Verity AI',
    body: 'Prezada equipe,\n\nCompartilhamos o fechamento das atividades do período. Todas as planilhas financeiras e relatórios operacionais foram validados com êxito.\n\nAtenciosamente,\nEquipe Verity AI',
    confirmed: false,
  });

  // 5. Calculator
  const [calcForm, setCalcForm] = useState({
    revenue: 150000,
    costs: 65000,
    operating_expenses: 32000,
    tax_rate: 15,
    initial_investment: 50000,
    expected_gain: 85000,
  });

  // 6. File Organizer
  const [fileForm, setFileForm] = useState({
    target_directory: 'C:\\Users\\Downloads',
    rule: 'by_extension' as 'by_extension' | 'by_date' | 'by_type',
    confirmed: false,
  });

  const closeModal = () => {
    setActiveModal(null);
    setIsProcessing(false);
    setResultSuccess(null);
    setResultError(null);
  };

  // Execution Handlers
  const handleGenerateDocx = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResultError(null);
    try {
      const resp = await api.generateDocx({
        title: docxForm.title,
        content: docxForm.content,
        filename: docxForm.filename,
        author: docxForm.author,
      });
      setResultSuccess(resp);
    } catch (err: any) {
      setResultError(err.message || 'Erro ao gerar documento Word.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateXlsx = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResultError(null);
    try {
      const headers = xlsxForm.headers.split(',').map((h) => h.trim());
      const rows = xlsxForm.rows.split('\n').filter(Boolean).map((line) =>
        line.split(',').map((cell) => {
          const trimmed = cell.trim();
          return isNaN(Number(trimmed)) ? trimmed : Number(trimmed);
        })
      );

      const resp = await api.generateXlsx({
        filename: xlsxForm.filename,
        sheet_name: xlsxForm.sheet_name,
        title: xlsxForm.title,
        headers,
        rows,
      });
      setResultSuccess(resp);
    } catch (err: any) {
      setResultError(err.message || 'Erro ao gerar planilha Excel.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGeneratePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResultError(null);
    try {
      const parsedSections = pdfForm.sections
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const parts = line.split('|');
          return {
            heading: (parts[0] || 'Seção').trim(),
            text: (parts[1] || '').trim(),
          };
        });

      const resp = await api.generatePdf({
        title: pdfForm.title,
        subtitle: pdfForm.subtitle,
        filename: pdfForm.filename,
        author: pdfForm.author,
        content: pdfForm.content,
        sections: parsedSections,
      });
      setResultSuccess(resp);
    } catch (err: any) {
      setResultError(err.message || 'Erro ao gerar PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.confirmed) {
      setResultError('Por motivos de segurança, você deve marcar a caixa confirmando o envio.');
      return;
    }
    setIsProcessing(true);
    setResultError(null);
    try {
      const resp = await api.sendEmail({
        recipient: emailForm.recipient,
        subject: emailForm.subject,
        body: emailForm.body,
        confirm: true,
      });
      setResultSuccess(resp);
    } catch (err: any) {
      setResultError(err.message || 'Erro ao enviar e-mail.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResultError(null);
    try {
      const resp = await api.calculate({
        calc_type: 'financial',
        inputs: {
          revenue: Number(calcForm.revenue),
          costs: Number(calcForm.costs),
          operating_expenses: Number(calcForm.operating_expenses),
          tax_rate: Number(calcForm.tax_rate),
          initial_investment: Number(calcForm.initial_investment),
          expected_gain: Number(calcForm.expected_gain),
        },
      });
      setResultSuccess(resp);
    } catch (err: any) {
      setResultError(err.message || 'Erro nos cálculos.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOrganizeFiles = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResultError(null);
    try {
      const resp = await api.organizeFiles({
        target_directory: fileForm.target_directory,
        rule: fileForm.rule,
        confirm: fileForm.confirmed,
      });
      setResultSuccess(resp);
    } catch (err: any) {
      setResultError(err.message || 'Erro ao organizar arquivos.');
    } finally {
      setIsProcessing(false);
    }
  };

  const automations = [
    {
      id: 'docx',
      title: 'Gerador de Documentos Word',
      ext: '.docx',
      desc: 'Criação automatizada de propostas, relatórios e ofícios em Word com cabeçalhos e formatação corporativa via python-docx.',
      icon: FileText,
      iconColor: 'text-blue-400',
      badge: 'python-docx',
    },
    {
      id: 'xlsx',
      title: 'Gerador de Planilhas Excel',
      ext: '.xlsx',
      desc: 'Criação de planilhas com tabelas estilizadas na paleta navy/cyan, colunas auto-ajustadas e fórmulas nativas via openpyxl.',
      icon: FileSpreadsheet,
      iconColor: 'text-emerald-400',
      badge: 'openpyxl',
    },
    {
      id: 'pdf',
      title: 'Gerador de Relatórios PDF',
      ext: '.pdf',
      desc: 'Emissão de documentos e relatórios analíticos diagramados com cabeçalho institucional e padrão visual via ReportLab.',
      icon: FileDown,
      iconColor: 'text-red-400',
      badge: 'reportlab',
    },
    {
      id: 'email',
      title: 'Envio & Minuta de E-mails',
      ext: 'SMTP',
      desc: 'Composição de e-mails com prévia obrigatória e confirmação explícita para evitar qualquer envio acidental.',
      icon: Mail,
      iconColor: 'text-amber-400',
      badge: 'smtplib / TLS',
    },
    {
      id: 'calc',
      title: 'Cálculos & DRE Financeiro',
      ext: 'Analytics',
      desc: 'Simulação analítica de Margem Bruta, Margem Operacional, EBITDA, Deduções Tributárias e ROI do projeto.',
      icon: Calculator,
      iconColor: 'text-cyan-400',
      badge: 'Rust Tokio',
    },
    {
      id: 'files',
      title: 'Organizador de Arquivos em Pasta',
      ext: 'Sandbox',
      desc: 'Triagem de arquivos em diretórios autorizados por extensão (Documentos, Planilhas, Imagens) com sandbox e confirmação.',
      icon: FolderSync,
      iconColor: 'text-purple-400',
      badge: 'Proteção Sandbox',
    },
  ];

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Central de Automações</h1>
        <p className="text-slate-400 text-sm mt-1">
          Motores reais em Rust e Python integrados para acelerar a rotina da sua empresa e do seu computador.
        </p>
      </div>

      {/* Grid of Automation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 ${item.iconColor}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                  {item.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed mt-2">{item.desc}</p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setResultSuccess(null);
                  setResultError(null);
                  setActiveModal(item.id);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/30 font-bold text-xs transition-all shadow-sm"
              >
                <Play className="w-3.5 h-3.5" />
                Configurar & Executar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL HANDLERS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {activeModal === 'docx' && <FileText className="w-5 h-5" />}
                  {activeModal === 'xlsx' && <FileSpreadsheet className="w-5 h-5" />}
                  {activeModal === 'pdf' && <FileDown className="w-5 h-5" />}
                  {activeModal === 'email' && <Mail className="w-5 h-5" />}
                  {activeModal === 'calc' && <Calculator className="w-5 h-5" />}
                  {activeModal === 'files' && <FolderSync className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {activeModal === 'docx' && 'Gerador de Documentos Word (.docx)'}
                    {activeModal === 'xlsx' && 'Gerador de Planilhas Excel (.xlsx)'}
                    {activeModal === 'pdf' && 'Gerador de Relatórios PDF'}
                    {activeModal === 'email' && 'Envio Seguro de E-mail via SMTP'}
                    {activeModal === 'calc' && 'Simulação de Cálculos & DRE Financeiro'}
                    {activeModal === 'files' && 'Organização Segura de Arquivos em Pasta'}
                  </h3>
                  <p className="text-xs text-slate-400">Preencha os parâmetros para a execução</p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {resultError && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{resultError}</span>
              </div>
            )}

            {/* Success Feedback with download button */}
            {resultSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>Operação concluída com êxito!</span>
                </div>
                {resultSuccess.message && <p>{resultSuccess.message}</p>}
                
                {/* Download link if generated file */}
                {resultSuccess.file_url && (
                  <div className="pt-2">
                    <a
                      href={resultSuccess.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow"
                    >
                      <Download className="w-4 h-4" />
                      Baixar Arquivo Gerado ({resultSuccess.file_name})
                    </a>
                  </div>
                )}

                {/* Calc results summary */}
                {resultSuccess.results && (
                  <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-emerald-900/60 font-mono text-xs space-y-1 text-slate-300">
                    <p>Receita Bruta: R$ {resultSuccess.results.revenue?.toLocaleString('pt-BR')}</p>
                    <p>Margem Bruta: {resultSuccess.results.gross_margin_percent}%</p>
                    <p>EBITDA: R$ {resultSuccess.results.ebitda?.toLocaleString('pt-BR')} ({resultSuccess.results.ebitda_margin_percent}%)</p>
                    <p>Lucro Líquido: R$ {resultSuccess.results.net_income?.toLocaleString('pt-BR')}</p>
                    <p className="text-cyan-400 font-bold">ROI Projetado: {resultSuccess.results.roi_percent}%</p>
                  </div>
                )}

                {/* File organized summary */}
                {resultSuccess.planned_actions && (
                  <div className="mt-2 text-[11px] font-mono text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-300">Ações planejadas:</p>
                    {resultSuccess.planned_actions.map((act: any, i: number) => (
                      <p key={i}>• {act.file} → /{act.destination}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 1. DOCX FORM */}
            {activeModal === 'docx' && (
              <form onSubmit={handleGenerateDocx} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Título do Documento</label>
                  <input
                    type="text"
                    value={docxForm.title}
                    onChange={(e) => setDocxForm({ ...docxForm, title: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Arquivo (.docx)</label>
                    <input
                      type="text"
                      value={docxForm.filename}
                      onChange={(e) => setDocxForm({ ...docxForm, filename: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Autor / Responsável</label>
                    <input
                      type="text"
                      value={docxForm.author}
                      onChange={(e) => setDocxForm({ ...docxForm, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Conteúdo do Documento</label>
                  <textarea
                    rows={6}
                    value={docxForm.content}
                    onChange={(e) => setDocxForm({ ...docxForm, content: e.target.value })}
                    required
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>{isProcessing ? 'Gerando Documento Word...' : 'Gerar e Exportar .docx'}</span>
                </button>
              </form>
            )}

            {/* 2. XLSX FORM */}
            {activeModal === 'xlsx' && (
              <form onSubmit={handleGenerateXlsx} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Arquivo (.xlsx)</label>
                    <input
                      type="text"
                      value={xlsxForm.filename}
                      onChange={(e) => setXlsxForm({ ...xlsxForm, filename: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nome da Aba</label>
                    <input
                      type="text"
                      value={xlsxForm.sheet_name}
                      onChange={(e) => setXlsxForm({ ...xlsxForm, sheet_name: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cabeçalhos (separados por vírgula)</label>
                  <input
                    type="text"
                    value={xlsxForm.headers}
                    onChange={(e) => setXlsxForm({ ...xlsxForm, headers: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Linhas de Dados (1 por linha, separadas por vírgula)</label>
                  <textarea
                    rows={5}
                    value={xlsxForm.rows}
                    onChange={(e) => setXlsxForm({ ...xlsxForm, rows: e.target.value })}
                    required
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>{isProcessing ? 'Gerando Planilha Excel...' : 'Gerar e Exportar .xlsx'}</span>
                </button>
              </form>
            )}

            {/* 3. PDF FORM */}
            {activeModal === 'pdf' && (
              <form onSubmit={handleGeneratePdf} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Título do Relatório</label>
                    <input
                      type="text"
                      value={pdfForm.title}
                      onChange={(e) => setPdfForm({ ...pdfForm, title: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Arquivo (.pdf)</label>
                    <input
                      type="text"
                      value={pdfForm.filename}
                      onChange={(e) => setPdfForm({ ...pdfForm, filename: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sumário Executivo</label>
                  <textarea
                    rows={3}
                    value={pdfForm.content}
                    onChange={(e) => setPdfForm({ ...pdfForm, content: e.target.value })}
                    required
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Seções Analíticas (Formato: Título | Texto)
                  </label>
                  <textarea
                    rows={4}
                    value={pdfForm.sections}
                    onChange={(e) => setPdfForm({ ...pdfForm, sections: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>{isProcessing ? 'Gerando Relatório PDF...' : 'Gerar e Exportar .pdf'}</span>
                </button>
              </form>
            )}

            {/* 4. EMAIL FORM WITH LIVE PREVIEW & EXPLICIT CONFIRMATION */}
            {activeModal === 'email' && (
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Destinatário</label>
                  <input
                    type="email"
                    value={emailForm.recipient}
                    onChange={(e) => setEmailForm({ ...emailForm, recipient: e.target.value })}
                    required
                    placeholder="cliente@empresa.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assunto</label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Corpo da Mensagem</label>
                  <textarea
                    rows={4}
                    value={emailForm.body}
                    onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                    required
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>

                {/* Strict Confirmation Checkbox */}
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="emailConfirm"
                    checked={emailForm.confirmed}
                    onChange={(e) => setEmailForm({ ...emailForm, confirmed: e.target.checked })}
                    className="mt-0.5 rounded text-cyan-500 focus:ring-0"
                  />
                  <label htmlFor="emailConfirm" className="text-xs text-amber-200 cursor-pointer">
                    <strong>Confirmação de Segurança Obrigatória:</strong> Revisei a prévia do destinatário e do conteúdo e autorizo explicitamente a tentativa de envio.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !emailForm.confirmed}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{isProcessing ? 'Validando e Disparando...' : 'Confirmar & Enviar E-mail'}</span>
                </button>
              </form>
            )}

            {/* 5. CALCULATOR FORM */}
            {activeModal === 'calc' && (
              <form onSubmit={handleCalculate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Receita Bruta (R$)</label>
                    <input
                      type="number"
                      value={calcForm.revenue}
                      onChange={(e) => setCalcForm({ ...calcForm, revenue: Number(e.target.value) })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Custos Operacionais (R$)</label>
                    <input
                      type="number"
                      value={calcForm.costs}
                      onChange={(e) => setCalcForm({ ...calcForm, costs: Number(e.target.value) })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Despesas Fixas / Opex (R$)</label>
                    <input
                      type="number"
                      value={calcForm.operating_expenses}
                      onChange={(e) => setCalcForm({ ...calcForm, operating_expenses: Number(e.target.value) })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Alíquota de Tributos (%)</label>
                    <input
                      type="number"
                      value={calcForm.tax_rate}
                      onChange={(e) => setCalcForm({ ...calcForm, tax_rate: Number(e.target.value) })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Investimento Inicial (R$)</label>
                    <input
                      type="number"
                      value={calcForm.initial_investment}
                      onChange={(e) => setCalcForm({ ...calcForm, initial_investment: Number(e.target.value) })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Retorno Esperado (R$)</label>
                    <input
                      type="number"
                      value={calcForm.expected_gain}
                      onChange={(e) => setCalcForm({ ...calcForm, expected_gain: Number(e.target.value) })}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
                  <span>{isProcessing ? 'Calculando Margens e Indicadores...' : 'Processar Simulação Analítica'}</span>
                </button>
              </form>
            )}

            {/* 6. FILE ORGANIZER FORM */}
            {activeModal === 'files' && (
              <form onSubmit={handleOrganizeFiles} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Caminho do Diretório Autorizado (Sandbox)
                  </label>
                  <input
                    type="text"
                    value={fileForm.target_directory}
                    onChange={(e) => setFileForm({ ...fileForm, target_directory: e.target.value })}
                    required
                    placeholder="Ex: C:\Users\uqual\Downloads"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    A Verity AI apenas opera em pastas explicitamente autorizadas para evitar alterações no sistema operacional.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Regra de Organização</label>
                  <select
                    value={fileForm.rule}
                    onChange={(e: any) => setFileForm({ ...fileForm, rule: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  >
                    <option value="by_extension">Por Extensão (Documentos, Planilhas, Imagens, Vídeos)</option>
                    <option value="by_type">Por Tipo de Conteúdo</option>
                    <option value="by_date">Por Mês / Ano de Modificação</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="fileConfirm"
                    checked={fileForm.confirmed}
                    onChange={(e) => setFileForm({ ...fileForm, confirmed: e.target.checked })}
                    className="mt-0.5 rounded text-cyan-500 focus:ring-0"
                  />
                  <label htmlFor="fileConfirm" className="text-xs text-purple-200 cursor-pointer">
                    <strong>Autorização Expressa:</strong> Confirmo que autorizo a organização e movimentação de arquivos na pasta informada.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FolderSync className="w-4 h-4" />}
                  <span>{isProcessing ? 'Analisando diretório...' : fileForm.confirmed ? 'Executar Organização' : 'Gerar Prévia Segura'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
