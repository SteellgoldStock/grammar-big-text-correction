import { useCorrectionStore } from '@/app/store/CorrectionStore';
import { useHistoryStore } from '@/app/store/HistoryStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash } from 'lucide-react';
import { useState } from 'react';

export const HistoryModal = () => {
  const histories = useHistoryStore((state) => state.histories);
  const remove = useHistoryStore((state) => state.remove);
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Open history</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>History</DialogTitle>
        </DialogHeader>
        <ul className="flex flex-col gap-2 max-h-96 overflow-auto">
          {histories.length === 0 ? <p>No histories</p> : null}
          {histories.map((history, i) => {
            return (
              <li
                className="justify-between items-center border flex  border-border select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                key={i}
                onClick={() => {
                  setOpen(false);
                  useCorrectionStore.setState({
                    original: history.original,
                    final: history.final,
                  });
                }}
              >
                <span>{history.original.slice(0, 40)}</span>
                <div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(i);
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
