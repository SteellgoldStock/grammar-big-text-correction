import { diffWords } from 'diff';
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

type DiffProps = {
  inputA: string;
  inputB: string;
};

export const DiffViewer: React.FC<DiffProps> = ({ inputA, inputB }) => {
  const diff = useMemo(() => {
    const d = diffWords(inputA, inputB);

    const textWithSpan = d.map((part) => {
      if (!part.added && !part.removed) {
        return part.value;
      }

      const colorClass = part.added ? 'text-green-500' : 'text-red-500 line-through';

      return `<span class="${colorClass}">${part.value}</span>`;
    });

    const text = textWithSpan.join('');

    return text;
  }, [inputA, inputB]);

  return (
    <div id="display">
      {/* @ts-ignore */}
      <ReactMarkdown className='text-[#374151] w-full' rehypePlugins={[rehypeRaw]}>{diff}</ReactMarkdown>
    </div>
  );
};
