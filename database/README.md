# Camada de Banco de Dados & ORM Sequelize — Verity AI

Esta pasta contém a modelagem e controle de persistência do **Verity AI** utilizando o ORM **Sequelize** (Node.js).

## 🚀 Como Conectar ao PostgreSQL (Neon, Supabase, Railway, Vercel Postgres)

Para conectar o Sequelize ao seu banco de dados PostgreSQL na nuvem ou local, você só precisa fornecer a variável de ambiente `DATABASE_URL` no arquivo `.env` (ou nas configurações da sua hospedagem).

### O que você precisa:

1. **URL de Conexão do PostgreSQL (DATABASE_URL):**
   - **Neon:** Obtenha no dashboard do Neon em *Connection Details* (ex: `postgresql://usuario:senha@ep-xyz.us-east-2.aws.neon.tech/verity_db?sslmode=require`)
   - **Supabase:** Obtenha no Supabase em *Settings > Database > Connection String (URI / Session Mode)* (ex: `postgresql://postgres:senha@db.xyz.supabase.co:5432/postgres`)
   - **Railway / Render:** Copie a `DATABASE_URL` fornecida no painel do banco.

2. Crie ou configure seu arquivo `.env` na raiz do projeto ou nesta pasta `database/.env`:
   ```env
   DATABASE_URL=postgresql://seu_usuario:sua_senha@seu_host:5432/seu_banco?sslmode=require
   DATABASE_SSL=true
   ```

3. Execute a sincronização automática das tabelas:
   ```bash
   cd database
   npm run sync
   ```

O Sequelize irá se conectar, criar/atualizar as tabelas (`users`, `chat_messages`, `executed_tasks`, `user_preferences`) e popular com o usuário inicial de demonstração.

---

## ⚡ Modo Local Automático (Zero Configuração)

Se você não fornecer uma `DATABASE_URL`, o Sequelize ativará automaticamente o fallback para SQLite local em `database/verity_ai.sqlite`. Isso permite rodar e testar tudo na sua máquina sem precisar instalar nem configurar o PostgreSQL antecipadamente.

---

## 📁 Estrutura de Modelos

- `models/User.js`: Usuários cadastrados, senhas criptografadas em bcrypt, plano (`comum`, `solo`, `equipe`) e modo padrão (`empresa` ou `normal`).
- `models/ChatMessage.js`: Histórico completo de conversas, separadas por sessão, remetente (`user` ou `assistant`), ações executadas e metadados.
- `models/ExecutedTask.js`: Registro de todas as automações geradas (Word, Excel, PDF, e-mails, cálculos), status e URLs de download.
- `models/UserPreference.js`: Preferências de interface e caminho do diretório autorizado em sandbox.

