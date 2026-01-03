import React, { useState } from 'react';
import { Target, Flame, Calendar, TrendingUp } from 'lucide-react';

const DailyGoals = () => {
  const [goals, setGoals] = useState([
    { id: 1, title: 'Code for 4 hours', current: 3, target: 4, unit: 'hrs', completed: false },
    { id: 2, title: 'Drink water', current: 6, target: 8, unit: 'glasses', completed: false },
    { id: 3, title: 'Deep work sessions', current: 2, target: 3, unit: 'sessions', completed: false },
    { id: 4, title: 'Exercise', current: 1, target: 1, unit: 'session', completed: true },
  ]);

  const [streak, setStreak] = useState(7);

  const incrementGoal = (id) => {
    setGoals(goals.map(goal => {
      if (goal.id === id && goal.current < goal.target) {
        const newCurrent = goal.current + 1;
        return { ...goal, current: newCurrent, completed: newCurrent >= goal.target };
      }
      return goal;
    }));
  };

  const decrementGoal = (id) => {
    setGoals(goals.map(goal => {
      if (goal.id === id && goal.current > 0) {
        const newCurrent = goal.current - 1;
        return { ...goal, current: newCurrent, completed: newCurrent >= goal.target };
      }
      return goal;
    }));
  };

  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const completionPercentage = Math.round((completedGoals / totalGoals) * 100);

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-400/50">
            <Target className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Daily Goals</h2>
            <p className="text-slate-400 text-sm font-mono">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-400/50">
          <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
          <div className="text-center">
            <div className="text-orange-400 font-mono text-xl font-bold">{streak}</div>
            <div className="text-orange-300 text-xs font-mono">DAY STREAK</div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="mb-6 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm font-mono">Today's Progress</span>
          <span className="text-emerald-400 font-mono text-lg font-bold">{completedGoals}/{totalGoals}</span>
        </div>
        <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          const isComplete = goal.completed;

          return (
            <div
              key={goal.id}
              className={`p-4 rounded-lg border transition-all ${
                isComplete
                  ? 'bg-emerald-500/10 border-emerald-400/50'
                  : 'bg-slate-900/50 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-mono ${isComplete ? 'text-emerald-400' : 'text-white'}`}>
                  {goal.title}
                </h3>
                {isComplete && (
                  <div className="px-2 py-1 bg-emerald-500 text-slate-900 text-xs font-mono font-bold rounded">
                    COMPLETE
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Counter Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrementGoal(goal.id)}
                    disabled={goal.current === 0}
                    className="w-8 h-8 bg-slate-800 border border-slate-600 rounded text-cyan-400 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold"
                  >
                    -
                  </button>
                  <div className="text-center min-w-[80px]">
                    <span className="text-cyan-400 font-mono text-xl font-bold">{goal.current}</span>
                    <span className="text-slate-500 font-mono text-sm"> / {goal.target}</span>
                    <div className="text-slate-400 text-xs font-mono">{goal.unit}</div>
                  </div>
                  <button
                    onClick={() => incrementGoal(goal.id)}
                    disabled={goal.current >= goal.target}
                    className="w-8 h-8 bg-slate-800 border border-slate-600 rounded text-emerald-400 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="flex-1">
                  <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isComplete ? 'bg-emerald-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Percentage */}
                <div className={`text-sm font-mono font-bold min-w-[50px] text-right ${
                  isComplete ? 'text-emerald-400' : 'text-cyan-400'
                }`}>
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-center gap-2 text-slate-400 text-sm font-mono">
        <Calendar className="w-4 h-4" />
        <span>Reset in {24 - new Date().getHours()} hours</span>
      </div>
    </div>
  );
};

export default DailyGoals;
