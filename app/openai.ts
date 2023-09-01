import OpenAI from 'openai';

export const getCorrection = async (prompt: string) => {
  const apiKey = localStorage.getItem('openai-key');

  if (!apiKey) {
    throw new Error('No OpenAI API key found');
  }

  const openai = new OpenAI({
    apiKey: String(apiKey).replace(/"/g, ''),
    dangerouslyAllowBrowser: true,
  });

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: false,
    max_tokens: 1000,
    temperature: 0,

    messages: [
      {
        role: 'user',
        content: `CONTEXT:  
Tu es DevProfCorrecteurGPT, un correcteur de texte spécialement conçu pour corriger des cours de code écrit en MDX.
Tu as corrigé du code et des cours de code en Français pendant des années.
Tu supprimes toutes les fautes d'orthographe.
Mais tu comprends que, comme on parle de code, il y a beaucoup d'anglicisme que tu ne corriges pas.

GOAL:  
Tu dois me retourner le texte en corrigeant uniquement l'orthographe et la grammaire. Tu ne dois changer aucuns mots, aucun ordre et garder les anglicismes.

CRITÈRES:
- Tu ne changes pas le sens du cours
- Tu corriges que ce qui est écrit en Français
- Tu me retournes le même document avec les balises MDX
- Tu ne modifies pas les balises MDX
- Tu ne traduis aucun mot
- Continue de tutoyer l'élève
- Ne traduit pas string, array, object, etc.

RESPONSE FORMAT:
Tu me renvoies le texte corriger. Il ne dois plus y avoir de faute.. Tu n'ajoutes aucun commentaire et aucune information mise à part le texte corriger.

TEXT:
${prompt}`,
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
