import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy, Zap, Edit } from 'lucide-react';
import { supabase } from '../supabaseClient';
import QuestDetail from './QuestDetail';

const FIXED_USER_ID = '00000000-0000-0000-0000-000000000000'; // Fixed ID for personal use

const BingoBoard = () => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchTopQuests();
  }, []);

  const fetchTopQuests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', FIXED_USER_ID)
        .eq('is_completed', false)
        .order('score', { ascending: false })
        .limit(25);

      if (error) throw error;

      // Fetch task counts for each quest
      const questsWithProgress = await Promise.all(
        (data || []).map(async (quest) => {
          const { data: tasks, error: tasksError } = await supabase
            .from('quest_tasks')
            .select('id, is_completed')
            .eq('quest_id', quest.id);
          
          if (tasksError) {
            console.error('Error fetching tasks:', tasksError);
            return { ...quest, completionPercentage: 0 };
          }

          const totalTasks = tasks.length;
          const completedTasks = tasks.filter(t => t.is_completed).length;
          const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return { ...quest, completionPercentage, totalTasks, completedTasks };
        })
      );

      // Pad with empty slots if less than 25
      const paddedQuests = [...questsWithProgress];
      while (paddedQuests.length < 25) {
        paddedQuests.push({ id: `empty-${paddedQuests.length}`, isEmpty: true });
      }

      setQuests(paddedQuests);
    } catch (error) {
      console.error('Error fetching quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeQuest = async (questId, e) => {
    e.stopPropagation(); // Prevent opening detail when clicking complete
    try {
      // Call the RPC function
      const { data, error } = await supabase.rpc('complete_quest', {
        quest_id: questId,
        user_id: FIXED_USER_ID
      });

      if (error) throw error;

      // Refresh the quest board
      fetchTopQuests();
      
      // Show success feedback
      console.log('Quest completed!', data);
    } catch (error) {
      console.error('Error completing quest:', error);
      alert('Failed to complete quest. Please try again.');
    }
  };

  const getRankColor = (rank) => {
    const colors = {
      'LEGENDARY': 'border-amber-400/50 bg-amber-500/10',
      'EPIC': 'border-purple-400/50 bg-purple-500/10',
      'COMMON': 'border-slate-600/50 bg-slate-800/30'
    };
    return colors[rank] || colors.COMMON;
  };

  const getRankTextColor = (rank) => {
    const colors = {
      'LEGENDARY': 'text-amber-400',
      'EPIC': 'text-purple-400',
      'COMMON': 'text-slate-400'
    };
    return colors[rank] || colors.COMMON;
  };

  const openQuestDetail = (quest) => {
    setSelectedQuest(quest);
    setShowDetail(true);
  };

  const closeQuestDetail = () => {
    setShowDetail(false);
    setSelectedQuest(null);
  };

  const handleQuestUpdate = () => {
    fetchTopQuests();
    closeQuestDetail();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-cyan-400 font-mono">LOADING BINGO BOARD...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-400/50">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Quest Bingo Board</h2>
            <p className="text-slate-400 text-sm font-mono">Top 25 High-Impact Quests</p>
          </div>
        </div>

        <button
          onClick={fetchTopQuests}
          className="px-4 py-2 bg-slate-900 border border-slate-700 rounded text-cyan-400 font-mono text-sm hover:border-cyan-400 transition-colors"
        >
          REFRESH
        </button>
      </div>

      {/* 5x5 Bingo Grid */}
      <div className="grid grid-cols-5 gap-2">
        {quests.map((quest, index) => {
          if (quest.isEmpty) {
            return (
              <div
                key={quest.id}
                className="aspect-square p-2 bg-slate-900/30 border border-slate-700/30 rounded flex items-center justify-center"
              >
                <span className="text-slate-700 font-mono text-[10px]">EMPTY</span>
              </div>
            );
          }

          return (
            <div
              key={quest.id}
              className={`aspect-square p-2 border rounded transition-all cursor-pointer group relative ${getRankColor(quest.rank)}`}
              onClick={() => openQuestDetail(quest)}
            >
              {/* Edit Overlay */}
              <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                <Edit className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="h-full flex flex-col justify-between relative z-10">
                {/* Quest Number & Rank */}
                <div className="flex items-start justify-between gap-1">
                  <span className="text-slate-500 font-mono text-[10px]">#{index + 1}</span>
                  <div className="flex items-center gap-0.5">
                    <Zap className={`w-2.5 h-2.5 ${getRankTextColor(quest.rank)}`} />
                    <span className={`font-mono text-[10px] ${getRankTextColor(quest.rank)}`}>
                      {quest.score}
                    </span>
                  </div>
                </div>

                {/* Quest Title */}
                <h3 className="text-white font-mono text-[10px] leading-tight line-clamp-2 my-1">
                  {quest.title}
                </h3>

                {/* Completion Percentage */}
                {quest.totalTasks > 0 && (
                  <div className="my-0.5">
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-400 transition-all duration-300"
                        style={{ width: `${quest.completionPercentage}%` }}
                      />
                    </div>
                    <span className="text-emerald-400 text-[8px] font-mono">
                      {quest.completionPercentage}%
                    </span>
                  </div>
                )}

                {/* Deadline */}
                {quest.deadline && (
                  <div className="text-amber-400 text-[8px] font-mono">
                    {new Date(quest.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                )}

                {/* Stat Tags */}
                <div className="flex items-center gap-0.5 flex-wrap">
                  {quest.gives_int && (
                    <span className="px-1 py-0.5 bg-cyan-500/20 text-cyan-400 text-[8px] font-mono rounded">
                      INT
                    </span>
                  )}
                  {quest.gives_wlt && (
                    <span className="px-1 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-mono rounded">
                      WLT
                    </span>
                  )}
                  {quest.gives_str && (
                    <span className="px-1 py-0.5 bg-purple-500/20 text-purple-400 text-[8px] font-mono rounded">
                      STR
                    </span>
                  )}
                </div>

                {/* Complete Button Icon */}
                <div className="flex justify-center mt-1">
                  <button
                    onClick={(e) => completeQuest(quest.id, e)}
                    className="hover:scale-110 transition-transform"
                  >
                    <Circle className="w-3 h-3 text-slate-500 hover:text-emerald-400 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-amber-400/50 bg-amber-500/10" />
          <span className="text-amber-400 font-mono text-xs">LEGENDARY (16+ pts)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-purple-400/50 bg-purple-500/10" />
          <span className="text-purple-400 font-mono text-xs">EPIC (11-15 pts)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-slate-600/50 bg-slate-800/30" />
          <span className="text-slate-400 font-mono text-xs">COMMON (0-10 pts)</span>
        </div>
      </div>

      {/* Quest Detail Modal */}
      {showDetail && selectedQuest && (
        <QuestDetail 
          quest={selectedQuest}
          onClose={closeQuestDetail}
          onUpdate={handleQuestUpdate}
        />
      )}
    </div>
  );
};

export default BingoBoard;
