/**
 * Splits pasted text into question lines, merging it into a row's existing text
 * around the caret: `before` (the text left of the caret) joins the first
 * pasted line and `after` (the text right of the caret) joins the last. Every
 * line is trimmed and blank lines are dropped, so the result is exactly the
 * list of non-empty question texts the paste should produce.
 */
export function splitPastedQuestions(
  before: string,
  pasted: string,
  after: string
): string[] {
  return (before + pasted + after)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
