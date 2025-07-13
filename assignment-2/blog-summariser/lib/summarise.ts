export function fakeSummarise(text: string): string {
  const sentences = text.split('.').slice(0, 3).join('.') + '.';
  return sentences;
}
