# Verity AI

> **"Sua empresa. Seu computador. Sua IA."**

Uma plataforma completa, moderna e funcional de inteligência artificial com dois modos principais de operação: **Modo Empresa** (gestão executiva, planilhas DRE, contratos em Word, relatórios em PDF, e-mails corporativos e cálculos analíticos) e **Modo Normal** (produtividade pessoal, triagem da pasta de Downloads, documentos pessoais e controle financeiro doméstico).

---

## 🎯 Identidade & Modos de Uso

### 🏢 Modo Empresa
- **Planilhas e Demonstrativos Financeiros:** Geração automatizada de `.xlsx` com fórmulas, cabeçalhos navy/cyan e formatação monetária.
- **Minutas e Propostas em Word:** Arquivos `.docx` estruturados com sumários executivos, escopo e cabeçalhos corporativos.
- **Relatórios Executivos em PDF:** Diagnósticos com diagramação profissional via ReportLab.
- **E-mails Corporativos com Validação Prévia:** Validação de destinatário e exigência de aprovação explícita antes do disparo via SMTP.
- **Cálculos Analíticos:** Simulação de Margem Bruta, Margem Operacional, EBITDA e projeções de ROI.

### 💻 Modo Normal
- **Organização Segura do Computador:** Triagem de arquivos por extensão em diretórios explicitamente autorizados (Downloads, Documentos) com proteção sandbox contra path traversal.
- **Documentos de Texto e Resumos:** Geração de anotações e planejamento pessoal em `.docx`.
- **Planilhas Pessoais:** Controle de despesas diárias e orçamentos domésticos em `.xlsx`.
- **Agendas e Listas de Tarefas:** Gestão visual de pendências diárias.
- **E-mails Cotidianos:** Minutas para fornecedores, faculdade e solicitações de reembolso com prévia.

---

## 💰 Planos e Preços

- **Usuário Comum — US$ 90**
- **Empresa Solo — US$ 200** *(Mais Recomendado)*
- **Empresa Equipe — US$ 700**

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, React Router v7.
- **Backend Principal:** Rust 2021, Axum, Tokio, Serde, Rusqlite, BCrypt, JWT, Tower-HTTP.
- **Microsserviço de Automação:** Python 3, FastAPI, Uvicorn, python-docx, openpyxl, reportlab, pydantic, smtplib.
- **Banco de Dados & ORM:** Sequelize ORM (Node.js) com suporte a PostgreSQL na nuvem e fallback automático para SQLite local.
- **Deploy:** Configurado e pronto para **Vercel** (`vercel.json`).

---

## 🚀 Como Executar o Projeto Localmente

### 1. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
O frontend estará acessível em `http://localhost:5173`.
Para gerar o build de produção:
```bash
npm run build
```

### 2. Backend Principal (Rust)
```bash
cd backend
cargo run
```
O servidor Rust iniciará em `http://127.0.0.1:8080` com documentação e rotas em `/api/*`.

### 3. Serviço de Automação (Python)
```bash
cd automation
# Ativar o ambiente virtual (já configurado no projeto)
# No Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Iniciar o servidor de automações:
python main.py
```
O serviço de automação iniciará em `http://127.0.0.1:5001`.

### 4. Banco de Dados (Sequelize)
```bash
cd database
npm install
npm run sync
```
O script testará a conexão, sincronizará as tabelas (`users`, `chat_messages`, `executed_tasks`, `user_preferences`) e criará o usuário demonstrativo `admin@verityai.com` (senha: `verity2026`).

---

## 🗄️ O Que Você Precisa para Conectar ao Banco de Dados (PostgreSQL no Sequelize)

Para conectar o Sequelize a um banco de dados PostgreSQL na nuvem (como **Neon**, **Supabase**, **Railway** ou **Render**), você só precisa de **uma única variável de ambiente**:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_do_banco?sslmode=require
DATABASE_SSL=true
```

### Onde obter:
- **Neon (neon.tech):** No painel do projeto, copie a string de conexão em *Connection Details*.
- **Supabase (supabase.com):** Vá em *Project Settings > Database > Connection String (URI)*.
- **Railway / Render:** Copie a variável `DATABASE_URL` gerada no provisionamento do PostgreSQL.

> **Zero Configuração:** Caso você **não** configure uma `DATABASE_URL`, o Sequelize ativará automaticamente o fallback para o SQLite local em `database/verity_ai.sqlite`, permitindo rodar tudo na sua máquina de forma 100% autônoma!

---

## ☁️ Como Fazer o Deploy no Vercel

O projeto já está 100% configurado com `vercel.json` na raiz e na pasta `frontend/`.

### Passo a passo para o Vercel:

1. Suba o código para o seu repositório no GitHub ou GitLab.
2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"**.
3. Importe o repositório **VerityAi**.
4. Se o Vercel perguntar pelo diretório raiz:
   - Se mantiver a **raiz (`.`)**, o `vercel.json` executará o build do frontend automaticamente (`frontend/dist`).
   - Se preferir definir o **Root Directory** como `frontend`, o Vercel detectará o framework **Vite** de imediato.
5. Em **Environment Variables**, adicione:
   - `DATABASE_URL`: *(Sua URL do PostgreSQL, se for utilizar o banco Sequelize na nuvem)*.
   - `VITE_API_URL`: *(URL do seu backend em produção, caso deploye a API separadamente em Railway/Render)*.
6. Clique em **Deploy**.

> O frontend da Verity AI possui um motor de simulação inteligente embutido: se a API externa estiver offline no momento da navegação no Vercel, a interface continua 100% funcional, permitindo criar contas de teste, bater papo com a IA e testar as automações de download!

---

## 🔒 Segurança e Sandboxing

- **Diretórios Autorizados:** Operações de arquivos ocorrem estritamente em pastas configuradas pelo usuário (ex: `Downloads`), rejeitando tentativas de path traversal.
- **Confirmação Explícita de E-mails:** O sistema apresenta a prévia visual e exige a marcação da caixa de autorização antes de qualquer disparo via SMTP.
- **Criptografia:** Senhas com hash seguro BCrypt e tokens JWT assinados no backend.
- **Proteção de Segredos:** Nenhuma chave de API ou credencial sensível é exposta no frontend.

