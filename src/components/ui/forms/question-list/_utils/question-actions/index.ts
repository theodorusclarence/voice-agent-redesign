import { nanoid } from 'nanoid';

import { splitPastedQuestions } from '../split-pasted-questions';
import type { Question } from '../../_components/types';

/**
 * The outcome of a question-list interaction, kept free of side effects so it
 * can be unit-tested. The component turns it into DOM/React effects:
 * - `commit`    — replace the list with `questions` and focus `focusId`.
 * - `attention` — no change; focus `id` and play its wiggle (draw the eye).
 * - `none`      — do nothing.
 */
export type QuestionsAction =
  | { type: 'commit'; questions: Question[]; focusId: string | null }
  | { type: 'attention'; id: string }
  | { type: 'none' };

/**
 * Enter: insert a blank row directly after `id` and focus it. Same rule as
 * the Add button: if a blank row already exists (the current one included),
 * don't stack another — focus and wiggle it instead.
 */
export function insertQuestionAfter(
  questions: Question[],
  id: string,
  newId: () => string = nanoid
): QuestionsAction {
  const index = questions.findIndex((q) => q.id === id);
  if (index === -1) return { type: 'none' };

  const empty = questions.find((q) => q.text === '');
  if (empty) return { type: 'attention', id: empty.id };

  const focusId = newId();
  const next = questions.slice();
  next.splice(index + 1, 0, { id: focusId, text: '' });
  return { type: 'commit', questions: next, focusId };
}

/**
 * Backspace on an empty row: remove it and focus the neighbour that slides into
 * its place. The list never goes empty — deleting the last row is refused and
 * asks for an attention wiggle instead.
 */
export function removeEmptyQuestion(
  questions: Question[],
  id: string
): QuestionsAction {
  const index = questions.findIndex((q) => q.id === id);
  if (index === -1) return { type: 'none' };
  if (questions.length === 1) return { type: 'attention', id };

  const next = questions.slice();
  next.splice(index, 1);
  // Prefer the previous row; fall back to the one now at this index (removing
  // the first row) and finally to nothing.
  const focusId = next[index - 1]?.id ?? next[index]?.id ?? null;
  return { type: 'commit', questions: next, focusId };
}

/**
 * Add button: if a blank row already exists, don't stack another — ask to focus
 * and wiggle the first empty one. Otherwise append a fresh blank row.
 */
export function addQuestion(
  questions: Question[],
  newId: () => string = nanoid
): QuestionsAction {
  const empty = questions.find((q) => q.text === '');
  if (empty) return { type: 'attention', id: empty.id };

  const focusId = newId();
  return {
    type: 'commit',
    questions: [...questions, { id: focusId, text: '' }],
    focusId,
  };
}

/**
 * Paste newline-separated text into the row `id`, splitting around the caret
 * (`before`/`after` are the row's text on each side of it). The first line
 * stays in the row and the rest become new rows after it; focus lands on the
 * last resulting row. Returns `none` when the paste has no meaningful content.
 */
export function pasteQuestions(
  questions: Question[],
  id: string,
  before: string,
  pasted: string,
  after: string,
  newId: () => string = nanoid
): QuestionsAction {
  const index = questions.findIndex((q) => q.id === id);
  if (index === -1) return { type: 'none' };

  const parts = splitPastedQuestions(before, pasted, after);
  if (parts.length === 0) return { type: 'none' };

  const extra = parts.slice(1).map((text) => ({ id: newId(), text }));
  const next = questions.slice();
  next[index] = { ...next[index], text: parts[0] };
  next.splice(index + 1, 0, ...extra);
  const focusId = extra.at(-1)?.id ?? id;
  return { type: 'commit', questions: next, focusId };
}
