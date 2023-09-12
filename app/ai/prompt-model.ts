import { z } from 'zod';

export const promptModel = ['gpt-4', 'gpt-3.5-turbo'] as const;

export const PromptModelSchema = z.enum(promptModel);

export type PromptModel = z.infer<typeof PromptModelSchema>;
