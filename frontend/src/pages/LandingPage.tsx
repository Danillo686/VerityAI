import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import {
  Sparkles,
  Building2,
  Laptop,
  FileSpreadsheet,
  FileText,
  FileDown,
  Mail,
  Calculator,
  FolderSync,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'empresa' | 'normal'>('empresa');
  const [demoPrompt, setDemoPrompt] = useState('Gere uma planilha de projeção de vendas');
  const [demoResponse, setDemoResponse] = useState<any>({
    text: 'Criei o demonstrativo financeiro corporativo com fórmulas automáticas de soma e formatação monetária padrão Verity AI.',
    type: 'xlsx',
    filename: 'projecao_vendas_2026.xlsx',
    badge: 'Automação Real em Python (openpyxl)',
  });
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // FAQ states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const triggerDemo = (promptText: string, type: string, filename: string, text: string, badge: string) => {
    setDemoPrompt(promptText);
    setIsDemoLoading(true);
    setTimeout(() => {
      setDemoResponse({
        text,
        type,
        filename,
        badge,
      });
      setIsDemoLoading(false);
    }, 400);
  };

  const faqs = [
    {
      q: 'Como funciona o isolamento e segurança dos meus arquivos?',
      a: 'A Verity AI adota um modelo estrito de sandbox com proteção contra path traversal. A automação de arquivos opera exclusivamente dentro dos diretórios que você autorizar expressamente. Operações de mover ou organizar arquivos exigem confirmação prévia.',
    },
    {
      q: 'É necessário ter chave de API paga da OpenAI para usar a plataforma?',
      a: 'Não! Todas as ferramentas de automação (Word, Excel, PDF, cálculos e arquivos) funcionam 100% de forma autônoma com nossos motores internos em Rust e Python. O chat possui um motor inteligente contextual e também aceita chaves de IA externas caso você queira adicioná-las no backend.',
    },
    {
      q: 'O que diferencia o Modo Empresa do Modo Normal?',
      a: 'O Modo Empresa é focado em inteligência corporativa: demonstrativos DRE, minutas contratuais em Word, relatórios analíticos para diretoria e e-mails executivos. Já o Modo Normal prioriza a produtividade do seu computador diário: organizar a pasta de Downloads, orçamentos pessoais e controle de rotinas.',
    },
    {
      q: 'Como funciona o envio de e-mails?',
      a: 'Por segurança máxima, nenhum e-mail é disparado sem a sua aprovação explícita. O sistema apresenta a minuta completa em tela e, se as credenciais SMTP não estiverem configuradas, o sistema executa em modo de simulação transparente.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/20 via-blue-700/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-yellow-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-yellow-400 animate-ping"></span>
              <span>Inteligência Artificial & Automações Conectadas</span>
            </div>

            {/* Slogan Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Sua empresa.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                Seu computador.
              </span>{' '}
              <br className="hidden sm:inline" />
              Sua IA.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              A plataforma definitiva que une o poder da IA generativa a automações de verdade. 
              Gere planilhas Excel estruturadas, documentos Word, relatórios em PDF e organize seus arquivos sem complicações.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-cyan-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
                Começar Agora
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <a
                href="#funcionalidades"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base transition-colors"
              >
                Conhecer Funcionalidades
              </a>
            </div>
          </div>

          {/* Interactive Live AI Preview Widget */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl glass-panel p-4 sm:p-6 shadow-2xl relative border border-cyan-500/25">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="Verity Logo" className="w-7 h-7 object-contain" />
                <span className="text-sm font-bold text-white tracking-wide">
                  Demonstração Interativa Verity AI
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  Engine Ao Vivo
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
              </div>
            </div>

            {/* Prompt Quick Chips */}
            <div className="py-3 flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 self-center font-medium mr-1">Experimente:</span>
              <button
                onClick={() =>
                  triggerDemo(
                    'Gere uma planilha de projeção de vendas',
                    'xlsx',
                    'projecao_vendas_2026.xlsx',
                    'Estruturei a planilha financeira corporativa em formato Excel (.xlsx) com fórmulas automáticas de soma e formatação monetária pronta para apresentação.',
                    'Automação Real em Python (openpyxl)'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50 text-slate-300 transition-colors"
              >
                📊 Planilha de Vendas (.xlsx)
              </button>
              <button
                onClick={() =>
                  triggerDemo(
                    'Crie uma proposta comercial formal em Word',
                    'docx',
                    'proposta_comercial_verity.docx',
                    'Redigi o documento em Word (.docx) com cabeçalhos estruturados, sumário executivo, escopo dos serviços e padronização visual corporativa.',
                    'Automação Real em Python (python-docx)'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50 text-slate-300 transition-colors"
              >
                📄 Proposta Comercial (.docx)
              </button>
              <button
                onClick={() =>
                  triggerDemo(
                    'Gere um relatório executivo em PDF',
                    'pdf',
                    'relatorio_executivo_mensal.pdf',
                    'Gerei o relatório executivo em PDF com sumário analítico, linhas de destaque e diagnóstico de produtividade formatado pelo ReportLab.',
                    'Automação Real em Python (reportlab)'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50 text-slate-300 transition-colors"
              >
                📑 Relatório em PDF (.pdf)
              </button>
              <button
                onClick={() =>
                  triggerDemo(
                    'Calcule a margem e ROI de um projeto',
                    'calc',
                    'calculo_roi.json',
                    'Projeção calculada: Receita R$ 150.000, Custos R$ 65.000, Margem Bruta de 56,67% e ROI projetado de 70,00% sobre o investimento inicial.',
                    'Motor Analítico em Rust Tokio'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50 text-slate-300 transition-colors"
              >
                🧮 Simulação de ROI
              </button>
            </div>

            {/* Chat Body Mock */}
            <div className="bg-[#090d18] rounded-xl p-4 space-y-4 border border-slate-800/90 min-h-[170px] flex flex-col justify-center">
              {/* User message */}
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-none text-sm max-w-md shadow-md">
                  {demoPrompt}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  EU
                </div>
              </div>

              {/* AI message */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center p-0.5 shrink-0 shadow">
                  <img src="/logo.png" alt="Verity Logo" className="w-full h-full object-contain" />
                </div>
                <div className="bg-slate-800/90 border border-slate-700/80 px-4 py-3 rounded-2xl rounded-tl-none text-sm text-slate-200 max-w-lg space-y-3">
                  {isDemoLoading ? (
                    <div className="flex items-center gap-2 text-cyan-400 py-1">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                      <span className="text-xs text-slate-400 font-mono">Processando automação...</span>
                    </div>
                  ) : (
                    <>
                      <p className="leading-relaxed">{demoResponse.text}</p>
                      
                      {/* Generated Action Card */}
                      <div className="bg-slate-900/90 rounded-xl p-3 border border-cyan-500/30 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                            {demoResponse.type === 'xlsx' && <FileSpreadsheet className="w-5 h-5 text-emerald-400" />}
                            {demoResponse.type === 'docx' && <FileText className="w-5 h-5 text-blue-400" />}
                            {demoResponse.type === 'pdf' && <FileDown className="w-5 h-5 text-red-400" />}
                            {demoResponse.type === 'calc' && <Calculator className="w-5 h-5 text-yellow-400" />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white font-mono">
                              {demoResponse.filename}
                            </p>
                            <span className="text-[10px] text-cyan-400 font-mono">
                              {demoResponse.badge}
                            </span>
                          </div>
                        </div>

                        <Link
                          to="/dashboard"
                          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Testar no Painel
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL MODE SECTION (Modo Empresa vs Modo Normal) */}
      <section id="modos" className="py-20 bg-[#090e1c] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Dois Modos Poderosos. Uma Só Inteligência.
            </h2>
            <p className="mt-4 text-slate-300 text-base leading-relaxed">
              Alterne instantaneamente a inteligência da Verity AI de acordo com o seu momento: 
              administre sua empresa com rigor executivo ou turbine a organização diária do seu computador pessoal.
            </p>

            {/* Toggle Switch */}
            <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-700/80">
              <button
                onClick={() => setActiveTab('empresa')}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === 'empresa'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Modo Empresa
              </button>
              <button
                onClick={() => setActiveTab('normal')}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === 'normal'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-4 h-4" />
                Modo Normal
              </button>
            </div>
          </div>

          {/* Mode Card Content */}
          <div className="max-w-5xl mx-auto">
            {activeTab === 'empresa' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/60 rounded-3xl p-6 sm:p-10 border border-cyan-500/30">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950 text-cyan-400 text-xs font-semibold uppercase tracking-wider border border-cyan-800/80">
                    <Building2 className="w-3.5 h-3.5" />
                    Para Negócios, Startups & Departamentos
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    Modo Empresa: Gestão, Finanças e Governança
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Projetado para quem precisa de velocidade executiva sem abrir mão da exatidão matemática e da conformidade documental:
                  </p>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>Planilhas e Demonstrativos Financeiros:</strong> DRE, fluxo de caixa e projeções com fórmulas Excel (.xlsx).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>Relatórios Executivos em PDF:</strong> Diagnósticos prontos para diretoria e investidores.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>Propostas e Documentos Word:</strong> Minutas padronizadas em .docx com sumários e cabeçalhos.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>E-mails Corporativos com Validação:</strong> Redação assertiva e revisão prévia antes do disparo.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>Cálculos e Indicadores:</strong> Margem Bruta, EBITDA e simulações de ROI.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Link
                      to="/register?mode=empresa"
                      className="inline-flex items-center gap-2 text-cyan-400 font-semibold text-sm hover:text-cyan-300"
                    >
                      Ativar Modo Empresa na sua conta <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-mono text-cyan-400">STATUS EXECUTIVO</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                      100% OPERACIONAL
                    </span>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <p className="text-slate-400">// Planilha DRE Corporativo</p>
                      <p className="text-cyan-300 font-semibold">receita: R$ 150.000,00 | margem: 56,67%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <p className="text-slate-400">// Minuta de Contrato</p>
                      <p className="text-emerald-300 font-semibold">proposta_comercial_verity.docx [Gerado]</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <p className="text-slate-400">// Relatório em PDF</p>
                      <p className="text-blue-300 font-semibold">relatorio_executivo_verity.pdf [Exportado]</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/60 rounded-3xl p-6 sm:p-10 border border-blue-500/30">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950 text-blue-400 text-xs font-semibold uppercase tracking-wider border border-blue-800/80">
                    <Laptop className="w-3.5 h-3.5" />
                    Para Usuários Comuns & Produtividade Diária
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    Modo Normal: O Copiloto do Seu Computador
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Sua rotina pessoal simplificada por inteligência artificial. Acabe com a bagunça nas suas pastas e economize horas de trabalho repetitivo:
                  </p>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Organização de Arquivos:</strong> Limpeza e triagem automática da sua pasta de Downloads e Documentos por extensão.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Documentos e Anotações em Word:</strong> Textos pessoais, resumos e cartas formais prontos em .docx.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Planilhas Pessoais:</strong> Controle de despesas, contas domésticas e orçamentos em .xlsx.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Agendas e Listas de Tarefas:</strong> Planejamento diário integrado ao painel.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>E-mails do Dia a Dia:</strong> Redija mensagens assertivas para bancos, fornecedores e faculdade.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Link
                      to="/register?mode=normal"
                      className="inline-flex items-center gap-2 text-blue-400 font-semibold text-sm hover:text-blue-300"
                    >
                      Começar no Modo Normal <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-mono text-blue-400">ORGANIZAÇÃO DO SISTEMA</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-mono">
                      SANDBOX PROTEGIDA
                    </span>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <p className="text-slate-400">// Pasta Autorizada: Downloads</p>
                      <p className="text-blue-300 font-semibold">18 arquivos movidos para /Documentos e /Imagens</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <p className="text-slate-400">// Planilha Doméstica</p>
                      <p className="text-emerald-300 font-semibold">orcamento_mensal_pessoal.xlsx [Criado]</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <p className="text-slate-400">// E-mail Preparado</p>
                      <p className="text-cyan-300 font-semibold">solicitacao_reembolso.eml [Revisado]</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. FUNCIONALIDADES PRINCIPAIS */}
      <section id="funcionalidades" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-cyan-400 font-semibold text-sm tracking-wider uppercase">
            Automações de Verdade
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
            Muito Mais que Respostas de Texto.
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            A Verity AI não fica só na conversa. Ela entrega arquivos formatados, cálculos executados e automações prontas para download imediato.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Word */}
          <div className="glass-card rounded-2xl p-6 transition-all duration-300 border border-slate-800 hover:border-cyan-500/40">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 text-blue-400 flex items-center justify-center mb-5 border border-blue-800/60">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Documentos Word (.docx)</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Geração de documentos formatados com python-docx. Criação de propostas, minutas contratuais e ofícios com paginação e cabeçalhos.
            </p>
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Download instantâneo .docx
            </div>
          </div>

          {/* Card 2: Excel */}
          <div className="glass-card rounded-2xl p-6 transition-all duration-300 border border-slate-800 hover:border-cyan-500/40">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-800/60">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Planilhas Excel (.xlsx)</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Estruturação automática via openpyxl. Cabeçalhos com paleta navy/cyan, colunas auto-ajustadas e fórmulas nativas de soma e média.
            </p>
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Fórmulas reais e formatação
            </div>
          </div>

          {/* Card 3: PDF */}
          <div className="glass-card rounded-2xl p-6 transition-all duration-300 border border-slate-800 hover:border-cyan-500/40">
            <div className="w-12 h-12 rounded-xl bg-red-950/80 text-red-400 flex items-center justify-center mb-5 border border-red-800/60">
              <FileDown className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Relatórios PDF</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Diagramação profissional via ReportLab. Emissão de relatórios analíticos com sumário, metadados e avisos institucionais.
            </p>
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Diagramação vetorial nítida
            </div>
          </div>

          {/* Card 4: Email */}
          <div className="glass-card rounded-2xl p-6 transition-all duration-300 border border-slate-800 hover:border-cyan-500/40">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 text-amber-400 flex items-center justify-center mb-5 border border-amber-800/60">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">E-mails com Prévia e Confirmação</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Validação rígida de destinatário e conteúdo. Exibição de prévia completa e exigência de autorização explícita antes do envio via SMTP.
            </p>
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Zero disparos acidentais
            </div>
          </div>

          {/* Card 5: Cálculos */}
          <div className="glass-card rounded-2xl p-6 transition-all duration-300 border border-slate-800 hover:border-cyan-500/40">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-800/60">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Cálculos e DRE Financeiro</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Processamento em alta velocidade de margens, deduções tributárias, EBITDA e projeções de retorno sobre investimento (ROI).
            </p>
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Núcleo Rust assíncrono
            </div>
          </div>

          {/* Card 6: Arquivos */}
          <div className="glass-card rounded-2xl p-6 transition-all duration-300 border border-slate-800 hover:border-cyan-500/40">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-800/60">
              <FolderSync className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Organização em Pasta Segura</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Triagem e classificação de arquivos por categoria em diretórios locais autorizados pelo usuário, com blindagem contra path traversal.
            </p>
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Diretórios sob seu controle
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-[#060a14] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-cyan-400 font-semibold text-sm tracking-wider uppercase">
              Simples & Poderoso
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Como a Verity AI Funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-extrabold text-xl flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Solicite ou Escolha o Modo</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Converse no chat da IA ou abra o painel de automações dedicadas. Escolha entre o Modo Empresa ou o Modo Normal conforme sua tarefa.
              </p>
            </div>

            <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-extrabold text-xl flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="text-lg font-bold text-white">A Verity AI Executa</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Nossos microsserviços em Rust e Python estruturam os dados, aplicam validações de segurança e geram os artefatos reais solicitados.
              </p>
            </div>

            <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-extrabold text-xl flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Revise e Baixe</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Baixe seu arquivo .xlsx, .docx ou .pdf com um clique. Para e-mails ou arquivos no computador, aprove a ação com prévia antes da execução.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PLANOS E PREÇOS */}
      <section id="precos" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-cyan-400 font-semibold text-sm tracking-wider uppercase">
            Transparência Total
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
            Planos e Preços
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Escolha o pacote ideal para a sua rotina ou para a operação completa do seu time corporativo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Plano 1: Usuário Comum — US$ 90 */}
          <div className="glass-card rounded-3xl p-8 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-6">
              <div className="inline-flex px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                Para Você e seu PC
              </div>
              <h3 className="text-2xl font-bold text-white">Usuário Comum</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">US$ 90</span>
              </div>
              <p className="text-slate-400 text-sm">
                Ideal para otimizar o computador pessoal, organizar pastas, gerar planilhas domésticas e minutas de documentos.
              </p>
              <ul className="space-y-3 text-sm text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Modo Normal completo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Organização de pastas autorizadas</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Geração de arquivos Word (.docx)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Planilhas Excel de despesas (.xlsx)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Minutas de e-mails com prévia</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                to="/register?plan=comum"
                className="w-full inline-flex items-center justify-center py-3 rounded-xl border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-bold text-sm transition-colors"
              >
                Escolher Usuário Comum
              </Link>
            </div>
          </div>

          {/* Plano 2: Empresa Solo — US$ 200 (Popular) */}
          <div className="glass-card rounded-3xl p-8 border-2 border-cyan-500 flex flex-col justify-between relative shadow-2xl shadow-cyan-500/15">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow">
              Mais Recomendado
            </div>

            <div className="space-y-6">
              <div className="inline-flex px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-semibold border border-cyan-800">
                Profissionais & PMEs
              </div>
              <h3 className="text-2xl font-bold text-white">Empresa Solo</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">US$ 200</span>
              </div>
              <p className="text-slate-300 text-sm">
                Autonomia administrativa total para consultores, empreendedores individuais e líderes de negócio.
              </p>
              <ul className="space-y-3 text-sm text-slate-200 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span><strong>Modo Empresa e Modo Normal</strong> inclusos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Demonstrativos DRE e fluxo de caixa (.xlsx)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Relatórios Executivos em PDF ilimitados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Simulador de ROI e cálculos tributários</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Suporte prioritário e histórico ilimitado</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                to="/register?plan=solo"
                className="w-full inline-flex items-center justify-center py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
              >
                Escolher Empresa Solo
              </Link>
            </div>
          </div>

          {/* Plano 3: Empresa Equipe — US$ 700 */}
          <div className="glass-card rounded-3xl p-8 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-6">
              <div className="inline-flex px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                Para Departamentos & Equipes
              </div>
              <h3 className="text-2xl font-bold text-white">Empresa Equipe</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">US$ 700</span>
              </div>
              <p className="text-slate-400 text-sm">
                Potência corporativa completa com múltiplos assentos, auditoria de tarefas e suporte direto à implantação.
              </p>
              <ul className="space-y-3 text-sm text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Todos os recursos do plano Solo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Gestão colaborativa de tarefas e arquivos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Conexão direta a PostgreSQL corporativo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Políticas customizadas de retenção e limpeza</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>SLA dedicado de suporte corporativo</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                to="/register?plan=equipe"
                className="w-full inline-flex items-center justify-center py-3 rounded-xl border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-bold text-sm transition-colors"
              >
                Escolher Empresa Equipe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PERGUNTAS FREQUENTES (FAQ) */}
      <section id="faq" className="py-20 bg-[#060a14] border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-cyan-400 font-semibold text-sm tracking-wider uppercase">
              Tire Suas Dúvidas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-white text-base hover:text-cyan-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Pronto para automatizar suas rotinas hoje?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-base">
            Crie sua conta na Verity AI e experimente a diferença de ter uma IA que realmente executa tarefas no seu computador e na sua empresa.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-cyan-500/25 transition-all"
            >
              Criar Conta Gratuita de Demonstração
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
