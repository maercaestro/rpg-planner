import React, { useState, useEffect } from 'react';
import { Plus, Zap, X, Sliders, Save } from 'lucide-react';
import { supabase } from '../supabaseClient';

const FIXED_USER_ID = '00000000-0000-0000-0000-000000000000'; // Fixed ID for personal use

const AddQuestForm = ({ onQuestAdded, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [weights, setWeights] = useState({
    INT: 0,
    WLT: 0,
    STR: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateScore = () => {
    return weights.INT + weights.WLT + weights.STR;
  };

  const getRank = (score) => {
    if (score > 15) return 'LEGENDARY';
    if (score > 10) return 'EPIC';
    return 'COMMON';
  };

  const handleWeightChange = (stat, value) => {
    setWeights(prev => ({ ...prev, [stat]: parseInt(value) || 0 }));
  };

  const currentScore = calculateScore();
  const currentRank = getRank(currentScore);

  const getRankColor = (rank) => {
    const colors = {
      'LEGENDARY': 'text-amber-400',
      'EPIC': 'text-purple-400',
      'COMMON': 'text-slate-400'
    };
    return colors[rank] || colors.COMMON;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a quest title');
      return;
    }

    setIsSubmitting(true);

    try {
      const score = calculateScore();
      const rank = getRank(score);

      // Insert quest into Supabase
      const { data, error } = await supabase
        .from('quests')
        .insert([
          {
            title: title.trim(),
            description: description.trim() || null,
            deadline: deadline || null,
            gives_int: weights.INT > 0,
            gives_wlt: weights.WLT > 0,
            gives_str: weights.STR > 0,
            weight_int: weights.INT,
            weight_wlt: weights.WLT,
            weight_str: weights.STR,
            score: score,
            rank: rank,
            is_completed: false,
            user_id: FIXED_USER_ID
          }
        ])
        .select();

      if (error) throw error;

      // Reset form
      setTitle('');
      setDescription('');
      setDeadline('');
      setWeights({ INT: 0, WLT: 0, STR: 0 });
      
      // Notify parent component
      if (onQuestAdded) onQuestAdded(data[0]);
      if (onClose) onClose();

    } catch (error) {
      console.error('Error adding quest:', error);
      alert('Failed to add quest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-4xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white font-mono">CREATE NEW QUEST</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Title Input */}
          <div>
            <label className="block text-slate-400 text-sm font-mono mb-2">
              QUEST TITLE *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete ML Model Training"
              className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-slate-400 text-sm font-mono mb-2">
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details about this quest..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors resize-none"
            />
          </div>

          {/* Deadline Input */}
          <div>
            <label className="block text-slate-400 text-sm font-mono mb-2">
              DEADLINE
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Stat Weight Sliders */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-mono font-bold">STAT WEIGHTS</h3>
            </div>

            <div className="space-y-4">
              {/* INT Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-cyan-400 font-mono text-sm font-bold">INT (Intelligence)</label>
                  <span className="text-cyan-400 font-mono text-lg font-bold">{weights.INT} pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={weights.INT}
                  onChange={(e) => handleWeightChange('INT', e.target.value)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* WLT Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-emerald-400 font-mono text-sm font-bold">WLT (Wealth)</label>
                  <span className="text-emerald-400 font-mono text-lg font-bold">{weights.WLT} pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={weights.WLT}
                  onChange={(e) => handleWeightChange('WLT', e.target.value)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* STR Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-purple-400 font-mono text-sm font-bold">STR (Strength)</label>
                  <span className="text-purple-400 font-mono text-lg font-bold">{weights.STR} pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={weights.STR}
                  onChange={(e) => handleWeightChange('STR', e.target.value)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>
            </div>

            {/* Score Preview */}
            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
              <span className="text-slate-400 text-sm font-mono">TOTAL IMPACT SCORE</span>
              <div className="flex items-center gap-3">
                <Zap className={`w-5 h-5 ${getRankColor(currentRank)}`} />
                <span className={`text-2xl font-mono font-bold ${getRankColor(currentRank)}`}>
                  {currentScore}
                </span>
                <span className={`text-lg font-mono font-bold ${getRankColor(currentRank)}`}>
                  {currentRank}
                </span>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 border border-slate-700 rounded text-slate-400 font-mono hover:text-white hover:border-slate-600 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-slate-900 font-mono font-bold rounded transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                CREATING...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                CREATE QUEST
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestForm;
