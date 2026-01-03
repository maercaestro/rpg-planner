import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, Circle, Sliders, Save } from 'lucide-react';
import { supabase } from '../supabaseClient';

const QuestDetail = ({ quest, onClose, onUpdate }) => {
  const [title, setTitle] = useState(quest?.title || '');
  const [description, setDescription] = useState(quest?.description || '');
  const [deadline, setDeadline] = useState(quest?.deadline || '');
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [weights, setWeights] = useState({
    INT: quest?.weight_int || 0,
    WLT: quest?.weight_wlt || 0,
    STR: quest?.weight_str || 0
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (quest) {
      fetchTasks();
    }
  }, [quest]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('quest_tasks')
        .select('*')
        .eq('quest_id', quest.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const { data, error } = await supabase
        .from('quest_tasks')
        .insert([{
          quest_id: quest.id,
          title: newTaskTitle.trim(),
          is_completed: false
        }])
        .select();

      if (error) throw error;

      setTasks([...tasks, data[0]]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    }
  };

  const toggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('quest_tasks')
        .update({ is_completed: !task.is_completed })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase
        .from('quest_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

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

  const saveQuest = async () => {
    setIsSaving(true);
    try {
      const score = calculateScore();
      const rank = getRank(score);

      const { error } = await supabase
        .from('quests')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          deadline: deadline || null,
          weight_int: weights.INT,
          weight_wlt: weights.WLT,
          weight_str: weights.STR,
          gives_int: weights.INT > 0,
          gives_wlt: weights.WLT > 0,
          gives_str: weights.STR > 0,
          score: score,
          rank: rank
        })
        .eq('id', quest.id);

      if (error) throw error;

      if (onUpdate) onUpdate();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving quest:', error);
      alert('Failed to save quest');
    } finally {
      setIsSaving(false);
    }
  };

  const completedTasks = tasks.filter(t => t.is_completed).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
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

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-4xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold text-white bg-transparent border-none outline-none w-full font-mono"
              placeholder="Quest Title"
            />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Description */}
          <div>
            <label className="block text-slate-400 text-sm font-mono mb-2">DESCRIPTION</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Quest description..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors resize-none"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-slate-400 text-sm font-mono mb-2">DEADLINE</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Task Progress Overview */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-mono">TASK PROGRESS</span>
              <span className="text-emerald-400 font-mono text-lg font-bold">{completedTasks}/{totalTasks}</span>
            </div>
            <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${taskProgress}%` }}
              />
            </div>
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
                <span className={`text-2xl font-mono font-bold ${getRankColor(currentRank)}`}>
                  {currentScore}
                </span>
                <span className={`text-lg font-mono font-bold ${getRankColor(currentRank)}`}>
                  {currentRank}
                </span>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div>
            <h3 className="text-white font-mono font-bold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              SUBTASKS
            </h3>

            {/* Add Task Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a new task..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                onClick={addTask}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 rounded font-mono font-bold transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                ADD
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-slate-500 font-mono text-sm">
                  No tasks yet. Add your first task above!
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded border transition-all ${
                      task.is_completed
                        ? 'bg-slate-900/30 border-slate-700/30 opacity-60'
                        : 'bg-slate-900/50 border-slate-700 hover:border-cyan-400/50'
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0"
                    >
                      {task.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-cyan-400" />
                      )}
                    </button>
                    <span className={`flex-1 font-mono text-sm ${task.is_completed ? 'line-through text-slate-500' : 'text-white'}`}>
                      {task.title}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex-shrink-0 p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 border border-slate-700 rounded text-slate-400 font-mono hover:text-white hover:border-slate-600 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={saveQuest}
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-slate-900 font-mono font-bold rounded transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                SAVING...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                SAVE CHANGES
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestDetail;
