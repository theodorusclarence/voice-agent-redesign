import type { Announcements, ScreenReaderInstructions } from '@dnd-kit/core';

import type { Question } from './types';

/** stride = row height (52) + gap (8) — matches the design's 60px rhythm. */
export const ROW_HEIGHT = 52;

export const screenReaderInstructions: ScreenReaderInstructions = {
  draggable:
    'To reorder a question, press Space or Enter to pick it up. ' +
    'Use the arrow keys to move it, then press Space or Enter again to drop it in its new position, or Escape to cancel.',
};

/** Screen-reader announcements describing pick-up / move / drop by position. */
export function createDragAnnouncements(questions: Question[]): Announcements {
  return {
    onDragStart: ({ active }) => {
      const pos = questions.findIndex((q) => q.id === active.id) + 1;
      return `Picked up question ${pos} of ${questions.length}.`;
    },
    onDragOver: ({ active, over }) => {
      if (!over) return undefined;
      const pos = questions.findIndex((q) => q.id === over.id) + 1;
      return `Question ${
        questions.findIndex((q) => q.id === active.id) + 1
      } was moved to position ${pos} of ${questions.length}.`;
    },
    onDragEnd: ({ active, over }) => {
      if (!over) return `Question was dropped.`;
      const pos = questions.findIndex((q) => q.id === over.id) + 1;
      return `Question ${
        questions.findIndex((q) => q.id === active.id) + 1
      } was dropped at position ${pos} of ${questions.length}.`;
    },
    onDragCancel: ({ active }) => {
      const pos = questions.findIndex((q) => q.id === active.id) + 1;
      return `Reordering cancelled. Question ${pos} returned to its original position.`;
    },
  };
}
