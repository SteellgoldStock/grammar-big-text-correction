'use client';

// app/page.tsx
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CopyButton } from './components/CopyButton';
import { DiffViewer } from './components/DiffViewer';
import { OpenAIKeyModal } from './components/OpenAIKeyModal';
import { PromptModelSelect } from './components/PromptModelSelect';
import { PromptTypeSelect } from './components/PromptTypeSelect';
import { HistoryModal } from './components/histories/HistoryModal';
import { ProgressStatus, useCorrectionStore } from './store/CorrectionStore';
import { Paperclip, Send } from 'lucide-react';
import { useState } from 'react';
import { ToggleTheme } from '@/components/ui/theme-switch';

const getEmoji = (status: ProgressStatus) => {
  switch (status) {
    case 'finished':
      return '✅';
    case 'started':
      return '🕐';
    default:
      return '⌛️';
  }
};

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { original, final, progress, start, clear } = useCorrectionStore();
  const [prompt, setPrompt] = useState(searchParams['prompt'] || original || '');

  return (
    <div className=" container h-full flex flex-col w-full">
      <ToggleTheme />
      <div className="flex-1 overflow-auto w-full mt-3 sm:mt-6">
        {original && final && <DiffViewer inputA={original} inputB={final} />}
      </div>

      {progress && (
        <div className="flex my-2 gap-2">
          {progress.map((part) => (
            <div
              key={part.part}
              className={cn(
                'flex items-center gap-1 bg-gray-200 px-2 py-1 rounded',
                {
                  'bg-green-200 dark:bg-green-800': part.status === 'finished',
                  'bg-yellow-200 dark:bg-yellow-800': part.status === 'started',
                }
              )}
            >
              <span>{part.part}</span>
              <span>{getEmoji(part.status)}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="relative flex flex-col gap-2">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2">
            <CopyButton text={final} />
            <Button onClick={() => {
              clear();
              setPrompt('');
            }}>Clear</Button>
            <HistoryModal />
          </div>
          <div className="flex gap-2">
            <OpenAIKeyModal />
            <PromptTypeSelect />
            <PromptModelSelect />
          </div>
        </div>
        
        <fieldset disabled={progress.length > 0} className="flex flex-col gap-2 mb-2">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const prompt = formData.get('prompt') as string;
              start(prompt);
            }}
          >
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2 items-center">
                <Textarea 
                  placeholder="Enter your message to correct here"
                  name="prompt"
                  value={prompt}
                  defaultValue={searchParams['prompt']}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="resize-none w-full" />
                <Button type="submit" className="flex items-center gap-2" disabled={
                    prompt.length === 0 ||
                    prompt.trim().length === 0 ||
                    prompt.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").length === 0
                  }>
                  <Send size={14} fill="currentColor" />
                </Button>
              </div>
            </div>
          </form>
          <div className="grid grid-cols-4 gap-2">
          </div>
        </fieldset>
      </div>
    </div>
  );
}
