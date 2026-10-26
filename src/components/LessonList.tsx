import { Lesson } from '../types';
import { SUBJECTS } from '../utils/constants';
import { formatTime } from '../utils/audio';
import { Check, Clock, Trash2 } from 'lucide-react';

interface LessonListProps {
  lessons: Lesson[];
  currentIndex: number;
  onRemove: (id: string) => void;
  onReorder: (lessons: Lesson[]) => void;
}

export default function LessonList({ lessons, currentIndex, onRemove }: LessonListProps) {
  const getSubjectInfo = (subject: string) => {
    return SUBJECTS.find((s) => s.name === subject) || SUBJECTS[SUBJECTS.length - 1];
  };

  if (lessons.length === 0) {
    return (
      <div className="text-center py-6">
        <img
          src="https://image.qwenlm.ai/generated-images/c7b325bf-4ff9-4c25-98ef-6c42d399abea/_result.png"
          alt="Начните обучение"
          className="w-32 h-32 mx-auto mb-3 object-contain opacity-80"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Добавьте уроки для начала работы
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
      {lessons.map((lesson, index) => {
        const subjectInfo = getSubjectInfo(lesson.subject);
        const isActive = index === currentIndex;
        const isCompleted = lesson.completed;
        const isUpcoming = index > currentIndex;

        return (
          <div
            key={lesson.id}
            className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
              isActive
                ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                : isCompleted
                ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50'
            }`}
          >
            {/* Status indicator */}
            <div className="flex-shrink-0">
              {isCompleted ? (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center animate-scale-in">
                  <Check size={16} className="text-white" />
                </div>
              ) : isActive ? (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg animate-bounce-gentle"
                  style={{ backgroundColor: subjectInfo.color + '20' }}
                >
                  {subjectInfo.emoji}
                </div>
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg opacity-60"
                  style={{ backgroundColor: subjectInfo.color + '10' }}
                >
                  {subjectInfo.emoji}
                </div>
              )}
            </div>

            {/* Lesson info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium truncate ${
                    isCompleted
                      ? 'text-green-700 dark:text-green-300 line-through'
                      : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {lesson.name}
                </span>
                {isActive && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded animate-fade-in">
                    СЕЙЧАС
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">{lesson.subject}</span>
                <span className="text-xs text-gray-400">•</span>
                <Clock size={12} className="text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(lesson.duration)}
                </span>
              </div>
            </div>

            {/* Order number */}
            <div className="text-xs text-gray-400 font-mono mr-1">
              {isUpcoming ? `#${index + 1}` : ''}
            </div>

            {/* Delete button */}
            {!isCompleted && (
              <button
                onClick={() => onRemove(lesson.id)}
                className="flex-shrink-0 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                title="Удалить"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
