import type { Question } from '../../_components/types';

/**
 * Undo/redo stacks for the question list, kept free of React/DOM so the
 * bookkeeping (coalescing, stack limits, redo invalidation) can be
 * unit-tested. The component owns the store in a ref and turns returned
 * snapshots into commit + focus effects.
 */
export interface QuestionSnapshot {
  questions: Question[];
  /** Row focused when the snapshot was taken — refocused on restore. */
  focusId: string | null;
}

export interface QuestionHistory {
  past: QuestionSnapshot[];
  future: QuestionSnapshot[];
  /** Last text edit, so a typing burst collapses into one undo step. */
  lastTextEdit: { id: string; at: number } | null;
}

export const HISTORY_LIMIT = 100;
/** Keystrokes on the same row within this window share one undo step. */
export const HISTORY_COALESCE_MS = 800;

export function createQuestionHistory(): QuestionHistory {
  return { past: [], future: [], lastTextEdit: null };
}

/**
 * Record the state a commit is about to replace. Text edits pass their row id
 * as `coalesceRowId`; consecutive edits to that row within the coalescing
 * window fold into the previous step instead of pushing a new one. Any new
 * step invalidates the redo stack.
 */
export function recordCommit(
  history: QuestionHistory,
  snapshot: QuestionSnapshot,
  coalesceRowId?: string,
  now: number = Date.now()
): void {
  const last = history.lastTextEdit;
  const coalesce =
    coalesceRowId != null &&
    last?.id === coalesceRowId &&
    now - last.at < HISTORY_COALESCE_MS;

  if (!coalesce) {
    history.past.push(snapshot);
    if (history.past.length > HISTORY_LIMIT) history.past.shift();
    history.future = [];
  }
  history.lastTextEdit = coalesceRowId ? { id: coalesceRowId, at: now } : null;
}

/**
 * Pop the undo stack, saving `current` for redo. Returns the snapshot to
 * restore, or null when there is nothing to undo.
 */
export function undo(
  history: QuestionHistory,
  current: QuestionSnapshot
): QuestionSnapshot | null {
  const entry = history.past.pop();
  if (!entry) return null;
  history.future.push(current);
  // The next keystroke starts a fresh step instead of folding into the
  // one that was just undone.
  history.lastTextEdit = null;
  return entry;
}

/** Mirror of `undo`, walking the redo stack back onto the undo stack. */
export function redo(
  history: QuestionHistory,
  current: QuestionSnapshot
): QuestionSnapshot | null {
  const entry = history.future.pop();
  if (!entry) return null;
  history.past.push(current);
  history.lastTextEdit = null;
  return entry;
}
