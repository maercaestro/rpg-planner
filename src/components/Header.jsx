import React from 'react';

const Header = () => {
  return (
    <header className="bg-slate-800/60 border-b border-slate-700 backdrop-blur-sm mb-8">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <img 
            src="/logo.png" 
            alt="System Logo" 
            className="h-10 w-10 object-contain"
          />
          
          {/* System Text */}
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-lg tracking-wider">
              SYSTEM_2026
            </span>
            <span className="text-slate-500 font-mono">//</span>
            <span className="text-emerald-400 font-mono text-lg tracking-wider animate-pulse">
              ONLINE
            </span>
          </div>
          
          {/* Decorative Line */}
          <div className="flex-1 h-px bg-gradient-to-r from-slate-700 via-cyan-500/20 to-transparent ml-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;
