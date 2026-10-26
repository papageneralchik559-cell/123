import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import CircularProgress from './components/CircularProgress';
import LessonList from './components/LessonList';
import AddLessonForm from './components/AddLessonForm';
import Stats from './components/Stats';
import { Lesson } from './types';
import { playNotificationSound, playBreakSound } from './utils/audio';
import { BREAK_DURATION } from './utils/constants';

export default function App() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Add a new lesson
  const addLesson = useCallback((lesson: Lesson) => {
    setLessons((prev) => [...prev, lesson]);
    setShowForm(false);
  }, []);

  // Remove a lesson
  const removeLesson = useCallback(
    (id: string) => {
      setLessons((prev) => {
        const filtered = prev.filter((l) => l.id !== id);
        const removedIndex = prev.findIndex((l) => l.id === id);
        if (removedIndex < currentIndex) {
          setCurrentIndex((i) => i - 1);
        }
        return filtered;
      });
    },
    [currentIndex]
  );

  // Confetti effect
  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Start timer for current lesson
  const startLesson = useCallback(() => {
    if (lessons.length === 0 || currentIndex >= lessons.length) return;
    const lesson = lessons[currentIndex];
    setTimeRemaining(lesson.duration);
    setTotalTime(lesson.duration);
    setIsRunning(true);
    setIsPaused(false);
    setIsBreak(false);
  }, [lessons, currentIndex]);

  // Toggle pause
  const togglePause = useCallback(() => {
    setIsPaused((p) => !p);
  }, []);

  // Move to next lesson or break
  const moveToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= lessons.length) {
      // All done!
      setIsRunning(false);
      setIsPaused(false);
      setAllDone(true);
      playNotificationSound();
      triggerConfetti();
      return;
    }

    // Start break
    setIsBreak(true);
    setTimeRemaining(BREAK_DURATION);
    setTotalTime(BREAK_DURATION);
    setIsPaused(false);
    playBreakSound();
  }, [currentIndex, lessons.length]);

  // Skip to next
  const skipToNext = useCallback(() => {
    if (isRunning) {
      // Mark current as completed
      setLessons((prev) =>
        prev.map((l, i) => (i === currentIndex ? { ...l, completed: true } : l))
      );
    }
    moveToNext();
  }, [isRunning, currentIndex, moveToNext]);

  // Reset everything
  const resetAll = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setIsBreak(false);
    setCurrentIndex(0);
    setTimeRemaining(0);
    setTotalTime(0);
    setAllDone(false);
    setLessons((prev) => prev.map((l) => ({ ...l, completed: false })));
  }, []);

  // Timer interval
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up
            if (isBreak) {
              // Break finished, start next lesson
              setIsBreak(false);
              const nextIndex = currentIndex + 1;
              if (nextIndex < lessons.length) {
                setCurrentIndex(nextIndex);
                const nextLesson = lessons[nextIndex];
                playNotificationSound();
                return nextLesson.duration;
              } else {
                setIsRunning(false);
                setAllDone(true);
                playNotificationSound();
                triggerConfetti();
                return 0;
              }
            } else {
              // Lesson finished
              setLessons((prevLessons) =>
                prevLessons.map((l, i) =>
                  i === currentIndex ? { ...l, completed: true } : l
                )
              );
              playNotificationSound();

              const nextIndex = currentIndex + 1;
              if (nextIndex < lessons.length) {
                setIsBreak(true);
                return BREAK_DURATION;
              } else {
                setIsRunning(false);
                setAllDone(true);
                triggerConfetti();
                return 0;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, isBreak, currentIndex, lessons]);

  // Update total time when break starts
  useEffect(() => {
    if (isBreak) {
      setTotalTime(BREAK_DURATION);
    }
  }, [isBreak]);

  const progress = totalTime > 0 ? 1 - timeRemaining / totalTime : 0;
  const currentLesson = lessons[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header with Hero Image */}
        <header className="text-center mb-6 animate-fade-in">
          <div className="relative mb-4 rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://image.qwenlm.ai/generated-images/87ee01bb-9f14-49f5-a01d-7cb602b27549/_result.png"
              alt="Учебное пространство"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-0 right-0 text-white">
              <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
                <span className="text-3xl">📚</span>
                Учебный Таймер
              </h1>
              <p className="text-sm opacity-90 mt-1">
                Управляй временем эффективно
              </p>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="mb-6 animate-fade-in-delay-1">
          <Stats lessons={lessons} currentIndex={currentIndex} />
        </div>

        {/* Timer */}
        <div className="flex justify-center mb-6 animate-fade-in-delay-2">
          <CircularProgress
            progress={progress}
            timeRemaining={timeRemaining}
            totalTime={totalTime}
            isBreak={isBreak}
            isRunning={isRunning}
            isPaused={isPaused}
            lessonName={currentLesson?.name || ''}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in-delay-3 flex-wrap">
          {!isRunning && !allDone ? (
            <button
              onClick={startLesson}
              disabled={lessons.length === 0}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl sm:rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all disabled:shadow-none"
            >
              <Play size={18} className="sm:hidden" />
              <Play size={20} className="hidden sm:block" />
              <span className="text-sm sm:text-base">Начать</span>
            </button>
          ) : (
            <>
              <button
                onClick={togglePause}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-medium shadow-lg transition-all ${
                  isPaused
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                {isPaused ? <Play size={14} className="sm:hidden" /> : <Pause size={14} className="sm:hidden" />}
                {isPaused ? <Play size={16} className="hidden sm:block" /> : <Pause size={16} className="hidden sm:block" />}
                <span className="text-xs sm:text-sm">{isPaused ? 'Продолжить' : 'Пауза'}</span>
              </button>

              <button
                onClick={skipToNext}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl sm:rounded-2xl font-medium shadow-md transition-all"
              >
                <SkipForward size={14} className="sm:hidden" />
                <SkipForward size={16} className="hidden sm:block" />
                <span className="text-xs sm:text-sm">Пропустить</span>
              </button>

              <button
                onClick={resetAll}
                className="flex items-center justify-center p-2.5 sm:p-3 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl sm:rounded-2xl font-medium transition-all"
                title="Сбросить"
              >
                <RotateCcw size={14} className="sm:hidden" />
                <RotateCcw size={16} className="hidden sm:block" />
              </button>
            </>
          )}
        </div>

        {/* All Done Celebration */}
        {allDone && (
          <div className="text-center mb-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 animate-fade-in overflow-hidden">
            <div className="relative mb-4">
              <img
                src="https://image.qwenlm.ai/generated-images/94abb8ef-5d8a-4fd2-8317-38b723e0c941/_result.png"
                alt="Поздравление"
                className="w-full h-40 object-cover rounded-xl shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent rounded-xl"></div>
            </div>
            <div className="text-5xl mb-3 animate-bounce-gentle">🏆</div>
            <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-1">
              Все уроки выполнены!
            </h2>
            <p className="text-sm text-green-600 dark:text-green-400 mb-4">
              Отличная работа! Ты молодец! 🎉
            </p>
            <button
              onClick={resetAll}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm shadow-md transition-all"
            >
              <Sparkles size={14} className="inline mr-1" />
              Начать заново
            </button>
          </div>
        )}

        {/* Add Lesson Form */}
        <div className="mb-6 animate-fade-in-delay-4">
          <AddLessonForm
            onAdd={addLesson}
            isOpen={showForm}
            onToggle={() => setShowForm(!showForm)}
          />
        </div>

        {/* Lesson List */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm animate-fade-in-delay-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              📋 Список уроков
            </h2>
            <span className="text-xs text-gray-400">
              {lessons.length} {lessons.length === 1 ? 'урок' : lessons.length < 5 ? 'урока' : 'уроков'}
            </span>
          </div>
          <LessonList
            lessons={lessons}
            currentIndex={currentIndex}
            onRemove={removeLesson}
            onReorder={setLessons}
          />
        </div>

        {/* Footer with image */}
        <div className="mt-8 animate-fade-in-delay-5">
          <div className="relative rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://image.qwenlm.ai/generated-images/2e93e417-1463-4aac-a13e-5ca9aac8e35f/_result.png"
              alt="Уютное учебное место"
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <p className="text-white text-sm font-medium">
                💡 Совет: делай перерывы между уроками для лучшего усвоения
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
