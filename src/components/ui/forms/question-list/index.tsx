import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { nanoid } from 'nanoid';
import * as React from 'react';

import { AddQuestionButton } from './_components/add-question-button';
import {
  createDragAnnouncements,
  screenReaderInstructions,
} from './_components/constants';
import { QuestionRow } from './_components/question-row';
import { SortableQuestion } from './_components/sortable-question';
import type { Question } from './_components/types';
import {
  addQuestion,
  insertQuestionAfter,
  pasteQuestions,
  type QuestionsAction,
  removeEmptyQuestion,
} from './_utils/question-actions';

export type { Question } from './_components/types';

export interface QuestionListProps {
  /** Uncontrolled initial questions. */
  defaultQuestions?: Question[];
  /** Controlled questions. When set, `onQuestionsChange` should keep it in sync. */
  questions?: Question[];
  onQuestionsChange?: (questions: Question[]) => void;
  className?: string;
}

const QuestionList = React.forwardRef<HTMLDivElement, QuestionListProps>(
  (
    { defaultQuestions, questions: controlled, onQuestionsChange, className },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState<Question[]>(
      () => defaultQuestions ?? [{ id: nanoid(), text: '' }]
    );
    const isControlled = controlled != null;
    const questions = isControlled ? controlled : uncontrolled;

    const [activeId, setActiveId] = React.useState<string | null>(null);
    const pendingFocus = React.useRef<string | null>(null);
    const inputs = React.useRef<Record<string, HTMLInputElement | null>>({});

    const commit = React.useCallback(
      (next: Question[]) => {
        if (!isControlled) setUncontrolled(next);
        onQuestionsChange?.(next);
      },
      [isControlled, onQuestionsChange]
    );

    // Focus a row after it is inserted/removed via the keyboard.
    React.useEffect(() => {
      if (pendingFocus.current) {
        const el = inputs.current[pendingFocus.current];
        pendingFocus.current = null;
        if (el) {
          el.focus();
          const len = el.value.length;
          try {
            el.setSelectionRange(len, len);
          } catch {
            /* noop for inputs that don't support selection */
          }
        }
      }
    });

    const sensors = useSensors(
      useSensor(PointerSensor, {
        // Hold-to-drag: a short press picks the row up (and lets the
        // `question-lift` overlay animation read as intentional), while
        // `tolerance` still lets a quick drag start if the pointer moves.
        activationConstraint: { delay: 70, tolerance: 5 },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const registerInput = React.useCallback(
      (id: string, el: HTMLInputElement | null) => {
        inputs.current[id] = el;
      },
      []
    );

    // Shake a row to draw attention (e.g. an add/delete that we won't perform).
    const wiggleRow = React.useCallback((id: string) => {
      const card = inputs.current[id]?.closest<HTMLElement>('.question-card');
      if (!card) return;
      // Remove → reflow → re-add so the shake restarts on repeat triggers,
      // then clear after the animation's duration (see `question-wiggle`).
      card.removeAttribute('data-wiggle');
      card.getBoundingClientRect();
      card.setAttribute('data-wiggle', 'true');
      window.setTimeout(() => card.removeAttribute('data-wiggle'), 400);
    }, []);

    // Turn a pure QuestionsAction into its effects. The interesting logic lives
    // in `_utils/question-actions` (and is unit-tested there); this just wires
    // the result to React state and the focus/wiggle side effects.
    const applyAction = React.useCallback(
      (action: QuestionsAction) => {
        switch (action.type) {
          case 'commit':
            pendingFocus.current = action.focusId;
            commit(action.questions);
            break;
          case 'attention':
            inputs.current[action.id]?.focus();
            wiggleRow(action.id);
            break;
          case 'none':
            break;
        }
      },
      [commit, wiggleRow]
    );

    const handleTextChange = React.useCallback(
      (id: string, text: string) => {
        commit(questions.map((q) => (q.id === id ? { ...q, text } : q)));
      },
      [commit, questions]
    );

    const handleKeyDown = React.useCallback(
      (id: string, e: React.KeyboardEvent<HTMLInputElement>) => {
        const question = questions.find((q) => q.id === id);
        if (!question) return;

        if (e.key === 'Enter') {
          e.preventDefault();
          applyAction(insertQuestionAfter(questions, id));
        } else if (e.key === 'Backspace' && question.text === '') {
          e.preventDefault();
          applyAction(removeEmptyQuestion(questions, id));
        }
      },
      [questions, applyAction]
    );

    // Newline-separated pastes create one row per line; single-line pastes fall
    // through to native handling (so the caret/undo behave normally).
    const handlePaste = React.useCallback(
      (id: string, e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData('text');
        if (!text.includes('\n')) return;
        e.preventDefault();

        const input = e.currentTarget;
        const before = input.value.slice(0, input.selectionStart ?? undefined);
        const after = input.value.slice(input.selectionEnd ?? undefined);
        applyAction(pasteQuestions(questions, id, before, text, after));
      },
      [questions, applyAction]
    );

    const handleAdd = React.useCallback(() => {
      applyAction(addQuestion(questions));
    }, [questions, applyAction]);

    const handleDragStart = (e: DragStartEvent) => {
      setActiveId(String(e.active.id));
    };

    const handleDragEnd = (e: DragEndEvent) => {
      const { active, over } = e;
      setActiveId(null);
      if (over && active.id !== over.id) {
        const from = questions.findIndex((q) => q.id === active.id);
        const to = questions.findIndex((q) => q.id === over.id);
        if (from !== -1 && to !== -1) commit(arrayMove(questions, from, to));
      }
    };

    const activeQuestion = questions.find((q) => q.id === activeId) ?? null;
    const announcements = createDragAnnouncements(questions);

    return (
      <div ref={ref} className={className}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
          accessibility={{ announcements, screenReaderInstructions }}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className='flex flex-col gap-2'>
              {questions.map((question) => (
                <SortableQuestion
                  key={question.id}
                  question={question}
                  onTextChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  registerInput={registerInput}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay
            dropAnimation={{
              duration: 220,
              easing: 'cubic-bezier(.2,.8,.2,1)',
              // dnd-kit skips the whole drop animation (side effects included)
              // when the first and last keyframes are byte-identical — which is
              // the case for an in-place drop with no travel. Giving the two
              // keyframes distinct `offset`s keeps them non-identical so the
              // `question-drop` side effect always runs and the card settles;
              // the transforms are dnd-kit's defaults, so real movement is
              // unchanged.
              keyframes: ({ transform }) => [
                {
                  offset: 0,
                  transform: CSS.Transform.toString(transform.initial),
                },
                {
                  offset: 1,
                  transform: CSS.Transform.toString(transform.final),
                },
              ],
              // dnd-kit only animates the overlay's position back to the slot.
              // Tag the overlay for the drop's duration so the card can ease its
              // tilt/scale/shadow back to resting (see `.question-drop`), and
              // keep the default of hiding the source row until the overlay lands.
              sideEffects: defaultDropAnimationSideEffects({
                className: { dragOverlay: 'question-drop' },
                styles: { active: { opacity: '0' } },
              }),
            }}
          >
            {activeQuestion ? (
              <QuestionRow isOverlay value={activeQuestion.text} />
            ) : null}
          </DragOverlay>
        </DndContext>

        <AddQuestionButton onClick={handleAdd} className='mt-2' />
      </div>
    );
  }
);

export default QuestionList;
