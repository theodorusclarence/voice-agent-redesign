import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as React from 'react';

import { ROW_HEIGHT } from './constants';
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
  onKeyDown: (id: string, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (id: string, e: React.ClipboardEvent<HTMLInputElement>) => void;
  registerInput: (id: string, el: HTMLInputElement | null) => void;
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
  if (isDragging) {
    return (
      <div ref={setNodeRef} style={{ height: ROW_HEIGHT, ...style }}>
        <div className='h-full rounded-[14px] border-2 border-dashed border-primary-600/40 bg-primary-600/[0.07]' />
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
