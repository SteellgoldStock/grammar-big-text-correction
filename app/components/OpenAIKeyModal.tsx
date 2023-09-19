import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef } from 'react';
import { toast } from 'sonner';
import { useConfigStore } from '../store/ConfigStore';
import Link from 'next/link';

export function OpenAIKeyModal() {
  const key = useConfigStore((state) => state.apiKey);
  const setKey = useConfigStore((state) => state.setApiKey);
  const { maxCharacters, setMaxCharacters } = useConfigStore();

  const ref = useRef<HTMLInputElement>(null);
  return (
    <Dialog open={!key ? true : undefined}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full">
          OpenAI API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>OpenAI Key</DialogTitle>
          <DialogDescription>
            You can get your key from{' '}
            <Link className='text-white underline' href="https:/platform.openai.com/account/api-keys">here</Link>
            , enter it below to get started with the app.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex-col space-y-1">
            <Label htmlFor="api-key">Your API key</Label>
            <Input defaultValue={key} ref={ref} id="api-key" placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
          </div>

          <div className="flex-col space-y-1">
            <Label htmlFor="max-characters">Max characters per request</Label>
            <Input
              defaultValue={3000}
              type="number" id="max-characters" value={maxCharacters} onChange={(e) => setMaxCharacters(Number(e.target.value))} />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              const value = ref.current?.value;

              if (value) {
                setKey(value);
                toast.success('Saved!');
              } else {
                toast.error('Please enter a valid key');
              }
            }}
            type="submit"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
