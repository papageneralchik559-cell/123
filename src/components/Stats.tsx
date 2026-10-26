import { motion } from 'framer-motion';
import { Lesson } from '../types';
import { formatTime } from '../utils/audio';

interface StatsProps {
  lessons: Lesson[];
  currentIndex: number;
}

export default function Stats({ lessons, currentIndex }: StatsProps) {
  const completedLessons = lessons.filter((l) => l.completed).length;
  const totalLessons = lessons.length;
  const totalTime = lessons.reduce((acc, l) => acc + l.duration, 0);
  const completedTime = lessons
    .filter((l) => l.completed)
    .reduce((acc, l) => acc + l.duration, 0);
  const remainingLessons = totalLessons - completedLessons;

  const stats = [
    {
      label: 'Выполнено',
      value: `${completedLessons}/${totalLessons}`,
      icon: '✅',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Общее время',
      value: formatTime(totalTime),
      icon: '⏱️',
      color: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Потрачено',
      value: formatTime(completedTime),
      icon: '📊',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Осталось',
      value: `${remainingLessons} ур.`,
      icon: '📋',
      color: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="text-center p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
        >
          <div className="text-lg mb-0.5">{stat.icon}</div>
          <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-[10px] text-gray-400">{stat.label}</div>
        </motion.div>
      ))}

      {/* Progress bar */}
      {totalLessons > 0 && (
        <motion.div
          className="col-span-4 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Прогресс</span>
            <span>{Math.round((completedLessons / totalLessons) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedLessons / totalLessons) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
