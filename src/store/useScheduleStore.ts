import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface DaySchedule {
  notes: string;
  brandSlugs: string[];
}

type ScheduleState = {
  /** 星期 key -> 日程数据 */
  schedules: Record<DayKey, DaySchedule>;
  updateSchedule: (day: DayKey, data: Partial<DaySchedule>) => void;
  clearAll: () => void;
};

const defaultSchedules: Record<DayKey, DaySchedule> = {
  mon: { notes: '', brandSlugs: [] },
  tue: { notes: '', brandSlugs: [] },
  wed: { notes: '', brandSlugs: [] },
  thu: { notes: '', brandSlugs: [] },
  fri: { notes: '', brandSlugs: [] },
  sat: { notes: '', brandSlugs: [] },
  sun: { notes: '', brandSlugs: [] },
};

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      schedules: defaultSchedules,
      updateSchedule: (day, data) => {
        const cur = get().schedules;
        set({
          schedules: {
            ...cur,
            [day]: {
              ...cur[day],
              ...data,
            },
          },
        });
      },
      clearAll: () => {
        set({ schedules: defaultSchedules });
      },
    }),
    { name: 'bp.schedule.v1' },
  ),
);
