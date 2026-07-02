import {
  addQuestion,
  insertQuestionAfter,
  pasteQuestions,
  removeEmptyQuestion,
} from '.';
import type { Question } from '../../_components/types';

/** Deterministic id generator so results can be asserted with `toEqual`. */
function idFactory() {
  let n = 0;
  return () => `n${n++}`;
}

const q = (id: string, text = ''): Question => ({ id, text });

describe('insertQuestionAfter', () => {
  it('inserts a blank row after the target and focuses it', () => {
    const questions = [q('a', 'A'), q('b', 'B')];
    expect(insertQuestionAfter(questions, 'a', idFactory())).toEqual({
      type: 'commit',
      questions: [q('a', 'A'), q('n0'), q('b', 'B')],
      focusId: 'n0',
    });
  });

  it('appends when the target is the last row', () => {
    expect(insertQuestionAfter([q('a', 'A')], 'a', idFactory())).toEqual({
      type: 'commit',
      questions: [q('a', 'A'), q('n0')],
      focusId: 'n0',
    });
  });

  it('is a no-op for an unknown id', () => {
    expect(insertQuestionAfter([q('a')], 'nope')).toEqual({ type: 'none' });
  });

  it('does not mutate the input array', () => {
    const questions = [q('a', 'A')];
    insertQuestionAfter(questions, 'a', idFactory());
    expect(questions).toEqual([q('a', 'A')]);
  });
});

describe('removeEmptyQuestion', () => {
  it('removes a middle row and focuses the previous one', () => {
    const questions = [q('a', 'A'), q('b', 'B'), q('c', 'C')];
    expect(removeEmptyQuestion(questions, 'b')).toEqual({
      type: 'commit',
      questions: [q('a', 'A'), q('c', 'C')],
      focusId: 'a',
    });
  });

  it('removes the first row and focuses the new first row', () => {
    const questions = [q('a', 'A'), q('b', 'B')];
    expect(removeEmptyQuestion(questions, 'a')).toEqual({
      type: 'commit',
      questions: [q('b', 'B')],
      focusId: 'b',
    });
  });

  it('removes the last row and focuses the previous one', () => {
    const questions = [q('a', 'A'), q('b', 'B')];
    expect(removeEmptyQuestion(questions, 'b')).toEqual({
      type: 'commit',
      questions: [q('a', 'A')],
      focusId: 'a',
    });
  });

  it('refuses to delete the only row and asks for attention', () => {
    expect(removeEmptyQuestion([q('a')], 'a')).toEqual({
      type: 'attention',
      id: 'a',
    });
  });

  it('is a no-op for an unknown id', () => {
    expect(removeEmptyQuestion([q('a'), q('b')], 'nope')).toEqual({
      type: 'none',
    });
  });
});

describe('addQuestion', () => {
  it('appends a blank row and focuses it when none are empty', () => {
    expect(addQuestion([q('a', 'A')], idFactory())).toEqual({
      type: 'commit',
      questions: [q('a', 'A'), q('n0')],
      focusId: 'n0',
    });
  });

  it('targets the first existing empty row for attention instead of adding', () => {
    const questions = [q('a', 'A'), q('b', ''), q('c', '')];
    expect(addQuestion(questions, idFactory())).toEqual({
      type: 'attention',
      id: 'b',
    });
  });
});

describe('pasteQuestions', () => {
  it('splits a multiline paste into rows and focuses the last', () => {
    const questions = [q('a', '')];
    expect(
      pasteQuestions(questions, 'a', '', 'One\nTwo\nThree', '', idFactory())
    ).toEqual({
      type: 'commit',
      questions: [q('a', 'One'), q('n0', 'Two'), q('n1', 'Three')],
      focusId: 'n1',
    });
  });

  it('merges the caret text: before joins the first line, after the last', () => {
    const questions = [q('a', 'Ques'), q('z', 'Z')];
    // Caret splits "Question" between "Ques" and "tion"; paste "X\nY".
    expect(
      pasteQuestions(questions, 'a', 'Ques', 'X\nY', 'tion', idFactory())
    ).toEqual({
      type: 'commit',
      questions: [q('a', 'QuesX'), q('n0', 'Ytion'), q('z', 'Z')],
      focusId: 'n0',
    });
  });

  it('keeps focus on the same row when the paste yields a single line', () => {
    const questions = [q('a', '')];
    // Trailing newline collapses to one meaningful line -> no new rows.
    expect(
      pasteQuestions(questions, 'a', '', 'Only\n', '', idFactory())
    ).toEqual({
      type: 'commit',
      questions: [q('a', 'Only')],
      focusId: 'a',
    });
  });

  it('is a no-op when the paste has no meaningful content', () => {
    expect(pasteQuestions([q('a', '')], 'a', '', '\n\n', '')).toEqual({
      type: 'none',
    });
  });

  it('is a no-op for an unknown id', () => {
    expect(pasteQuestions([q('a')], 'nope', '', 'x\ny', '')).toEqual({
      type: 'none',
    });
  });
});
