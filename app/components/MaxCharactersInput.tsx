import { Input } from '@/components/ui/input';
import { useConfigStore } from '../store/ConfigStore';

export const MaxCharactersInput = () => {
  const { maxCharacters, setMaxCharacters } = useConfigStore();
  return (
    <Input
      type="number"
      value={maxCharacters}
      onChange={(e) => setMaxCharacters(Number(e.target.value))}
    />
  );
};
