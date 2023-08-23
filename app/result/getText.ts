import { readFile } from 'fs/promises';
import path from 'path';

export const getText = async () => {
  const file = await readFile(
    path.join(process.cwd(), '/app/result/text.txt'),
    'utf-8'
  );
  return file;
};
