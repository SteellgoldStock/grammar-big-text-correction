import Diff from 'diff';
import React, { useMemo } from 'react';

type DiffProps = {
  inputA: string;
  inputB: string;
};

export const DiffViewer: React.FC<DiffProps> = ({ inputA, inputB }) => {
  const diff = useMemo(() => Diff.diffChars(inputA, inputB), [inputA, inputB]);

  return (
    <div id="display">
      {diff.map((part, index) => {
        const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
        return (
          <span key={index} style={{ color }}>
            {part.value}
          </span>
        );
      })}
    </div>
  );
};
