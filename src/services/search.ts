export async function generateSearchSuggestions(query: string): Promise<string[]> {
  // Just return some example suggestions for now
  return [
    `How to ${query}`,
    `${query} tips`,
    `${query} examples`,
    `Best tools for ${query}`,
    `Learn ${query} step-by-step`
  ];
}
