import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { ChatMessage } from '../types';
import {
  Send,
  FileSpreadsheet,
  FileText,
  FileDown,
  Mail,
  Calculator,
  FolderSync,
  Download,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';

export const DashboardChatPage: React.FC = () => {
  const { user, activeMode, toggleMode } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ [id: string]: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    const initialWelcome: ChatMessage = {
      id: 'welcome-msg',
      session_id: 'default-session',
      sender: 'assistant',
      content:
        activeMode === 'empresa'
          ? 'Olá! Bem-vindo ao **Modo Empresa** da Verity AI. Estou pronto para redigir propostas comerciais em Word (.docx), emitir relatórios executivos em PDF, montar planilhas financeiras (.xlsx) com fórmulas, simular cálculos de margens/ROI e preparar minutas de e-mail corporativo.\n\nComo posso acelerar sua rotina operacional hoje?'
          : 'Olá! Bem-vindo ao **Modo Normal** da Verity AI. Sou seu copiloto para o computador. Posso ajudar você a organizar pastas de arquivos, gerar documentos de texto em Word (.docx), montar planilhas de controle pessoal e redigir e-mails.\n\nQual tarefa gostaria de realizar agora?',
      mode: activeMode,
      created_at: new Date().toISOString(),
    };
    setMessages([initialWelcome]);
  }, [activeMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      session_id: 'default-session',
      sender: 'user',
      content: text,
      mode: activeMode,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const resp = await api.sendMessage({
        message: text,
        mode: activeMode,
        session_id: 'default-session',
      });
      setMessages((prev) => [...prev, resp.message]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        session_id: 'default-session',
        sender: 'assistant',
        content: `Ops, ocorreu uma falha ao processar sua mensagem: ${err.message}`,
        mode: activeMode,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteCardAction = async (msgId: string, actionType: string, payload: any) => {
    setExecutingActionId(msgId);
    try {
      if (actionType === 'generate_xlsx') {
        const resp = await api.generateXlsx(payload);
        setActionFeedback((prev) => ({
          ...prev,
          [msgId]: `Planilha '${resp.file_name}' gerada com sucesso! O download foi disponibilizado.`,
        }));
        // Trigger download
        window.open(resp.file_url, '_blank');
      } else if (actionType === 'generate_docx') {
        const resp = await api.generateDocx(payload);
        setActionFeedback((prev) => ({
          ...prev,
          [msgId]: `Documento '${resp.file_name}' exportado com formatação profissional!`,
        }));
        window.open(resp.file_url, '_blank');
      } else if (actionType === 'generate_pdf') {
        const resp = await api.generatePdf(payload);
        setActionFeedback((prev) => ({
          ...prev,
          [msgId]: `Relatório '${resp.file_name}' gerado pelo ReportLab!`,
        }));
        window.open(resp.file_url, '_blank');
      } else if (actionType === 'send_email') {
        await api.sendEmail({ ...payload, confirm: true });
        setActionFeedback((prev) => ({
          ...prev,
          [msgId]: `E-mail validado e disparado com sucesso!`,
        }));
      } else if (actionType === 'financial_calc') {
        const resp = await api.calculate(payload);
        setActionFeedback((prev) => ({
          ...prev,
          [msgId]: `Cálculos concluídos! Margem Bruta: ${resp.results?.gross_margin_percent}%, ROI: ${resp.results?.roi_percent}%.`,
        }));
      } else if (actionType === 'file_organize') {
        const resp = await api.organizeFiles({ ...payload, confirm: true });
        setActionFeedback((prev) => ({
          ...prev,
          [msgId]: resp.message,
        }));
      }
    } catch (err: any) {
      setActionFeedback((prev) => ({
        ...prev,
        [msgId]: `Erro na execução: ${err.message}`,
      }));
    } finally {
      setExecutingActionId(null);
    }
  };

  const quickPrompts = activeMode === 'empresa'
    ? [
        { label: '📊 Planilha DRE Corporativo', prompt: 'Gere uma planilha de DRE corporativo em Excel (.xlsx)' },
        { label: '📄 Proposta Comercial Word', prompt: 'Crie uma minuta de proposta comercial executiva em Word (.docx)' },
        { label: '📑 Relatório Executivo PDF', prompt: 'Gere um relatório analítico executivo em PDF' },
        { label: '✉️ Minuta de E-mail para Clientes', prompt: 'Prepare um e-mail formal de fechamento de projeto com prévia' },
        { label: '🧮 Simulação Financeira e ROI', prompt: 'Calcule a margem e ROI para um investimento de 50 mil' },
      ]
    : [
        { label: '📁 Organizar Pasta de Downloads', prompt: 'Como posso organizar os arquivos da minha pasta de Downloads?' },
        { label: '📝 Planejamento Pessoal Word', prompt: 'Gere um documento de metas e planejamento pessoal em Word (.docx)' },
        { label: '💰 Planilha de Despesas Pessoais', prompt: 'Crie uma planilha de controle financeiro pessoal em Excel (.xlsx)' },
        { label: '✉️ E-mail Cotidiano', prompt: 'Redija um e-mail de cancelamento ou solicitação de reembolso com prévia' },
      ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-65px)] md:h-screen bg-[#070b14] overflow-hidden">
      {/* Top Bar inside Chat */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#090e1c]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center p-1.5 shadow">
            <img src="/logo.png" alt="Verity AI" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Assistente Verity AI</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Modo Atual:{' '}
              <span className="font-semibold text-cyan-400">
                {activeMode === 'empresa' ? '🏢 Modo Empresa' : '💻 Modo Normal'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMode}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Alternar para {activeMode === 'empresa' ? 'Modo Normal' : 'Modo Empresa'}
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center p-1 shrink-0 shadow mt-1">
                  <img src="/logo.png" alt="Verity" className="w-full h-full object-contain" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl px-5 py-4 text-sm leading-relaxed space-y-3 ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-lg'
                }`}
              >
                {/* Content text */}
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {/* Embedded Action Card */}
                {msg.action_type && msg.action_payload && (
                  <div className="mt-3 p-4 rounded-xl bg-[#060a14] border border-cyan-500/30 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        {msg.action_type === 'generate_xlsx' && <FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
                        {msg.action_type === 'generate_docx' && <FileText className="w-4 h-4 text-blue-400" />}
                        {msg.action_type === 'generate_pdf' && <FileDown className="w-4 h-4 text-red-400" />}
                        {msg.action_type === 'send_email' && <Mail className="w-4 h-4 text-amber-400" />}
                        {msg.action_type === 'financial_calc' && <Calculator className="w-4 h-4 text-cyan-400" />}
                        {msg.action_type === 'file_organize' && <FolderSync className="w-4 h-4 text-purple-400" />}
                        <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          {msg.action_type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-cyan-400 font-mono">Automação Pronta</span>
                    </div>

                    {/* Preview details */}
                    <div className="text-xs font-mono text-slate-400 space-y-1 bg-slate-950/80 p-2.5 rounded-lg border border-slate-900">
                      {msg.action_payload.filename && (
                        <p>
                          <span className="text-slate-500">Arquivo:</span>{' '}
                          <span className="text-cyan-300 font-semibold">{msg.action_payload.filename}</span>
                        </p>
                      )}
                      {msg.action_payload.title && (
                        <p>
                          <span className="text-slate-500">Título:</span>{' '}
                          <span className="text-slate-200">{msg.action_payload.title}</span>
                        </p>
                      )}
                      {msg.action_payload.recipient && (
                        <p>
                          <span className="text-slate-500">Destinatário:</span>{' '}
                          <span className="text-amber-300">{msg.action_payload.recipient}</span>
                        </p>
                      )}
                    </div>

                    {/* Feedback message */}
                    {actionFeedback[msg.id] && (
                      <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>{actionFeedback[msg.id]}</span>
                      </div>
                    )}

                    {/* Action button */}
                    <button
                      type="button"
                      disabled={executingActionId === msg.id}
                      onClick={() => handleExecuteCardAction(msg.id, msg.action_type!, msg.action_payload)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-colors disabled:opacity-50"
                    >
                      {executingActionId === msg.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Executando automação...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>
                            {msg.action_type.startsWith('generate')
                              ? 'Gerar e Baixar Arquivo'
                              : msg.action_type === 'send_email'
                              ? 'Confirmar Envio de E-mail'
                              : 'Executar Automação'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'EU'}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center p-1 shrink-0 shadow">
              <img src="/logo.png" alt="Verity" className="w-full h-full object-contain" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-cyan-400 flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>A IA está processando seu comando e estruturando a automação...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Area: Quick chips & Input bar */}
      <div className="p-4 bg-[#090e1c] border-t border-slate-800 space-y-3">
        {/* Quick Prompts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-500 font-semibold uppercase text-[10px] shrink-0">
            Sugestões Rápidas:
          </span>
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(item.prompt)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 shrink-0 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={
                activeMode === 'empresa'
                  ? 'Ex: Crie uma planilha de vendas em Excel ou elabore uma minuta de proposta em Word...'
                  : 'Ex: Como organizar minha pasta de Downloads ou crie uma lista de tarefas em Word...'
              }
              className="w-full pl-4 pr-12 py-3.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm shadow-inner"
            />
          </div>

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
