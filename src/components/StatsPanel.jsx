import React from 'react';
import { Activity, Brain, Code, Dumbbell, Book, Coffee } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, unit, color, trend }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-cyan-400/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 ${color.bg} rounded-lg border ${color.border}`}>
          <Icon className={`w-5 h-5 ${color.text}`} />
        </div>
        {trend && (
          <div className={`text-xs font-mono px-2 py-1 rounded ${trend > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-mono font-bold ${color.text}`}>{value}</span>
          <span className="text-slate-500 text-sm font-mono">{unit}</span>
        </div>
        <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
};

const StatsPanel = () => {
  const stats = [
    {
      icon: Code,
      label: 'Code Time',
      value: 28,
      unit: 'hrs',
      color: { text: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-400/50' },
      trend: 12
    },
    {
      icon: Brain,
      label: 'Focus Score',
      value: 87,
      unit: '%',
      color: { text: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-400/50' },
      trend: 5
    },
    {
      icon: Dumbbell,
      label: 'Workouts',
      value: 5,
      unit: 'sessions',
      color: { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-400/50' },
      trend: 0
    },
    {
      icon: Book,
      label: 'Learning',
      value: 12,
      unit: 'hrs',
      color: { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-400/50' },
      trend: 8
    },
    {
      icon: Coffee,
      label: 'Deep Work',
      value: 16,
      unit: 'sessions',
      color: { text: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-400/50' },
      trend: 15
    },
    {
      icon: Activity,
      label: 'Productivity',
      value: 92,
      unit: '%',
      color: { text: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-400/50' },
      trend: 7
    }
  ];

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-400/50">
          <Activity className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Weekly Metrics</h2>
          <p className="text-slate-400 text-sm font-mono">Performance Analytics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Summary Bar */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="text-slate-400 text-sm font-mono">Overall Performance</div>
          <div className="flex items-center gap-2">
            <div className="text-emerald-400 font-mono text-lg font-bold">EXCELLENT</div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="mt-3 h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
          <div className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 w-[92%] transition-all duration-1000" />
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
