import { splitPastedQuestions } from '.';

describe('splitPastedQuestions', () => {
  it('splits newline-separated text into one entry per line', () => {
    expect(splitPastedQuestions('', 'A\nB\nC', '')).toEqual(['A', 'B', 'C']);
  });

  it('handles CRLF line endings', () => {
    expect(splitPastedQuestions('', 'A\r\nB', '')).toEqual(['A', 'B']);
  });

  it('trims each line and drops blank ones', () => {
    expect(splitPastedQuestions('', '  A  \n\n \nB\n', '')).toEqual(['A', 'B']);
  });

  it('merges the text before the caret into the first line', () => {
    expect(splitPastedQuestions('Hello ', 'World\nSecond', '')).toEqual([
      'Hello World',
      'Second',
    ]);
  });

  it('merges the text after the caret into the last line', () => {
    expect(splitPastedQuestions('', 'First\nSecond', ' tail')).toEqual([
      'First',
      'Second tail',
    ]);
  });

  it('merges both sides when pasting into the middle of a row', () => {
    // Caret sits between "Ques" and "tion"; pasting "A\nB".
    expect(splitPastedQuestions('Ques', 'A\nB', 'tion')).toEqual([
      'QuesA',
      'Btion',
    ]);
  });

  it('collapses a single line (no newline) into one entry', () => {
    expect(splitPastedQuestions('a', 'b', 'c')).toEqual(['abc']);
  });

  it('returns an empty array when nothing meaningful is pasted', () => {
    expect(splitPastedQuestions('', '\n\n', '')).toEqual([]);
  });
});
