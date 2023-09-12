import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PromptModelSchema, promptModel } from '../ai/prompt-model';
import { useConfigStore } from '../store/ConfigStore';

export function PromptModelSelect() {
  const prompt = useConfigStore((state) => state.promptModel);
  const setPrompt = useConfigStore((state) => state.setPromptModel);
  return (
    <Select
      value={prompt}
      onValueChange={(v) => {
        const parsedValue = PromptModelSchema.parse(v);
        setPrompt(parsedValue);
      }}
    >
      <SelectTrigger type="button" className="w-[100px]">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {promptModel.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
