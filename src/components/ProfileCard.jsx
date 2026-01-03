import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

const StatBar = ({ label, value, color, delay }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(Math.min(value, 100));
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-slate-400 font-mono text-xs tracking-wider">{label}</span>
        <span className={`${color} font-mono text-sm font-bold`}>{value}</span>
      </div>
      <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
        <div 
          className={`h-full ${color.replace('text-', 'bg-')} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

const ProfileCard = () => {
  const stats = [
    { label: 'INT', value: 92, color: 'text-cyan-400', delay: 100 },
    { label: 'WLT', value: 68, color: 'text-emerald-400', delay: 200 },
    { label: 'STR', value: 75, color: 'text-purple-400', delay: 300 }
  ];

  return (
    <>
      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Character Portrait */}
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Name */}
            <h1 className="text-xl font-bold text-white tracking-tight">
              Abu Huzaifah
            </h1>
            
            <div className="relative group">
              {/* Hexagon Frame Effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 blur-xl group-hover:blur-2xl transition-all duration-300"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }}
              />
              
              {/* Chamfered Frame */}
              <div 
                className="relative bg-slate-900 border-2 border-cyan-400/50 p-2 shadow-lg shadow-cyan-500/20"
                style={{
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)'
                }}
              >
                <img 
                  src="/src/assets/character-badge.png" 
                  alt="Character Portrait" 
                  className="w-64 h-64 object-cover"
                  style={{
                    clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)'
                  }}
                />
              </div>
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-emerald-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-emerald-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-400" />
            </div>
          </div>

          {/* Right Column: Stats & Info */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Class */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-gradient-to-r from-cyan-400 to-transparent" />
                <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase">
                  Neural Alchemist
                </p>
              </div>
            </div>

            {/* Level Badge */}
            <div className="inline-flex items-center gap-3 self-start">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-lg" />
                <div className="relative bg-gradient-to-br from-emerald-500 to-cyan-500 px-6 py-3 rounded-lg border border-emerald-400/50 shadow-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-slate-900" />
                    <span className="font-mono font-bold text-2xl text-slate-900">
                      LVL 14
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Bars */}
            <div className="space-y-4 bg-slate-900/30 p-5 rounded-lg border border-slate-700/50">
              <h3 className="text-slate-300 font-mono text-xs tracking-widest uppercase mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                Core Attributes
              </h3>
              {stats.map((stat) => (
                <StatBar 
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  color={stat.color}
                  delay={stat.delay}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
