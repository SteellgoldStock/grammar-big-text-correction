'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const CopyButton = () => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const content = document.querySelector('#result')?.textContent;
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
    }
  };

  return <Button onClick={copy}>{copied ? 'Copied!' : 'Copy'}</Button>;
};
