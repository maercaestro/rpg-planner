import React, { useState, useEffect } from 'react';
import { Calendar, Target } from 'lucide-react';
import { supabase } from '../supabaseClient';

const FIXED_USER_ID = '00000000-0000-0000-0000-000000000000';

const QuestStats = () => {
  const [nearestDeadline, setNearestDeadline] = useState(null);
  const [bingoProgress, setBingoProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestStats();
    
    // Refresh every minute
    const interval = setInterval(fetchQuestStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchQuestStats = async () => {
    try {
      // Fetch all active quests with deadlines
      const { data: questsData, error: questsError } = await supabase
        .from('quests')
        .select('id, deadline')
        .eq('user_id', FIXED_USER_ID)
        .eq('is_completed', false)
        .not('deadline', 'is', null)
        .order('deadline', { ascending: true })
        .limit(1);

      if (questsError) throw questsError;

      if (questsData && questsData.length > 0) {
        setNearestDeadline(questsData[0].deadline);
      } else {
        setNearestDeadline(null);
      }

      // Calculate bingo card completion percentage
      const { data: allQuests, error: allQuestsError } = await supabase
        .from('quests')
        .select('id')
        .eq('user_id', FIXED_USER_ID)
        .eq('is_completed', false)
        .order('score', { ascending: false })
        .limit(25);

      if (allQuestsError) throw allQuestsError;

      if (allQuests && allQuests.length > 0) {
        // Fetch completion percentage for each quest
        let totalPercentage = 0;
        let questCount = 0;

        for (const quest of allQuests) {
          const { data: tasks, error: tasksError } = await supabase
            .from('quest_tasks')
            .select('id, is_completed')
            .eq('quest_id', quest.id);

          if (!tasksError && tasks && tasks.length > 0) {
            const completedTasks = tasks.filter(t => t.is_completed).length;
            const percentage = (completedTasks / tasks.length) * 100;
            totalPercentage += percentage;
            questCount++;
          }
        }

        const averagePercentage = questCount > 0 ? Math.round(totalPercentage / questCount) : 0;
        setBingoProgress(averagePercentage);
      } else {
        setBingoProgress(0);
      }

    } catch (error) {
      console.error('Error fetching quest stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntil = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return 'No upcoming deadlines';
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDeadlineColor = (daysUntil) => {
    if (daysUntil === null) return 'text-slate-400';
    if (daysUntil < 0) return 'text-red-400';
    if (daysUntil === 0) return 'text-amber-400';
    if (daysUntil <= 3) return 'text-orange-400';
    if (daysUntil <= 7) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  const getDeadlineText = (daysUntil) => {
    if (daysUntil === null) return '';
    if (daysUntil < 0) return `${Math.abs(daysUntil)} days overdue`;
    if (daysUntil === 0) return 'Due today';
    if (daysUntil === 1) return 'Due tomorrow';
    return `${daysUntil} days remaining`;
  };

  if (loading) {
    return (
      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-2xl">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-slate-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const daysUntil = getDaysUntil(nearestDeadline);
  const deadlineColor = getDeadlineColor(daysUntil);

  return (
    <div className="space-y-4">
      {/* Nearest Deadline Card */}
      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-5 shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-amber-500/20 rounded border border-amber-400/50">
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-slate-300 font-mono text-xs tracking-widest uppercase">
            Next Deadline
          </h3>
        </div>
        
        <div className="space-y-1">
          <p className={`${deadlineColor} font-mono text-xl font-bold`}>
            {nearestDeadline ? formatDeadline(nearestDeadline) : 'No deadlines set'}
          </p>
          {daysUntil !== null && (
            <p className={`${deadlineColor} font-mono text-sm`}>
              {getDeadlineText(daysUntil)}
            </p>
          )}
        </div>
      </div>

      {/* Bingo Progress Card */}
      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-5 shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-cyan-500/20 rounded border border-cyan-400/50">
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-slate-300 font-mono text-xs tracking-widest uppercase">
            Bingo Progress
          </h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-mono font-bold text-emerald-400">
              {bingoProgress}%
            </span>
            <span className="text-slate-400 font-mono text-sm mb-1">
              complete
            </span>
          </div>
          
          <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${bingoProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestStats;
