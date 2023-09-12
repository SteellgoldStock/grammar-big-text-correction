import OpenAI from 'openai';
import { useConfigStore } from '../store/ConfigStore';
import { promptMap } from './prompt-list';

export const getCorrection = async (prompt: string) => {
  const { apiKey, promptType, promptModel } = useConfigStore.getState();

  if (!apiKey) {
    throw new Error('No OpenAI API key found');
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const basePrompt = promptMap[promptType];

  if (!basePrompt) {
    throw new Error('No prompt found');
  }

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: promptModel,
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
