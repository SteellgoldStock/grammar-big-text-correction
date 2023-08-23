// app/page.tsx
import { OpenAIStream } from 'ai';
import OpenAI from 'openai';
import { Suspense } from 'react';
import { CopyButton } from './CopyButton';
import { getText } from './getText';

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = 'node';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function Page({
  searchParams,
}: {
  // note that using searchParams opts your page into dynamic rendering. See https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
  searchParams: Record<string, string>;
}) {
  const file = await getText();

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    stream: true,
    max_tokens: 10000,
    messages: [
      {
        role: 'user',
        content: `CONTEXT:  
Tu es DevProfCorrecteurGPT, un correcteur de texte spécialement conçu pour corriger des cours de code écrit en MDX.
Tu as corrigé du code et des cours de code en Français pendant des années.
Tu supprimes toutes les fautes d'orthographe.
Mais tu comprends que, comme on parle de code, il y a beaucoup d'anglicisme que tu ne corriges pas.

GOAL:  
Tu dois me retourner le texte en corrigeant uniquement l'orthographe et la grammaire. Tu ne dois changer aucuns mots, aucun ordre et garder les anglicismes.

CRITERES:
- Tu ne changes pas le sens du cours
- Tu corriges que ce qui est écrit en Français
- Tu me retournes le même document avec les balises MDX
- Tu ne modifies pas les balises MDX
- Tu ne traduis aucun mot

RESPONSE FORMAT:
Tu me renvoies le texte corriger 1 fois. Tu n'ajoutes aucun commentaire et aucune information mise à part le texte corriger.

TEXT:
"""
${file}
"""
          `,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  const reader = stream.getReader();

  // We recursively render the stream as it comes in
  return (
    <div>
      <CopyButton />
      <Suspense>
        <Reader reader={reader} />
      </Suspense>
    </div>
  );
}

async function Reader({
  reader,
  prevText,
}: {
  reader: ReadableStreamDefaultReader<any>;
  prevText?: string;
}) {
  const { done, value } = await reader.read();

  if (done) {
    return null;
  }

  const text = new TextDecoder().decode(value);

  return (
    <span id="result">
      {text}
      <Suspense>
        <Reader reader={reader} prevText={text} />
      </Suspense>
    </span>
  );
}
