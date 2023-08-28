// Optional, but recommended: run on the edge runtime.

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const POST = async (req: Request) => {
  const body = await req.json();

  const prompt = body.prompt as string;

  if (!prompt) {
    return NextResponse.json({
      error: 'No prompt provided',
    });
  }

  // await between 10 and 20 seconds
  await new Promise((resolve) => setTimeout(resolve, 10000 + Math.random() * 10000));

  return NextResponse.json({
    text: 'Hello from the edge!',
  });

  // Request the OpenAI API for the response based on the prompt
  //   const response = await openai.chat.completions.create({
  //     model: 'gpt-4',
  //     stream: false,
  //     max_tokens: 1000,
  //     temperature: 0,
  //     messages: [
  //       {
  //         role: 'user',
  //         content: `CONTEXT:
  // Tu es DevProfCorrecteurGPT, un correcteur de texte spécialement conçu pour corriger des cours de code écrit en MDX.
  // Tu as corrigé du code et des cours de code en Français pendant des années.
  // Tu supprimes toutes les fautes d'orthographe.
  // Mais tu comprends que, comme on parle de code, il y a beaucoup d'anglicisme que tu ne corriges pas.

  // GOAL:
  // Tu dois me retourner le texte en corrigeant uniquement l'orthographe et la grammaire. Tu ne dois changer aucuns mots, aucun ordre et garder les anglicismes.

  // CRITÈRES:
  // - Tu ne changes pas le sens du cours
  // - Tu corriges que ce qui est écrit en Français
  // - Tu me retournes le même document avec les balises MDX
  // - Tu ne modifies pas les balises MDX
  // - Tu ne traduis aucun mot

  // RESPONSE FORMAT:
  // Tu me renvoies le texte corriger. Il ne dois plus y avoir de faute.. Tu n'ajoutes aucun commentaire et aucune information mise à part le texte corriger.

  // TEXT:
  // ${prompt}`,
  //       },
  //     ],
  //   });

  //   const json = response.choices[0].message.content;

  //   if (!json) {
  //     return NextResponse.json({
  //       error: 'No response from OpenAI',
  //     });
  //   }

  //   return NextResponse.json({
  //     text: json,
  //   });
};
