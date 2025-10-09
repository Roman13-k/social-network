export function isLiteralFromSet<T extends readonly string[]>(
  literal: string,
  set: T,
): literal is T[number] {
  return (set as readonly string[]).includes(literal);
}
