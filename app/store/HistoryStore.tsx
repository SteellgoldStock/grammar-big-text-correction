import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = {
  histories: {
    original: string;
    final: string;
    date: Date;
  }[];
  remove: (index: number) => void;
};

export const useHistoryStore = create(
  persist<Store>(
    (set, get) => ({
      histories: [],
      remove: (index) => {
        set((state) => {
          const newHistories = [...state.histories];
          newHistories.splice(index, 1);
          return {
            histories: newHistories,
          };
        });
      },
    }),
    {
      name: 'correction-histories',
    }
  )
);
