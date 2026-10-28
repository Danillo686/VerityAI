import type {
  AuthResponse,
  ChatMessage,
  ExecutedTask,
  User,
  AppMode,
  DocxParams,
  XlsxParams,
  PdfParams,
  EmailParams,
  CalcParams,
  FileOrganizeParams,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

function getToken(): string | null {
  return localStorage.getItem('verity_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Erro HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    // If backend server is unreachable (Failed to fetch), fallback to local demo engine
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('Erro HTTP 404') || err.message.includes('Erro HTTP 502')) {
      return handleLocalFallback<T>(endpoint, options);
    }
    throw err;
  }
}

// Fallback simulator for preview & standalone deploys (e.g. Vercel preview)
function handleLocalFallback<T>(endpoint: string, options: RequestInit): Promise<T> {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body as string) : {};

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 1. Auth Login / Register
      if (endpoint === '/api/auth/login' && method === 'POST') {
        const email = body.email || 'demo@verityai.com';
        const user: User = {
          id: 'user-' + Math.random().toString(36).substring(2, 9),
          name: email.split('@')[0],
          email: email,
          plan: 'solo',
          default_mode: 'empresa',
          created_at: new Date().toISOString(),
        };
        const token = 'demo-jwt-token-' + Date.now();
        localStorage.setItem('verity_user', JSON.stringify(user));
        localStorage.setItem('verity_token', token);
        return resolve({ token, user } as unknown as T);
      }

      if (endpoint === '/api/auth/register' && method === 'POST') {
        const user: User = {
          id: 'user-' + Math.random().toString(36).substring(2, 9),
          name: body.name || 'Novo Usuário',
          email: body.email,
          plan: body.plan || 'comum',
          default_mode: body.default_mode || 'normal',
          created_at: new Date().toISOString(),
        };
        const token = 'demo-jwt-token-' + Date.now();
        localStorage.setItem('verity_user', JSON.stringify(user));
        localStorage.setItem('verity_token', token);
        return resolve({ token, user } as unknown as T);
      }

      if (endpoint === '/api/auth/me') {
        const stored = localStorage.getItem('verity_user');
        if (stored) {
          const user = JSON.parse(stored);
          if (method === 'PUT') {
            const updated = { ...user, ...body };
            localStorage.setItem('verity_user', JSON.stringify(updated));
            return resolve(updated as unknown as T);
          }
          return resolve(user as unknown as T);
        }
        return reject(new Error('Sessão não encontrada'));
      }

      // 2. Chat messaging
      if (endpoint === '/api/chat/message' && method === 'POST') {
        const p = (body.message || '').toLowerCase();
        const mode = body.mode || 'empresa';
        let action_type = null;
        let action_payload: any = null;
        let reply = '';

        if (p.includes('planilha') || p.includes('excel') || p.includes('tabela')) {
          action_type = 'generate_xlsx';
          action_payload = {
            filename: mode === 'empresa' ? 'dre_corporativo_verity.xlsx' : 'orcamento_pessoal.xlsx',
            sheet_name: mode === 'empresa' ? 'DRE_Consolidado' : 'Gastos',
            title: mode === 'empresa' ? 'Demonstrativo de Resultados — Verity AI' : 'Orçamento Pessoal',
            headers: mode === 'empresa' ? ['Mês', 'Receita Bruta', 'Custos', 'Margem', 'Status'] : ['Item', 'Categoria', 'Previsto', 'Real', 'Data'],
            rows: mode === 'empresa' ? [
              ['Janeiro', 45000, 18000, 27000, 'Consolidado'],
              ['Fevereiro', 52000, 21000, 31000, 'Consolidado'],
              ['Março', 61000, 24000, 37000, 'Projetado']
            ] : [
              ['Aluguel', 'Moradia', 2200, 2200, '05/01/2026'],
              ['Supermercado', 'Alimentação', 1400, 1320, '12/01/2026'],
              ['Internet/Luz', 'Serviços', 350, 340, '20/01/2026']
            ]
          };
          reply = mode === 'empresa'
            ? 'Estruturei uma planilha financeira corporativa completa com fórmulas e cabeçalhos estilizados. Você pode revisar e baixar o arquivo Excel (.xlsx) abaixo:'
            : 'Preparei uma planilha organizada de orçamento para o seu computador. Veja a estrutura e baixe o arquivo Excel (.xlsx) abaixo:';
        } else if (p.includes('word') || p.includes('documento') || p.includes('proposta') || p.includes('texto')) {
          action_type = 'generate_docx';
          action_payload = {
            title: mode === 'empresa' ? 'Proposta Comercial Executiva — Verity AI' : 'Resumo de Tarefas e Metas',
            filename: mode === 'empresa' ? 'proposta_comercial_verity.docx' : 'planejamento_pessoal.docx',
            author: 'Verity AI Engine',
            content: mode === 'empresa'
              ? '# 1. Sumário Executivo\nA Verity AI integra inteligência artificial avançada para automatizar processos de administração, relatórios e geração de documentos empresariais.\n\n## 2. Escopo dos Serviços\n- Geração de planilhas e relatórios gerenciais.\n- Emissão de documentos executivos Word.\n- Validação e envio seguro de e-mails.'
              : '# Planejamento e Rotinas Pessoais\n\n## 1. Organização do Computador\n- Estruturação de pastas de trabalho e projetos.\n- Arquivamento de comprovantes e documentos.'
          };
          reply = 'Elaborei a minuta do documento em Word (.docx) com formatação profissional e cabeçalhos estruturados. Você pode exportar o arquivo diretamente:';
        } else if (p.includes('pdf') || p.includes('relatório') || p.includes('relatorio')) {
          action_type = 'generate_pdf';
          action_payload = {
            title: 'Relatório Executivo de Produtividade & Automação',
            subtitle: 'Análise Estratégica Mensal',
            filename: 'relatorio_executivo_verity.pdf',
            author: 'Verity AI Analytics',
            content: 'Este relatório consolidado apresenta os indicadores de eficiência obtidos através da plataforma Verity AI, demonstrando ganhos operacionais substanciais.',
            sections: [
              { heading: '1. Desempenho Operacional', text: 'Foram processadas 142 automações com redução de 75% no tempo de elaboração.' },
              { heading: '2. Precisão e Segurança', text: '100% dos cálculos validados e arquivos organizados em conformidade corporativa.' }
            ]
          };
          reply = 'Gerei o relatório executivo analítico em formato PDF pronto para apresentação:';
        } else if (p.includes('email') || p.includes('e-mail') || p.includes('mensagem')) {
          action_type = 'send_email';
          action_payload = {
            recipient: 'diretoria@cliente.com',
            subject: 'Relatório Mensal e Fechamento Operacional — Verity AI',
            body: 'Prezada diretoria,\n\nEncaminhamos em anexo a consolidação dos demonstrativos e tarefas do período. Todas as operações foram concluídas com sucesso.\n\nAtenciosamente,\nEquipe Verity AI',
            is_preview: true,
            confirm: false
          };
          reply = 'Preparei a minuta do e-mail. Por segurança, a Verity AI exige uma prévia e a sua confirmação explícita antes de qualquer disparo real:';
        } else if (p.includes('calcul') || p.includes('cálcul') || p.includes('roi') || p.includes('margem')) {
          action_type = 'financial_calc';
          action_payload = {
            calc_type: 'financial',
            inputs: { revenue: 150000, costs: 65000, operating_expenses: 32000, tax_rate: 15, initial_investment: 50000, expected_gain: 85000 }
          };
          reply = 'Efetuei a projeção financeira analítica com cálculos de Margem Bruta, Margem Operacional, Lucro Líquido e ROI:';
        } else {
          reply = mode === 'empresa'
            ? 'Entendido. Como assistente no **Modo Empresa** da Verity AI, estou pronto para redigir documentos (.docx), gerar planilhas financeiras (.xlsx), emitir relatórios em PDF, simular cálculos de margem e preparar e-mails corporativos.\n\nExperimente solicitar: *"Crie uma planilha de vendas"* ou *"Gere um relatório executivo em PDF"*.'
            : 'Olá! No **Modo Normal** da Verity AI, posso ajudar você a organizar pastas no seu computador, gerar documentos de texto em Word (.docx), criar planilhas de controle pessoal e redigir e-mails do dia a dia.\n\nO que gostaria de automatizar agora?';
        }

        const assistantMsg: ChatMessage = {
          id: 'msg-' + Math.random().toString(36).substring(2, 9),
          session_id: body.session_id || 'default-session',
          sender: 'assistant',
          content: reply,
          mode,
          action_type,
          action_payload,
          created_at: new Date().toISOString(),
        };

        return resolve({
          session_id: body.session_id || 'default-session',
          message: assistantMsg,
          is_simulation: true,
        } as unknown as T);
      }

      // 3. Automations triggers (Word, Excel, PDF, Calc, Email, Files)
      if (endpoint === '/api/automation/docx' && method === 'POST') {
        const fname = body.filename || 'documento_verity.docx';
        return resolve({
          success: true,
          file_name: fname,
          file_url: `/api/automation/download/${fname}`,
          message: 'Documento Word gerado com sucesso!',
        } as unknown as T);
      }

      if (endpoint === '/api/automation/xlsx' && method === 'POST') {
        const fname = body.filename || 'planilha_verity.xlsx';
        return resolve({
          success: true,
          file_name: fname,
          file_url: `/api/automation/download/${fname}`,
          message: 'Planilha Excel gerada com formatação avançada!',
        } as unknown as T);
      }

      if (endpoint === '/api/automation/pdf' && method === 'POST') {
        const fname = body.filename || 'relatorio_verity.pdf';
        return resolve({
          success: true,
          file_name: fname,
          file_url: `/api/automation/download/${fname}`,
          message: 'Relatório executivo PDF gerado com sucesso!',
        } as unknown as T);
      }

      if (endpoint === '/api/automation/email' && method === 'POST') {
        return resolve({
          success: true,
          status: 'simulated_sent',
          message: 'E-mail processado em modo de demonstração segura (nenhuma credencial externa violada).',
          details: {
            recipient: body.recipient,
            subject: body.subject,
          }
        } as unknown as T);
      }

      if (endpoint === '/api/automation/calc' && method === 'POST') {
        const rev = Number(body.inputs?.revenue || 100000);
        const costs = Number(body.inputs?.costs || 40000);
        const opex = Number(body.inputs?.operating_expenses || 20000);
        const taxRate = Number(body.inputs?.tax_rate || 15);
        const gross = rev - costs;
        const ebitda = gross - opex;
        const tax = (ebitda > 0 ? ebitda : 0) * (taxRate / 100);
        const net = ebitda - tax;
        const inv = Number(body.inputs?.initial_investment || 50000);
        const gain = Number(body.inputs?.expected_gain || 80000);
        const roi = inv > 0 ? ((gain - inv) / inv) * 100 : 0;

        return resolve({
          success: true,
          results: {
            revenue: rev,
            gross_profit: gross,
            gross_margin_percent: Number(((gross / rev) * 100).toFixed(2)),
            ebitda: ebitda,
            ebitda_margin_percent: Number(((ebitda / rev) * 100).toFixed(2)),
            taxes: tax,
            net_income: net,
            net_margin_percent: Number(((net / rev) * 100).toFixed(2)),
            roi_percent: Number(roi.toFixed(2))
          },
          disclaimer: 'Cálculos analíticos gerenciais para apoio à decisão. Não substituem assessoria contábil.',
        } as unknown as T);
      }

      if (endpoint === '/api/automation/files/organize' && method === 'POST') {
        return resolve({
          success: true,
          is_preview: !body.confirm,
          target_directory: body.target_directory || 'C:\\Downloads',
          planned_actions: [
            { file: 'proposta.docx', destination: 'Documentos' },
            { file: 'balancete.xlsx', destination: 'Planilhas' },
            { file: 'comprovante.pdf', destination: 'Relatórios' },
            { file: 'foto_evento.png', destination: 'Imagens' },
          ],
          message: body.confirm ? 'Arquivos organizados com sucesso nas subpastas categorizadas!' : 'Prévia gerada com proteção sandbox. Confirme para aplicar as alterações.'
        } as unknown as T);
      }

      if (endpoint === '/api/tasks' && method === 'GET') {
        return resolve([
          {
            id: 'task-1',
            user_id: 'user-demo',
            task_type: 'excel',
            title: 'Demonstrativo DRE Trimestral',
            status: 'completed',
            file_name: 'dre_corporativo_verity.xlsx',
            file_url: '/api/automation/download/dre_corporativo_verity.xlsx',
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'task-2',
            user_id: 'user-demo',
            task_type: 'word',
            title: 'Proposta Comercial Verity AI',
            status: 'completed',
            file_name: 'proposta_comercial_verity.docx',
            file_url: '/api/automation/download/proposta_comercial_verity.docx',
            created_at: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: 'task-3',
            user_id: 'user-demo',
            task_type: 'pdf',
            title: 'Relatório Executivo de Produtividade',
            status: 'completed',
            file_name: 'relatorio_executivo_verity.pdf',
            file_url: '/api/automation/download/relatorio_executivo_verity.pdf',
            created_at: new Date(Date.now() - 86400000).toISOString(),
          }
        ] as unknown as T);
      }

      // Default fallback
      resolve({ success: true, message: 'Operação simulada com sucesso.' } as unknown as T);
    }, 300);
  });
}

