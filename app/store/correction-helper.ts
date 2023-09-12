export const textToSmallParts = (text: string, max: number) => {
  const splitText = [];
  const splitPrompt = text.split('\n\n');
  let currentString = '';
  for (let i = 0; i < splitPrompt.length; i++) {
    const currentSentence = splitPrompt[i];
    if (currentString.length + currentSentence.length > max) {
      splitText.push(currentString);
      currentString = '';
    }
    currentString += currentSentence + '\n\n';
  }
  splitText.push(currentString);

  return splitText;
};
