'use client';

// app/page.tsx
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
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
    // i want you to break the prompt in a array of string of maximum MAX_CHARACTERS characters
    // you need to break only at the end of a sentence

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
        const result = await fetchCorrection(part);
        setProgress((prev) => {
          const newProgress = [...prev];
          newProgress[index].isOk = true;
          return newProgress;
        });
        return result as { text: string };
      } catch (e) {
        return {
          text: '[[invalid response]]',
        };
      }
    });

    const results = await Promise.all(promises);

    console.log({ results });

    const finale = results.reduce((acc, current) => {
      return acc + current.text + '\n\n';
    }, '');

    setFinale(finale);

    setProgress([]);
  };

  return (
    <div className="mt-4 container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const prompt = formData.get('prompt') as string;
          handlePrompt(prompt);
        }}
      >
        <Textarea name="prompt" defaultValue={searchParams['prompt']} />
        <Button type="submit">Submit</Button>
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
      <CopyButton />
      <p id="result">{finale}</p>
    </div>
  );
}
