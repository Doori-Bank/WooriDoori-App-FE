import { create } from 'zustand';
import { Payment } from '@/components/calender/detail';

export interface DiaryEntry {
  date: string; // YYYY-MM-DD
  content: string;
  emotion: number; // 0-4 (매우 좋음, 좋음, 보통, 나쁨, 매우 나쁨)
  diaryId?: number; // 백엔드 일기 ID (수정/삭제 시 필요)
}

interface CalendarStore {
  currentDate: Date;
  selectedDate: number;
  detail: { day: string; data: Payment } | null;
  dutchPayModal: Payment | null;
  diaryEntries: Record<string, DiaryEntry>; // { "2025-10-15": { date, content } }
  
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: number) => void;
  setDetail: (detail: { day: string; data: Payment } | null) => void;
  setDutchPayModal: (payment: Payment | null) => void;
  setDiaryEntry: (date: string, entry: DiaryEntry) => void;
  getDiaryEntry: (date: string) => DiaryEntry | null;
  changeMonth: (direction: number) => void;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  currentDate: new Date(),
  selectedDate: new Date().getDate(),
  detail: null,
  dutchPayModal: null,
  diaryEntries: {},
  
  setCurrentDate: (date) => set({ currentDate: date }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setDetail: (detail) => set({ detail }),
  setDutchPayModal: (payment) => set({ dutchPayModal: payment }),
  setDiaryEntry: (date, entry) => set((state) => ({
    diaryEntries: { ...state.diaryEntries, [date]: entry }
  })),
  getDiaryEntry: (date) => {
    const state = get();
    return state.diaryEntries[date] || null;
  },
  
  changeMonth: (direction) => {
    const { currentDate } = get();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    set({ 
      currentDate: new Date(year, month + direction, 1),
      selectedDate: 1
    });
  },
}));