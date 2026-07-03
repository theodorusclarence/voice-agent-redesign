import * as React from 'react';

export type CallPhase = 'ask' | 'answer';

interface CallState {
  playing: boolean;
  /** Index of the question currently being asked/answered. */
  step: number;
  phase: CallPhase;
  /** Seconds spent in the current phase. */
  phaseElapsed: number;
  /** Seconds since the call started. */
  elapsed: number;
}

const IDLE: CallState = {
  playing: false,
  step: 0,
  phase: 'ask',
  phaseElapsed: 0,
  elapsed: 0,
};

const ASK_SECONDS = 2;
const ANSWER_SECONDS = 3;

/**
 * Fake-call state machine for the preview: each question is "asked" for a
 * couple of seconds, then "answered", then the next one — looping until the
 * configured call duration runs out.
 */
export function useCallSimulation({
  questionCount,
  durationSecs,
}: {
  questionCount: number;
  durationSecs: number;
}) {
  const [call, setCall] = React.useState(IDLE);

  // The tick reads these through a ref so editing questions or changing the
  // duration mid-call doesn't restart the interval.
  const limits = React.useRef({ questionCount, durationSecs });
  React.useEffect(() => {
    limits.current = { questionCount, durationSecs };
  }, [questionCount, durationSecs]);

  React.useEffect(() => {
    if (!call.playing) return;
    const id = setInterval(() => {
      setCall((state) => {
        const questionCount = Math.max(1, limits.current.questionCount);
        let { step, phase, phaseElapsed } = state;
        const elapsed = state.elapsed + 1;
        phaseElapsed++;
        if (phase === 'ask') {
          if (phaseElapsed >= ASK_SECONDS) {
            phase = 'answer';
            phaseElapsed = 0;
          }
        } else if (phaseElapsed >= ANSWER_SECONDS) {
          // last answer done — the call is over, back to the paused state
          if (step + 1 >= questionCount) return IDLE;
          phase = 'ask';
          phaseElapsed = 0;
          step = step + 1;
        }
        if (elapsed >= limits.current.durationSecs) return IDLE;
        return { ...state, step, phase, phaseElapsed, elapsed };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [call.playing]);

  const toggle = React.useCallback(() => {
    setCall((state) => (state.playing ? IDLE : { ...IDLE, playing: true }));
  }, []);

  return {
    playing: call.playing,
    step: call.step,
    phase: call.phase,
    toggle,
  };
}
