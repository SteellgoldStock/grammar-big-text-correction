// app/page.tsx
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { redirect } from 'next/navigation';
import OpenAI from 'openai';

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <div>
      <form
        action={async (formData) => {
          'use server';
          const prompt = formData.get('prompt') as string;

          console.log('Server');
          redirect(`/result?prompt=${prompt}`);
        }}
      >
        <Textarea name="prompt" defaultValue={searchParams['prompt']} />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
