import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  Sparkles,
  Building2,
  ArrowRight,
  User as UserIcon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070b14]/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Logo showSlogan={false} size="md" />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a
              href="#modos"
              className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              Modos de Uso
            </a>
            <a
              href="#funcionalidades"
              className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Funcionalidades
            </a>
            <a
              href="#como-funciona"
              className="text-slate-300 hover:text-cyan-400 transition-colors"
            >
              Como Funciona
            </a>
            <a
              href="#precos"
              className="text-slate-300 hover:text-cyan-400 transition-colors"
            >
              Planos & Preços
            </a>
            <a
              href="#faq"
              className="text-slate-300 hover:text-cyan-400 transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all duration-200"
              >
                <UserIcon className="w-4 h-4" />
                Acessar Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  Começar Agora
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0a101d] px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-3 text-base font-medium">
            <a
              href="#modos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-1 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              Modos (Empresa e Normal)
            </a>
            <a
              href="#funcionalidades"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-1"
            >
              Funcionalidades
            </a>
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-1"
            >
              Como Funciona
            </a>
            <a
              href="#precos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-1"
            >
              Planos & Preços
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-1"
            >
              Perguntas Frequentes
            </a>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-cyan-500 text-white font-medium"
              >
                Acessar Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-700 text-slate-200 font-medium"
                >
                  Entrar na Conta
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-cyan-500 text-white font-semibold"
                >
                  Começar Agora
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
