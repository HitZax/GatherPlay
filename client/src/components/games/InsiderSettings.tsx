import { useState } from 'react';
import { InsiderSettings } from '@gatherplay/shared';

interface Props {
  settings: InsiderSettings;
  onSave: (settings: InsiderSettings) => void;
}

export default function InsiderSettingsPanel({ settings, onSave }: Props) {
  const [timerMinutes, setTimerMinutes] = useState(settings.timerMinutes || 3);
  const [wordDifficulty, setWordDifficulty] = useState(settings.wordDifficulty || 'easy');

  const handleSave = () => {
    onSave({
      timerMinutes,
      wordDifficulty: wordDifficulty as 'easy' | 'medium' | 'hard' | 'mixed',
    });
  };

  return (
    <div className="space-y-4">
      {/* Timer Setting */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          ⏱️ Timer Duration: {timerMinutes} minute{timerMinutes !== 1 ? 's' : ''}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={timerMinutes}
          onChange={(e) => setTimerMinutes(Number(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 min</span>
          <span>5 min</span>
          <span>10 min</span>
        </div>
      </div>

      {/* Word Difficulty */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          📚 Word Difficulty
        </label>
        <select
          value={wordDifficulty}
          onChange={(e) => setWordDifficulty(e.target.value)}
          className="w-full bg-gray-600 text-white rounded px-3 py-2 border border-gray-500 focus:outline-none focus:border-primary-500"
        >
          <option value="easy">Easy (Simple everyday words)</option>
          <option value="medium">Medium (Moderate vocabulary)</option>
          <option value="hard">Hard (Complex/abstract concepts)</option>
          <option value="mixed">Mixed (All difficulties)</option>
        </select>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="btn btn-primary w-full"
      >
        💾 Save Settings
      </button>

      {/* Info */}
      <div className="text-xs text-gray-400 p-3 bg-gray-700 rounded">
        <p className="font-semibold mb-1">💡 Game Info:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Minimum 4 players required</li>
          <li>Roles: 1 Master (revealed), 1 Insider (hidden), rest are Commons</li>
          <li>Commons ask yes/no questions to guess the word</li>
          <li>Master votes for who they think is the Insider</li>
        </ul>
      </div>
    </div>
  );
}
