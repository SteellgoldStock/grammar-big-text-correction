'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const CopyButton = ({ text }: { text?: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
    }
  };

  return <Button onClick={copy}>{copied ? 'Copied!' : 'Copy'}</Button>;
};
