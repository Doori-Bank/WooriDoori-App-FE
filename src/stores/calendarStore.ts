import { create } from 'zustand';
import { Payment } from '@/components/calender/detail';

interface CalendarStore {
  currentDate: Date;
  selectedDate: number;
  detail: { day: string; data: Payment } | null;
  
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: number) => void;
  setDetail: (detail: { day: string; data: Payment } | null) => void;
  changeMonth: (direction: number) => void;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  currentDate: new Date(),
  selectedDate: new Date().getDate(),
  detail: null,
  
  setCurrentDate: (date) => set({ currentDate: date }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setDetail: (detail) => set({ detail }),
  
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