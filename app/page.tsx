'use client';

// app/page.tsx
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CopyButton } from './components/CopyButton';
import { DiffViewer } from './components/DiffViewer';
import { MaxCharactersInput } from './components/MaxCharactersInput';
import { OpenAIKeyModal } from './components/OpenAIKeyModal';
import { PromptModelSelect } from './components/PromptModelSelect';
import { PromptTypeSelect } from './components/PromptTypeSelect';
import { HistoryModal } from './components/histories/HistoryModal';
import { ProgressStatus, useCorrectionStore } from './store/CorrectionStore';

const fetchCorrection = async (prompt: string) => {
  return fetch('/ai', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
    }),
  }).then((res) => res.json());
};

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

type Progress = {
  part: number;
  isOk: boolean;
  length: number;
  started: boolean;
};

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { original, final, progress, start, clear } = useCorrectionStore();
  return (
    <div className="pt-4 container h-full flex flex-col">
      <CopyButton text={final} />
      <div className="flex-1 overflow-auto">
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
                  'bg-green-200': part.status === 'finished',
                  'bg-yellow-200': part.status === 'started',
                }
              )}
            >
              <span>{part.part}</span>
              <span>{getEmoji(part.status)}</span>
            </div>
          ))}
        </div>
      )}
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
          <Textarea name="prompt" defaultValue={searchParams['prompt']} />
          <Button type="submit">Submit</Button>
        </form>
        <div className="flex gap-2">
          <OpenAIKeyModal />
          <PromptTypeSelect />
          <PromptModelSelect />
          <Button onClick={clear}>Clear</Button>
          <HistoryModal />
          <MaxCharactersInput />
        </div>
      </fieldset>
    </div>
  );
}