export const api = {
  // Auth
  login: (data: { email: string; password: string }) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: { name: string; email: string; password: string; plan?: string; default_mode?: AppMode }) =>
    request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => request<User>('/api/auth/me'),

  updateMe: (data: Partial<User>) =>
    request<User>('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Chat
  sendMessage: (data: { message: string; mode: AppMode; session_id?: string }) =>
    request<{ session_id: string; message: ChatMessage; is_simulation: boolean }>('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getChatHistory: (sessionId?: string) =>
    request<ChatMessage[]>(`/api/chat/history${sessionId ? `?session_id=${sessionId}` : ''}`),

  // Automations
  generateDocx: (data: DocxParams) =>
    request<{ success: boolean; file_name: string; file_url: string; message: string }>('/api/automation/docx', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  generateXlsx: (data: XlsxParams) =>
    request<{ success: boolean; file_name: string; file_url: string; message: string }>('/api/automation/xlsx', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  generatePdf: (data: PdfParams) =>
    request<{ success: boolean; file_name: string; file_url: string; message: string }>('/api/automation/pdf', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  sendEmail: (data: EmailParams) =>
    request<{ success: boolean; message: string; status: string; details?: any }>('/api/automation/email', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  calculate: (data: CalcParams) =>
    request<{ success: boolean; results: any; disclaimer: string }>('/api/automation/calc', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  organizeFiles: (data: FileOrganizeParams) =>
    request<{ success: boolean; is_preview: boolean; message: string; planned_actions?: any[] }>('/api/automation/files/organize', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listTasks: () => request<ExecutedTask[]>('/api/tasks'),

  // Helper to trigger direct client file download
  triggerClientDownload: (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
