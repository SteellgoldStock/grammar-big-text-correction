import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCorrection } from '../ai/openai';
import { useConfigStore } from './ConfigStore';
import { useHistoryStore } from './HistoryStore';
import { textToSmallParts } from './correction-helper';

export type ProgressStatus = 'not-started' | 'started' | 'finished';

type Progress = {
  part: number;
  status: ProgressStatus;
};

type Store = {
  original: string;
  final: string;
  progress: Progress[];
  start: (original: string) => Promise<void>;
  clear: () => void;
};

export const useCorrectionStore = create(
  persist<Store>(
    (set, get) => ({
      original: '',
      final: '',
      progress: [],
      clear: () => {
        set({
          original: '',
          final: '',
          progress: [],
        });
      },
      start: async (newOriginal) => {
        const original = newOriginal.trim();
        const config = useConfigStore.getState();
        set({
          original,
          final: '',
        });
        const parts = textToSmallParts(original, config.maxCharacters);

        set({
          progress: parts.map((part, i) => ({
            part: i,
            status: 'not-started',
          })),
        });

        const promises = parts.map(async (part, index) => {
          try {
            await new Promise((resolve) => setTimeout(resolve, 5000 * index));

            set((state) => {
              const newProgress = [...state.progress];
              newProgress[index].status = 'started';
              return {
                progress: newProgress,
              };
            });

            const correction = await getCorrection(part);

            set((state) => {
              const newProgress = [...state.progress];
              newProgress[index].status = 'finished';
              return {
                progress: newProgress,
              };
            });
            return correction;
          } catch (e: any) {
            toast.error(e.message);
          }
        });

        const corrections = await Promise.all(promises);

        const final = corrections.join('\n\n');

        set({
          final,
          progress: [],
        });

        const previousHistory = useHistoryStore.getState().histories;
        previousHistory.push({
          original,
          final,
          date: new Date(),
        });

        console.log({ previousHistory });
        useHistoryStore.setState({
          histories: [...previousHistory],
        });
      },
    }),
    {
      name: 'correction-storage',
    }
  )
);
