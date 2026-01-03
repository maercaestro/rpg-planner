import React from 'react';
import { Trophy, Award, Star, Zap, Crown, Shield } from 'lucide-react';

const AchievementBadge = ({ icon: Icon, title, description, unlocked, rarity, date }) => {
  const rarityColors = {
    legendary: {
      bg: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-400/50',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/20'
    },
    epic: {
      bg: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-400/50',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/20'
    },
    rare: {
      bg: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-400/50',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/20'
    },
    common: {
      bg: 'from-emerald-500/20 to-green-500/20',
      border: 'border-emerald-400/50',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20'
    }
  };

  const colors = rarityColors[rarity] || rarityColors.common;

  return (
    <div
      className={`relative p-4 rounded-lg border transition-all ${
        unlocked
          ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-lg ${colors.glow} hover:scale-105`
          : 'bg-slate-900/30 border-slate-700/30 opacity-50'
      }`}
    >
      {/* Locked Overlay */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-lg backdrop-blur-[2px]">
          <div className="text-slate-600 font-mono text-sm">LOCKED</div>
        </div>
      )}

      <div className="flex flex-col items-center text-center space-y-3">
        {/* Icon */}
        <div className={`p-4 rounded-full border-2 ${unlocked ? colors.border : 'border-slate-700'} ${unlocked ? colors.bg : 'bg-slate-900'}`}>
          <Icon className={`w-8 h-8 ${unlocked ? colors.text : 'text-slate-600'}`} />
        </div>

        {/* Title & Rarity */}
        <div>
          <h3 className={`font-mono font-bold mb-1 ${unlocked ? 'text-white' : 'text-slate-600'}`}>
            {title}
          </h3>
          <div className={`text-xs font-mono px-2 py-0.5 rounded ${unlocked ? colors.text : 'text-slate-600'} uppercase`}>
            {rarity}
          </div>
        </div>

        {/* Description */}
        <p className={`text-xs font-mono ${unlocked ? 'text-slate-400' : 'text-slate-600'}`}>
          {description}
        </p>

        {/* Date Unlocked */}
        {unlocked && date && (
          <div className="text-xs font-mono text-slate-500">
            {date}
          </div>
        )}
      </div>
    </div>
  );
};

const AchievementPanel = () => {
  const achievements = [
    {
      icon: Crown,
      title: 'Code Master',
      description: '100 hours of coding',
      unlocked: true,
      rarity: 'legendary',
      date: 'Dec 28, 2025'
    },
    {
      icon: Zap,
      title: 'Speed Demon',
      description: 'Complete 10 quests in one day',
      unlocked: true,
      rarity: 'epic',
      date: 'Jan 1, 2026'
    },
    {
      icon: Shield,
      title: 'Consistency King',
      description: '7 day streak maintained',
      unlocked: true,
      rarity: 'epic',
      date: 'Jan 3, 2026'
    },
    {
      icon: Trophy,
      title: 'Early Riser',
      description: 'Start work before 6 AM for 5 days',
      unlocked: true,
      rarity: 'rare',
      date: 'Dec 30, 2025'
    },
    {
      icon: Star,
      title: 'Learning Enthusiast',
      description: 'Complete 5 learning quests',
      unlocked: true,
      rarity: 'rare',
      date: 'Jan 2, 2026'
    },
    {
      icon: Award,
      title: 'First Quest',
      description: 'Complete your first quest',
      unlocked: true,
      rarity: 'common',
      date: 'Dec 15, 2025'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Complete 50 quests total',
      unlocked: false,
      rarity: 'legendary',
      date: null
    },
    {
      icon: Trophy,
      title: 'Perfectionist',
      description: '100% daily goals for 30 days',
      unlocked: false,
      rarity: 'epic',
      date: null
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-400/50">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Achievements</h2>
            <p className="text-slate-400 text-sm font-mono">Trophy Collection</p>
          </div>
        </div>

        {/* Progress */}
        <div className="text-center px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-700">
          <div className="text-amber-400 font-mono text-2xl font-bold">
            {unlockedCount}/{totalCount}
          </div>
          <div className="text-slate-400 text-xs font-mono">UNLOCKED</div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm font-mono">Completion Progress</span>
          <span className="text-amber-400 font-mono text-lg font-bold">{completionPercentage}%</span>
        </div>
        <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((achievement, index) => (
          <AchievementBadge key={index} {...achievement} />
        ))}
      </div>

      {/* Next Achievement Hint */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 font-mono">Next Achievement:</span>
          <span className="text-cyan-400 font-mono font-bold">Lightning Fast - 45/50 Quests</span>
        </div>
        <div className="mt-3 h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
          <div className="h-full bg-cyan-500 w-[90%] transition-all duration-1000" />
        </div>
      </div>
    </div>
  );
};

export default AchievementPanel;
