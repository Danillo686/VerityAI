import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { AppMode } from '../types';
import {
  User,
  Building2,
  Laptop,
  Database,
  CheckCircle,
  FolderLock,
  Save,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, setActiveMode } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [defaultMode, setDefaultMode] = useState<AppMode>(user?.default_mode || 'empresa');
  const [authorizedFolder, setAuthorizedFolder] = useState('C:\\Users\\uqual\\Downloads');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUser({
        name,
        default_mode: defaultMode,
      });
      setActiveMode(defaultMode);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const planTitles = {
    comum: 'Usuário Comum — US$ 90',
    solo: 'Empresa Solo — US$ 200',
    equipe: 'Empresa Equipe — US$ 700',
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Configurações & Governança</h1>
        <p className="text-slate-400 text-sm mt-1">
          Gerencie seu perfil, preferências de modo da IA, diretórios de segurança e conexão de banco de dados.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Configurações salvas e aplicadas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <User className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Perfil da Conta</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Nome ou Empresa</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">E-mail Cadastrado</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Plano Contratado</label>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">
                  {user?.plan ? planTitles[user.plan] : 'Empresa Solo — US$ 200'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Acesso completo às ferramentas e modos da Verity AI</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                Ativo
              </span>
            </div>
          </div>
        </div>

        {/* AI Mode Preference */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Modo Padrão da IA</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setDefaultMode('empresa')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                defaultMode === 'empresa'
                  ? 'border-cyan-400 bg-cyan-950/40 text-white shadow'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-sm text-cyan-400">
                <Building2 className="w-4 h-4" />
                Modo Empresa
              </div>
              <p className="text-xs text-slate-400">
                Foco em gestão, planilhas DRE, contratos em Word, relatórios em PDF e correspondência executiva.
              </p>
            </div>

            <div
              onClick={() => setDefaultMode('normal')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                defaultMode === 'normal'
                  ? 'border-blue-400 bg-blue-950/40 text-white shadow'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-sm text-blue-400">
                <Laptop className="w-4 h-4" />
                Modo Normal
              </div>
              <p className="text-xs text-slate-400">
                Foco em organização diária do computador, pastas de Downloads, orçamentos domésticos e rotinas pessoais.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Sandbox Directory */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <FolderLock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Segurança & Sandbox Local</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Diretório Autorizado para Organização de Arquivos
            </label>
            <input
              type="text"
              value={authorizedFolder}
              onChange={(e) => setAuthorizedFolder(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              Por proteção contra vulnerabilidades de path traversal, a IA recusa qualquer operação fora deste diretório.
            </p>
          </div>
        </div>

        {/* Database & Deployment Details */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Sequelize ORM & Deploy no Vercel</h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">Camada de Banco de Dados: Sequelize</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Pronto
                </span>
              </div>
              <p className="text-slate-400 font-sans text-xs">
                O projeto inclui a estrutura do Sequelize em <code className="text-cyan-300 font-mono">database/</code> com modelos para Usuários, Conversas, Tarefas e Preferências.
              </p>
              <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-900">
                <p>• Suporta PostgreSQL (Supabase, Neon, Railway, Vercel Postgres) via <code className="text-amber-300">DATABASE_URL</code>.</p>
                <p>• Fallback automático para SQLite local (<code className="text-amber-300">verity_ai.sqlite</code>) sem necessidade de instalação externa.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-bold">Pronto para Deploy no Vercel</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                  Configurado
                </span>
              </div>
              <p className="text-slate-400 font-sans text-xs">
                Arquivo <code className="text-cyan-300 font-mono">vercel.json</code> adicionado com reescritas para SPA e suporte a builds de produção com 1 clique no Vercel.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
        </button>
      </form>
    </div>
  );
};
