import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { SUBJECTS, PRESET_TIMES } from '../utils/constants';
import { v4 as uuidv4 } from 'uuid';
import { Lesson } from '../types';

interface AddLessonFormProps {
  onAdd: (lesson: Lesson) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function AddLessonForm({ onAdd, isOpen, onToggle }: AddLessonFormProps) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0].name);
  const [customMinutes, setCustomMinutes] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const duration = customMinutes
      ? parseInt(customMinutes) * 60
      : selectedPreset || 1500;

    if (duration <= 0) return;

    const lesson: Lesson = {
      id: uuidv4(),
      name: name.trim(),
      duration,
      subject,
      completed: false,
    };

    onAdd(lesson);
    setName('');
    setCustomMinutes('');
    setSelectedPreset(1500);
  };

  const handlePresetClick = (value: number) => {
    setSelectedPreset(value);
    setCustomMinutes('');
  };

  return (
    <div>
      {isOpen && (
        <div className="animate-slide-down">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 shadow-lg"
          >
            {/* Name input */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Название урока
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Алгебра - задачи"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>

            {/* Subject selector */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Предмет
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {SUBJECTS.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSubject(s.name)}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-medium transition-all ${
                      subject === s.name
                        ? 'text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    style={
                      subject === s.name
                        ? { backgroundColor: s.color }
                        : undefined
                    }
                  >
                    <span className="mr-0.5 sm:mr-1">{s.emoji}</span>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Длительность
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                {PRESET_TIMES.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handlePresetClick(preset.value)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-medium transition-all ${
                      selectedPreset === preset.value && !customMinutes
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customMinutes}
                  onChange={(e) => {
                    setCustomMinutes(e.target.value);
                    setSelectedPreset(null);
                  }}
                  placeholder="Своё время"
                  min="1"
                  max="180"
                  className="w-28 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs text-gray-500">минут</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:shadow-none"
            >
              <Plus size={14} className="inline mr-1" />
              Добавить урок
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={onToggle}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-500 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-all text-sm font-medium whitespace-nowrap"
        >
          <Plus size={16} className="inline mr-1" />
          Добавить урок
        </button>
      )}

      {isOpen && (
        <button
          onClick={onToggle}
          className="w-full mt-2 py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs transition-colors whitespace-nowrap"
        >
          <X size={14} className="inline mr-1" />
          Закрыть
        </button>
      )}
    </div>
  );
}
