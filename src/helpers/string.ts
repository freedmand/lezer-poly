/**
 * Lowercases the first letter of text
 * @param text The text
 * @returns The text with the first letter lowercased
 */
export function lowercaseFirst(text: string): string {
  if (text.length === 0) return text;
  return text.charAt(0).toLowerCase() + text.substring(1);
}

/**
 * Uppercases the first letter of text
 * @param text The text
 * @returns The text with the first letter uppercased
 */
export function uppercaseFirst(text: string): string {
  if (text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.substring(1);
}

/**
 * Checks if the first letter of text is capital
 * @param text The text
 * @returns Whether the first letter of the text is uppercased
 */
export function isFirstUppercased(text: string): boolean {
  if (text.length === 0) return false;
  return text.charAt(0).toUpperCase() === text.charAt(0);
}
