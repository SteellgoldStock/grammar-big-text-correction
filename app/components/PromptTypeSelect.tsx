import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PromptKeySchema, promptKeys } from '../ai/prompt-list';
import { useConfigStore } from '../store/ConfigStore';

export function PromptTypeSelect() {
  const prompt = useConfigStore((state) => state.promptType);
  const setPrompt = useConfigStore((state) => state.setPromptType);
  return (
    <Select
      value={prompt}
      onValueChange={(v) => {
        const parsedValue = PromptKeySchema.parse(v);
        setPrompt(parsedValue);
      }}
    >
      <SelectTrigger type="button" className="w-[120px]">
        <SelectValue placeholder="Model" />
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
