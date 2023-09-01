'use client';

// app/page.tsx
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { OpenAIKeyModal } from './OpenAIKeyModal';
import { PromptSelect } from './PromptSelect';
import { DiffViewer } from './diff-viewer';
import { getCorrection } from './openai';
import { CopyButton } from './result/CopyButton';

const fetchCorrection = async (prompt: string) => {
  return fetch('/ai', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
    }),
  }).then((res) => res.json());
};

const getEmoji = (started: boolean, isOk: boolean) => {
  if (!started) {
    return '⏳';
  }
  if (isOk) {
    return '✅';
  }
  return '🤔';
};

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const [original, setOriginal] = useState('');
  const [finale, setFinale] = useState('');
  const [progress, setProgress] = useState<
    {
      part: number;
      isOk: boolean;
      length: number;
      started: boolean;
    }[]
  >([]);

  const handlePrompt = async (prompt: string) => {
    const MAX_CHARACTERS = 3000;
    setOriginal(prompt);

    const splitText = [];
    const splitPrompt = prompt.split('\n\n');
    let currentString = '';
    for (let i = 0; i < splitPrompt.length; i++) {
      console.log(i, currentString.length);
      const currentSentence = splitPrompt[i];
      if (currentString.length + currentSentence.length > MAX_CHARACTERS) {
        splitText.push(currentString);
        currentString = '';
      }
      currentString += currentSentence + '\n\n';
    }
    splitText.push(currentString);

    setProgress(
      splitText.map((part, i) => ({
        part: i,
        length: part.length,
        isOk: false,
        started: false,
      }))
    );

    const promises = splitText.map(async (part, index) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000 * index));
        setProgress((prev) => {
          const newProgress = [...prev];
          newProgress[index].started = true;
          return newProgress;
        });
        const result = await getCorrection(part);
        setProgress((prev) => {
          const newProgress = [...prev];
          newProgress[index].isOk = true;
          return newProgress;
        });
        return result;
      } catch (e: any) {
        toast.error(e.message);
        return '[[invalid response]]';
      }
    });

    const results = await Promise.all(promises);

    console.log({ results });

    const finale = results.reduce((acc, current) => {
      return acc + current + '\n\n';
    }, '');

    setFinale(finale);

    setProgress([]);
  };

  return (
    <div className="pt-4 container h-full flex flex-col">
      <CopyButton />
      {original && finale && <DiffViewer inputA={original} inputB={finale} />}
      <DiffViewer
        inputA={`## Titre
      
J'aime **manggge des noulles.**`}
        inputB={`## Titre

J'aime **manger des nouilles**.`}
      />

      <p id="result" className="hidden">
        {finale}
      </p>
      <form
        className="mt-auto"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const prompt = formData.get('prompt') as string;
          handlePrompt(prompt);
        }}
      >
        <Textarea name="prompt" defaultValue={searchParams['prompt']} />
        <div className="flex gap-2 my-4">
          <Button type="submit">Submit</Button>
          <OpenAIKeyModal />
          <PromptSelect />
        </div>
      </form>
      {progress && (
        <div>
          {progress.map((part) => (
            <div key={part.part}>
              <span>{part.part}</span>
              <span>{getEmoji(part.started, part.isOk)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
