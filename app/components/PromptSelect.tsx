import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLocalStorage } from 'usehooks-ts';
import { PromptKey, PromptKeySchema, promptKeys } from '../ai/prompt-list';

export function PromptSelect() {
  const [value, setValue] = useLocalStorage<PromptKey>('prompt', promptKeys[0]);
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        const parsedValue = PromptKeySchema.parse(v);
        setValue(parsedValue);
      }}
    >
      <SelectTrigger type="button" className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {promptKeys.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
