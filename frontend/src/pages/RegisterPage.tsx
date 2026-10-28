import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';
import type { AppMode } from '../types';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Building2,
  Laptop,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [plan, setPlan] = useState<'comum' | 'solo' | 'equipe'>('solo');
  const [defaultMode, setDefaultMode] = useState<AppMode>('empresa');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlPlan = searchParams.get('plan');
    if (urlPlan === 'comum' || urlPlan === 'solo' || urlPlan === 'equipe') {
      setPlan(urlPlan);
    }
    const urlMode = searchParams.get('mode');
    if (urlMode === 'empresa' || urlMode === 'normal') {
      setDefaultMode(urlMode);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        password,
        plan,
        default_mode: defaultMode,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-600/15 blur-3xl pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center mb-4">
          <Logo size="lg" showSlogan={true} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-6">
          Crie sua conta Verity AI
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Já possui cadastro?{' '}
          <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
            Acesse aqui
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Nome completo ou Razão Social
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Silva ou Minha Empresa Ltda"
                  required
                  className="block w-full pl-10 pr-3.5 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@empresa.com"
                  required
                  className="block w-full pl-10 pr-3.5 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm"
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 chars"
                    required
                    className="block w-full pl-10 pr-8 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    required
                    className="block w-full pl-10 pr-10 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Select Plan */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Plano Selecionado
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPlan('comum')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    plan === 'comum'
                      ? 'border-cyan-400 bg-cyan-950/60 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">Usuário Comum</p>
                  <p className="text-sm font-extrabold text-cyan-400 mt-0.5">US$ 90</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPlan('solo')}
                  className={`p-3 rounded-xl border text-center transition-all relative ${
                    plan === 'solo'
                      ? 'border-cyan-400 bg-cyan-950/60 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-cyan-500 text-[9px] font-bold text-slate-950 rounded uppercase">
                    Popular
                  </span>
                  <p className="text-xs font-bold">Empresa Solo</p>
                  <p className="text-sm font-extrabold text-cyan-400 mt-0.5">US$ 200</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPlan('equipe')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    plan === 'equipe'
                      ? 'border-cyan-400 bg-cyan-950/60 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">Empresa Equipe</p>
                  <p className="text-sm font-extrabold text-cyan-400 mt-0.5">US$ 700</p>
                </button>
              </div>
            </div>

            {/* Default Mode Preference */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Modo Padrão da IA
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDefaultMode('empresa')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    defaultMode === 'empresa'
                      ? 'border-cyan-400 bg-cyan-950/60 text-white'
                      : 'border-slate-800 bg-slate-900/80 text-slate-400'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold">Modo Empresa</span>
                  {defaultMode === 'empresa' && <Check className="w-3.5 h-3.5 text-cyan-400 ml-auto" />}
                </button>

                <button
                  type="button"
                  onClick={() => setDefaultMode('normal')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    defaultMode === 'normal'
                      ? 'border-cyan-400 bg-cyan-950/60 text-white'
                      : 'border-slate-800 bg-slate-900/80 text-slate-400'
                  }`}
                >
                  <Laptop className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold">Modo Normal</span>
                  {defaultMode === 'normal' && <Check className="w-3.5 h-3.5 text-cyan-400 ml-auto" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (
                <span>Criando conta...</span>
              ) : (
                <>
                  <span>Concluir Cadastro e Entrar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
