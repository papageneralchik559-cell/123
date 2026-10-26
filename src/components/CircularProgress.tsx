import { formatTime } from '../utils/audio';

interface CircularProgressProps {
  progress: number; // 0 to 1
  timeRemaining: number;
  totalTime: number;
  isBreak: boolean;
  isRunning: boolean;
  isPaused: boolean;
  lessonName: string;
}

export default function CircularProgress({
  progress,
  timeRemaining,
  isBreak,
  isRunning,
  isPaused,
  lessonName,
}: CircularProgressProps) {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center">
      {/* Background glow */}
      {isRunning && !isPaused && (
        <div
          className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full animate-pulse-gentle"
          style={{
            background: isBreak
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          }}
        />
      )}

      {/* SVG Circle */}
      <svg width="240" height="240" className="sm:w-[300px] sm:h-[300px] transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-200 dark:text-gray-700"
          transform="scale(0.8) translate(30, 30)"
        />
        {/* Progress circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke={isBreak ? '#10b981' : '#6366f1'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-in-out"
          transform="scale(0.8) translate(30, 30)"
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center">
        <div
          className={`text-xs sm:text-sm font-medium mb-1 ${
            isRunning && !isPaused ? 'animate-pulse-gentle' : ''
          }`}
          style={{ color: isBreak ? '#10b981' : '#6366f1' }}
        >
          {isBreak ? '🌿 Перерыв' : '📖 Урок'}
        </div>

        <div
          className={`text-3xl sm:text-5xl font-bold text-gray-800 dark:text-white tracking-wider ${
            timeRemaining <= 5 && isRunning ? 'animate-pulse' : ''
          }`}
        >
          {formatTime(timeRemaining)}
        </div>

        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 max-w-[140px] sm:max-w-[180px] text-center truncate">
          {isBreak ? 'Отдохни и подготовься' : lessonName}
        </div>

        {isPaused && (
          <div className="mt-2 px-2 sm:px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-[10px] sm:text-xs font-medium animate-fade-in">
            ⏸ Пауза
          </div>
        )}
      </div>
    </div>
  );
}
