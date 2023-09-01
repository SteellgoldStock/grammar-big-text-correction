import OpenAI from 'openai';
import { PromptKeySchema, promptMap } from './prompt-list';

const getLocalStorageItem = (key: string) => {
  const item = localStorage.getItem(key);

  console.log({ item, key });
  try {
    return JSON.parse(item || '');
  } catch (error) {
    return '';
  }
};

export const getCorrection = async (prompt: string) => {
  const apiKey = getLocalStorageItem('openai-key');
  const type = PromptKeySchema.parse(getLocalStorageItem('prompt-select'));

  if (!apiKey) {
    throw new Error('No OpenAI API key found');
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const basePrompt = promptMap[type];

  console.log({ basePrompt, prompt });

  if (!basePrompt) {
    throw new Error('No prompt found');
  }

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: false,
    max_tokens: 1000,
    temperature: 0,

    messages: [
      {
        role: 'user',
        content: basePrompt.replace('{{prompt}}', prompt),
      },
    ],
  });

  try {
    const json = response.choices[0].message.content;
    if (!json) {
      throw new Error('No response from OpenAI');
    }
    return json;
  } catch (error) {
    throw new Error('No response from OpenAI');
  }
};
