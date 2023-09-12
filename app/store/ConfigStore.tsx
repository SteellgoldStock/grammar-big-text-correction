import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PromptKey } from '../ai/prompt-list';
import { PromptModel } from '../ai/prompt-model';

type Store = {
  apiKey: string;
  promptType: PromptKey;
  promptModel: PromptModel;
  setApiKey: (apiKey: string) => void;
  setPromptType: (promptType: PromptKey) => void;
  setPromptModel: (promptModel: PromptModel) => void;
};

export const useConfigStore = create(
  persist<Store>(
    (set, get) => ({
      apiKey: '',
      promptType: 'english',
      setApiKey: (apiKey: string) => set({ apiKey }),
      setPromptType: (promptType: PromptKey) => set({ promptType }),
      promptModel: 'gpt-4',
      setPromptModel: (promptModel: PromptModel) => set({ promptModel }),
    }),
    {
      name: 'correction-config',
    }
  )
);