import {
  createQuestionHistory,
  HISTORY_COALESCE_MS,
  HISTORY_LIMIT,
  type QuestionSnapshot,
  recordCommit,
  redo,
  undo,
} from '.';
import type { Question } from '../../_components/types';

const q = (id: string, text = ''): Question => ({ id, text });

const snap = (
  questions: Question[],
  focusId: string | null = null
): QuestionSnapshot => ({ questions, focusId });

describe('recordCommit', () => {
  it('pushes the replaced state onto the undo stack', () => {
    const history = createQuestionHistory();
    recordCommit(history, snap([q('a', 'A')], 'a'));
    expect(history.past).toEqual([snap([q('a', 'A')], 'a')]);
  });

  it('coalesces same-row text edits inside the window into one step', () => {
    const history = createQuestionHistory();
    recordCommit(history, snap([q('a', '')]), 'a', 1000);
    recordCommit(history, snap([q('a', 'h')]), 'a', 1200);
    recordCommit(history, snap([q('a', 'he')]), 'a', 1400);
    // One step: undoing returns to the state before the burst.
    expect(history.past).toEqual([snap([q('a', '')])]);
  });

  it('starts a new step when the pause exceeds the window', () => {
    const history = createQuestionHistory();
    recordCommit(history, snap([q('a', '')]), 'a', 1000);
    recordCommit(
      history,
      snap([q('a', 'hey')]),
      'a',
      1000 + HISTORY_COALESCE_MS
    );
    expect(history.past).toHaveLength(2);
  });

  it('does not coalesce edits on different rows', () => {
    const history = createQuestionHistory();
    recordCommit(history, snap([q('a', ''), q('b', '')]), 'a', 1000);
    recordCommit(history, snap([q('a', 'A'), q('b', '')]), 'b', 1100);
    expect(history.past).toHaveLength(2);
  });

  it('never coalesces structural commits, even mid-burst', () => {
    const history = createQuestionHistory();
    recordCommit(history, snap([q('a', '')]), 'a', 1000);
    // e.g. Enter inserting a row right after typing
    recordCommit(history, snap([q('a', 'A')]), undefined, 1100);
    // and typing right after the structural change starts a fresh step too
    recordCommit(history, snap([q('a', 'A'), q('b', '')]), 'b', 1200);
    expect(history.past).toHaveLength(3);
  });

  it('invalidates the redo stack on a new step', () => {
    const history = createQuestionHistory();
    recordCommit(history, snap([q('a', 'A')]));
    undo(history, snap([q('a', 'B')]));
    expect(history.future).toHaveLength(1);

    recordCommit(history, snap([q('a', 'A')]));
    expect(history.future).toEqual([]);
  });

  it('drops the oldest step past the limit', () => {
    const history = createQuestionHistory();
    for (let i = 0; i <= HISTORY_LIMIT; i++) {
      recordCommit(history, snap([q('a', `v${i}`)]));
    }
    expect(history.past).toHaveLength(HISTORY_LIMIT);
    expect(history.past[0]).toEqual(snap([q('a', 'v1')]));
  });
});

describe('undo / redo', () => {
  it('returns null when there is nothing to undo or redo', () => {
    const history = createQuestionHistory();
    expect(undo(history, snap([q('a')]))).toBeNull();
    expect(redo(history, snap([q('a')]))).toBeNull();
  });

  it('round-trips: undo restores the snapshot, redo restores the present', () => {
    const history = createQuestionHistory();
    const before = snap([q('a', 'A')], 'a');
    const after = snap([q('a', 'A'), q('b', '')], 'b');
    recordCommit(history, before);

    expect(undo(history, after)).toEqual(before);
    expect(redo(history, before)).toEqual(after);
    // and the undo step is back for another round
    expect(history.past).toEqual([before]);
  });

  it('breaks coalescing, so typing after an undo starts a fresh step', () => {
    const history = createQuestionHistory();
    recordCommit(history, snap([q('a', '')]), 'a', 1000);
    undo(history, snap([q('a', 'h')]));

    recordCommit(history, snap([q('a', '')]), 'a', 1100);
    // Not folded into the undone step: it stands on its own.
    expect(history.past).toEqual([snap([q('a', '')])]);
    expect(history.future).toEqual([]);
  });
});
