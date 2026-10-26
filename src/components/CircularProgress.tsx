import { motion } from 'framer-motion';
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
  totalTime,
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
        <motion.div
          className="absolute w-72 h-72 rounded-full"
          style={{
            background: isBreak
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* SVG Circle */}
      <svg width="300" height="300" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke={isBreak ? '#10b981' : '#6366f1'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.div
          className="text-sm font-medium mb-1"
          style={{ color: isBreak ? '#10b981' : '#6366f1' }}
          animate={{ opacity: isRunning && !isPaused ? [1, 0.5, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isBreak ? '🌿 Перерыв' : '📖 Урок'}
        </motion.div>

        <motion.div
          className="text-5xl font-bold text-gray-800 dark:text-white tracking-wider"
          key={timeRemaining}
          initial={{ scale: 1 }}
          animate={{ scale: timeRemaining <= 5 && isRunning ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {formatTime(timeRemaining)}
        </motion.div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-[180px] text-center truncate">
          {isBreak ? 'Отдохни и подготовься' : lessonName}
        </div>

        {isPaused && (
          <motion.div
            className="mt-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⏸ Пауза
          </motion.div>
        )}
      </div>
    </div>
  );
}
