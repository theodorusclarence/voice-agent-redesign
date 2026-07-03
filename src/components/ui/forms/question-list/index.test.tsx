import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import QuestionList, { type Question } from '.';

/**
 * Integration tests: the pure utils (actions, history) are unit-tested in
 * `_utils`; these render the real component and drive it like a user to pin
 * down how the features compose — add vs wiggle, paste vs history, focus
 * hand-off — so a new feature can't silently break a neighbouring one.
 * Drag-and-drop is the one behavior not covered here: jsdom has no real
 * pointer geometry, so reordering stays a browser/Storybook concern.
 */

/** The production shape: state owned above the list (react-hook-form). */
function Harness({ initial }: { initial: Question[] }) {
  const [questions, setQuestions] = React.useState(initial);
  return (
    <QuestionList questions={questions} onQuestionsChange={setQuestions} />
  );
}

const q = (id: string, text = ''): Question => ({ id, text });

const rows = () =>
  screen.getAllByPlaceholderText('Type a question…') as HTMLTextAreaElement[];
const values = () => rows().map((r) => r.value);
const addButton = () => screen.getByRole('button', { name: /add question/i });
const wiggling = (el: HTMLElement) =>
  el.closest('.question-card')?.getAttribute('data-wiggle') === 'true';

describe('QuestionList integration', () => {
  it('Enter inserts a row below and moves focus into it', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[q('a', 'First'), q('b', 'Second')]} />);

    await user.click(rows()[0]);
    await user.keyboard('{Enter}');

    expect(values()).toEqual(['First', '', 'Second']);
    expect(rows()[1]).toHaveFocus();
  });

  it('Enter refuses to stack a blank row: focuses and wiggles the existing one', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[q('a', 'First'), q('b', '')]} />);

    await user.click(rows()[0]);
    await user.keyboard('{Enter}');

    expect(values()).toEqual(['First', '']);
    expect(rows()[1]).toHaveFocus();
    expect(wiggling(rows()[1])).toBe(true);
  });

  it('the Add button appends and focuses a blank row', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[q('a', 'First')]} />);

    await user.click(addButton());

    expect(values()).toEqual(['First', '']);
    expect(rows()[1]).toHaveFocus();
  });

  it('the Add button defers to an existing blank row with a wiggle', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[q('a', ''), q('b', 'Second')]} />);

    await user.click(addButton());

    expect(values()).toEqual(['', 'Second']);
    expect(rows()[0]).toHaveFocus();
    expect(wiggling(rows()[0])).toBe(true);
  });

  it('Backspace on an empty row removes it and focuses the previous row', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[q('a', 'First'), q('b', '')]} />);

    await user.click(rows()[1]);
    await user.keyboard('{Backspace}');

    expect(values()).toEqual(['First']);
    expect(rows()[0]).toHaveFocus();
  });

  it('refuses to delete the last remaining row and wiggles it instead', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[q('a', '')]} />);

    await user.click(rows()[0]);
    await user.keyboard('{Backspace}');

    expect(values()).toEqual(['']);
    expect(wiggling(rows()[0])).toBe(true);
  });

  it('splits a multiline paste into rows and focuses the last one', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[q('a', '')]} />);

    await user.click(rows()[0]);
    await user.paste('One\nTwo\nThree');

    expect(values()).toEqual(['One', 'Two', 'Three']);
    expect(rows()[2]).toHaveFocus();
  });

  it('ArrowDown/ArrowUp move focus between rows', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[q('a', 'First'), q('b', 'Second')]} />);

    await user.click(rows()[0]);
    await user.keyboard('{ArrowDown}');
    expect(rows()[1]).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(rows()[0]).toHaveFocus();
    // Up lands at the end of the target row, ready to keep editing.
    expect(rows()[0].selectionStart).toBe('First'.length);
  });

  it('undo removes a row added with Enter and returns focus to the source row', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[q('a', 'First')]} />);

    await user.click(rows()[0]);
    await user.keyboard('{Enter}');
    expect(values()).toEqual(['First', '']);

    await user.keyboard('{Meta>}z{/Meta}');

    expect(values()).toEqual(['First']);
    expect(rows()[0]).toHaveFocus();
  });

  it('undo unwinds a bulk paste in one step; redo replays it', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[q('a', 'Draft')]} />);

    await user.click(rows()[0]);
    rows()[0].select(); // paste over the whole draft
    await user.paste('One\nTwo\nThree');
    expect(values()).toEqual(['One', 'Two', 'Three']);

    await user.keyboard('{Meta>}z{/Meta}');
    expect(values()).toEqual(['Draft']);

    await user.keyboard('{Meta>}{Shift>}z{/Shift}{/Meta}');
    expect(values()).toEqual(['One', 'Two', 'Three']);
  });

  it('undo steps back a whole typing burst, not one character', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[q('a', 'First'), q('b', '')]} />);

    await user.click(rows()[1]);
    await user.keyboard('hey');
    expect(values()).toEqual(['First', 'hey']);

    await user.keyboard('{Meta>}z{/Meta}');

    expect(values()).toEqual(['First', '']);
  });

  it('a new edit after undo invalidates redo', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[q('a', 'First')]} />);

    await user.click(rows()[0]);
    await user.keyboard('{Enter}'); // add
    await user.keyboard('{Meta>}z{/Meta}'); // undo the add
    await user.keyboard('{Enter}'); // new edit takes a different path
    await user.keyboard('x');
    expect(values()).toEqual(['First', 'x']);

    // Redo has nothing to replay — the state stays put.
    await user.keyboard('{Meta>}{Shift>}z{/Shift}{/Meta}');
    expect(values()).toEqual(['First', 'x']);
  });

  it('features compose: paste, guarded Enter, delete, then undo each step', async () => {
    const user = userEvent.setup();
    render(<Harness initial={[q('a', '')]} />);

    // Paste two questions…
    await user.click(rows()[0]);
    await user.paste('One\nTwo');
    expect(values()).toEqual(['One', 'Two']);

    // …add a blank row after the last, then try Enter again: wiggle, no add.
    await user.keyboard('{Enter}');
    expect(values()).toEqual(['One', 'Two', '']);
    await user.click(rows()[1]);
    await user.keyboard('{Enter}');
    expect(values()).toEqual(['One', 'Two', '']);
    expect(rows()[2]).toHaveFocus();

    // Delete the blank row, then undo everything back to the start.
    await user.keyboard('{Backspace}');
    expect(values()).toEqual(['One', 'Two']);

    await user.keyboard('{Meta>}z{/Meta}'); // undo delete
    expect(values()).toEqual(['One', 'Two', '']);
    await user.keyboard('{Meta>}z{/Meta}'); // undo Enter-add
    expect(values()).toEqual(['One', 'Two']);
    await user.keyboard('{Meta>}z{/Meta}'); // undo paste
    expect(values()).toEqual(['']);
  });
});
