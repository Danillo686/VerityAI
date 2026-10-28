import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Cpu, Terminal, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050810] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Logo size="md" showSlogan={true} />
            <p className="text-slate-400 text-sm leading-relaxed mt-3">
              A inteligência artificial que acelera operações corporativas e simplifica as rotinas do seu computador com segurança e automações reais.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-slate-300 font-mono">Verity Engine v1.0 Online</span>
            </div>
          </div>

          {/* Column 2: Modos & Automações */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase text-xs">
              Modos & Recursos
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#modos" className="hover:text-cyan-400 transition-colors">
                  Modo Empresa (DRE, Relatórios, Propostas)
                </a>
              </li>
              <li>
                <a href="#modos" className="hover:text-cyan-400 transition-colors">
                  Modo Normal (Organização de PC e Rotinas)
                </a>
              </li>
              <li>
                <a href="#funcionalidades" className="hover:text-cyan-400 transition-colors">
                  Gerador de Planilhas Excel (.xlsx)
                </a>
              </li>
              <li>
                <a href="#funcionalidades" className="hover:text-cyan-400 transition-colors">
                  Gerador de Documentos Word (.docx)
                </a>
              </li>
              <li>
                <a href="#funcionalidades" className="hover:text-cyan-400 transition-colors">
                  Relatórios Executivos em PDF
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Segurança & Tecnologia */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase text-xs">
              Tecnologia & Segurança
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Sandbox de Diretórios Autorizados</span>
              </li>
              <li className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Núcleo Rust de Alto Desempenho</span>
              </li>
              <li className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Automações Nativas em Python</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Sequelize ORM & PostgreSQL</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Planos */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase text-xs">
              Planos Oficiais
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-white font-medium">Usuário Comum:</span> US$ 90
              </li>
              <li>
                <span className="text-white font-medium">Empresa Solo:</span> US$ 200
              </li>
              <li>
                <span className="text-white font-medium">Empresa Equipe:</span> US$ 700
              </li>
              <li className="pt-2 text-xs text-slate-500">
                Transações protegidas por criptografia ponta a ponta.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Verity AI Inc. Todos os direitos reservados. "Sua empresa. Seu computador. Sua IA."</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Termos de Uso</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacidade</span>
            <span className="hover:text-slate-400 cursor-pointer">Segurança de Dados</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
