import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as React from 'react';

import { QuestionRow } from './question-row';
import type { Question } from './types';

/** A single sortable row wired to dnd-kit. */
export function SortableQuestion({
  question,
  position,
  onTextChange,
  onKeyDown,
  onPaste,
  registerInput,
}: {
  question: Question;
  position: number;
  onTextChange: (id: string, text: string) => void;
  onKeyDown: (id: string, e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste: (id: string, e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  registerInput: (id: string, el: HTMLTextAreaElement | null) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  // While this row is lifted, its slot becomes the live dashed placeholder.
  // An invisible copy of the row (QuestionRow renders itself opacity-0 when
  // `isDragging`) keeps the slot at the row's natural — possibly multi-line —
  // height, and the dashed box overlays it.
  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className='relative'>
        <QuestionRow
          aria-hidden
          isDragging
          value={question.text}
          position={position}
        />
        <div className='absolute inset-0 rounded-2xl border-2 border-dashed border-primary-600/40 bg-primary-600/[0.07]' />
      </div>
    );
  }

  return (
    <QuestionRow
      ref={setNodeRef}
      style={style}
      value={question.text}
      position={position}
      inputRef={(el) => registerInput(question.id, el)}
      inputProps={{
        onChange: (e) => onTextChange(question.id, e.target.value),
        onKeyDown: (e) => onKeyDown(question.id, e),
        onPaste: (e) => onPaste(question.id, e),
      }}
      handleProps={{
        ref: setActivatorNodeRef,
        ...attributes,
        ...listeners,
      }}
    />
  );
}
