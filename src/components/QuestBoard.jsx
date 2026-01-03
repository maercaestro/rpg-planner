import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddQuestForm from './AddQuestForm';
import BingoBoard from './BingoBoard';

const QuestBoard = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleQuestAdded = () => {
    setShowAddForm(false);
    // BingoBoard will auto-refresh
  };

  return (
    <div className="space-y-4">
      {/* Add Quest Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-slate-900 rounded font-mono font-bold transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          NEW QUEST
        </button>
      </div>

      {/* Bingo Board */}
      <BingoBoard />

      {/* Add Quest Form Modal */}
      {showAddForm && (
        <AddQuestForm 
          onQuestAdded={handleQuestAdded}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default QuestBoard;
