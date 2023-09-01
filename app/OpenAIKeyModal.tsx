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
import { useLocalStorage } from 'usehooks-ts';

export function OpenAIKeyModal() {
  const [key, setKey] = useLocalStorage('openai-key', '');
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Dialog open={!key ? true : undefined}>
      <DialogTrigger asChild>
        <Button variant="outline">API Key</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>OpenAI Key</DialogTitle>
          <DialogDescription>
            Give me your OpenAI key and Ill give you the world.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              OpenAI Key
            </Label>
            <Input defaultValue={key} ref={ref} id="name" className="col-span-3" />
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
