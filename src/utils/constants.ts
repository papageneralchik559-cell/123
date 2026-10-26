import { Subject } from '../types';

export const SUBJECTS: Subject[] = [
  { name: 'Математика', color: '#6366f1', emoji: '📐' },
  { name: 'Русский язык', color: '#ec4899', emoji: '📝' },
  { name: 'Литература', color: '#8b5cf6', emoji: '📚' },
  { name: 'Физика', color: '#06b6d4', emoji: '⚡' },
  { name: 'Химия', color: '#10b981', emoji: '🧪' },
  { name: 'Биология', color: '#84cc16', emoji: '🌿' },
  { name: 'История', color: '#f59e0b', emoji: '🏛️' },
  { name: 'География', color: '#0ea5e9', emoji: '🌍' },
  { name: 'Английский', color: '#ef4444', emoji: '🇬🇧' },
  { name: 'Информатика', color: '#7c3aed', emoji: '💻' },
  { name: 'Другое', color: '#64748b', emoji: '📖' },
];

export const BREAK_DURATION = 300; // 5 minutes break

export const PRESET_TIMES = [
  { label: '15 мин', value: 900 },
  { label: '20 мин', value: 1200 },
  { label: '25 мин', value: 1500 },
  { label: '30 мин', value: 1800 },
  { label: '45 мин', value: 2700 },
  { label: '60 мин', value: 3600 },
];
