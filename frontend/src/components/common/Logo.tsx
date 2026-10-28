import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg';
  linkToHome?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showSlogan = false,
  size = 'md',
  linkToHome = true,
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  };

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Friendly Yellow Smiley Avatar Icon */}
      <div className="relative group flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Verity AI Logo"
          className={`${sizeClasses[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center tracking-tight">
          <span className="font-extrabold text-white text-lg tracking-wider">VERITY</span>
          <span className="font-bold text-cyan-400 ml-1.5 text-lg">AI</span>
        </div>
        {showSlogan && (
          <span className="text-[10px] text-slate-400 font-medium tracking-tight">
            Sua empresa. Seu computador. Sua IA.
          </span>
        )}
      </div>
    </div>
  );

  if (linkToHome) {
    return (
      <Link to="/" className="inline-flex items-center hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};

