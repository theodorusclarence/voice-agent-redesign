import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverEvent,
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

/**
 * Visual lines the autosized row currently renders. Rows wrap without
 * newlines, so the only way to know is from the rendered height.
 */
function countVisualLines(el: HTMLTextAreaElement) {
  const style = window.getComputedStyle(el);
  const lineHeight = parseFloat(style.lineHeight) || 20;
  const padding =
    (parseFloat(style.paddingTop) || 0) +
    (parseFloat(style.paddingBottom) || 0);
  return Math.max(1, Math.round((el.clientHeight - padding) / lineHeight));
}

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
    // The row currently hovered while dragging — drives the overlay's number so
    // it previews the projected position and is already correct at release.
    const [overId, setOverId] = React.useState<string | null>(null);
    const pendingFocus = React.useRef<string | null>(null);
    const inputs = React.useRef<Record<string, HTMLTextAreaElement | null>>({});

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
      (id: string, el: HTMLTextAreaElement | null) => {
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

    // Move focus to the row above/below. Up lands at the end of the target
    // (its nearest edge), down at the start.
    const focusAdjacentRow = React.useCallback(
      (index: number, dir: -1 | 1) => {
        const target = questions[index + dir];
        const el = target ? inputs.current[target.id] : null;
        if (!el) return false;
        el.focus();
        const pos = dir === -1 ? el.value.length : 0;
        el.setSelectionRange(pos, pos);
        return true;
      },
      [questions]
    );

    const handleKeyDown = React.useCallback(
      (id: string, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const question = questions.find((q) => q.id === id);
        if (!question) return;

        if (e.key === 'Enter') {
          e.preventDefault();
          applyAction(insertQuestionAfter(questions, id));
        } else if (e.key === 'Backspace' && question.text === '') {
          e.preventDefault();
          applyAction(removeEmptyQuestion(questions, id));
        } else if (
          (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
          !e.shiftKey &&
          !e.altKey &&
          !e.metaKey &&
          !e.ctrlKey
        ) {
          // Arrow between rows. Rows wrap without literal newlines, so a
          // wrapped row keeps native caret movement until the caret reaches
          // the boundary (start for up, end for down) — the browser parks it
          // there when arrowing past the first/last visual line, and the next
          // press jumps rows. Single-line rows jump right away.
          const el = e.currentTarget;
          const dir = e.key === 'ArrowUp' ? -1 : 1;
          const caret = el.selectionStart ?? 0;
          if (el.selectionStart !== el.selectionEnd) return;
          const atEdge = dir === -1 ? caret === 0 : caret === el.value.length;
          if (!atEdge && countVisualLines(el) > 1) return;
          if (
            focusAdjacentRow(
              questions.findIndex((q) => q.id === id),
              dir
            )
          ) {
            e.preventDefault();
          }
        }
      },
      [questions, applyAction, focusAdjacentRow]
    );

    // Newline-separated pastes create one row per line; single-line pastes fall
    // through to native handling (so the caret/undo behave normally).
    const handlePaste = React.useCallback(
      (id: string, e: React.ClipboardEvent<HTMLTextAreaElement>) => {
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
      setOverId(String(e.active.id));
    };

    const handleDragOver = (e: DragOverEvent) => {
      setOverId(e.over ? String(e.over.id) : null);
    };

    const handleDragEnd = (e: DragEndEvent) => {
      const { active, over } = e;
      setActiveId(null);
      setOverId(null);
      if (over && active.id !== over.id) {
        const from = questions.findIndex((q) => q.id === active.id);
        const to = questions.findIndex((q) => q.id === over.id);
        if (from !== -1 && to !== -1) commit(arrayMove(questions, from, to));
      }
    };

    const handleDragCancel = () => {
      setActiveId(null);
      setOverId(null);
    };

    const activeIndex = questions.findIndex((q) => q.id === activeId);
    const activeQuestion = activeIndex === -1 ? null : questions[activeIndex];
    const overIndex = overId ? questions.findIndex((q) => q.id === overId) : -1;

    // While dragging, number every row by its *projected* order — as if the drop
    // happened now — so the background list and the overlay agree, and the drop
    // animation already carries the final number (dnd-kit freezes the overlay's
    // content the instant the pointer is released). The array isn't reordered
    // until release; SortableContext just shifts the rows, and arrayMove matches
    // exactly that shift so each row's number lines up with where it sits.
    const displayOrder =
      activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex
        ? arrayMove(questions, activeIndex, overIndex)
        : questions;
    const positionById = new Map(displayOrder.map((q, i) => [q.id, i + 1]));
    const overlayPosition = positionById.get(activeId ?? '') ?? activeIndex + 1;
    const announcements = createDragAnnouncements(questions);

    return (
      <div ref={ref} className={className}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          accessibility={{ announcements, screenReaderInstructions }}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className='flex flex-col gap-2'>
              {questions.map((question, index) => (
                <SortableQuestion
                  key={question.id}
                  question={question}
                  position={positionById.get(question.id) ?? index + 1}
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
              <QuestionRow
                isOverlay
                value={activeQuestion.text}
                position={overlayPosition}
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        <AddQuestionButton onClick={handleAdd} className='mt-2.5' />
      </div>
    );
  }
);

export default QuestionList;
