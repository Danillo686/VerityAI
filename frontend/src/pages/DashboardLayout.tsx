import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';
import {
  MessageSquare,
  Wand2,
  FileCheck2,
  Settings,
  LogOut,
  Building2,
  Laptop,
  Menu,
  X,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, activeMode, toggleMode, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Chat com IA', path: '/dashboard', icon: MessageSquare, end: true },
    { name: 'Central de Automações', path: '/dashboard/automations', icon: Wand2 },
    { name: 'Histórico & Arquivos', path: '/dashboard/tasks', icon: FileCheck2 },
    { name: 'Configurações', path: '/dashboard/settings', icon: Settings },
  ];

  const planLabels = {
    comum: 'Usuário Comum ($90)',
    solo: 'Empresa Solo ($200)',
    equipe: 'Empresa Equipe ($700)',
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0a101d] border-b border-slate-800 sticky top-0 z-40">
        <Logo size="sm" showSlogan={false} />
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMode}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${
              activeMode === 'empresa'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                : 'bg-blue-950 text-blue-300 border-blue-800'
            }`}
          >
            {activeMode === 'empresa' ? <Building2 className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
            {activeMode === 'empresa' ? 'Empresa' : 'Normal'}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#090e1c] border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Logo size="md" showSlogan={true} />
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Pill */}
          <div className="p-1 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <p className="px-2 pt-1 text-[10px] font-semibold tracking-wider uppercase text-slate-500">
              Modo Ativo da IA
            </p>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  if (activeMode !== 'empresa') toggleMode();
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeMode === 'empresa'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Empresa
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeMode !== 'normal') toggleMode();
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeMode === 'normal'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                Normal
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800/90 bg-[#070b14]/70">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Usuário'}</p>
              <p className="text-[10px] text-cyan-400 font-mono truncate">
                {user?.plan ? planLabels[user.plan] : 'Plano Ativo'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Encerrar Sessão"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
