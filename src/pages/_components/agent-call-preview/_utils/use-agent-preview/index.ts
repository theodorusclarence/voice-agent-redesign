import * as React from 'react';
import { useWatch } from 'react-hook-form';

import { type CreateAgentFormValues } from '@/pages/_components/create-agent-form';

import { type CallPhase, useCallSimulation } from '../use-call-simulation';
import {
  DEFAULT_SETTINGS,
  durationToSeconds,
  type VoiceDeliverySettings,
} from '../../_components/constants';

export interface AgentPreview {
  displayName: string;
  questionTexts: string[];
  settings: VoiceDeliverySettings;
  onSettingsChange: (patch: Partial<VoiceDeliverySettings>) => void;
  playing: boolean;
  step: number;
  phase: CallPhase;
  toggle: () => void;
}

/**
 * Builder-preview state, lifted off the preview panel so the desktop panel
 * and the mobile drawer (peek bar included) drive one shared simulation —
 * closing the drawer mid-call keeps the call running. Reads the agent name
 * and questions from the builder form context, so it must be called inside
 * `<Form>`.
 */
export function useAgentPreview(): AgentPreview {
  const name = useWatch<CreateAgentFormValues, 'name'>({ name: 'name' });
  const questions = useWatch<CreateAgentFormValues, 'questions'>({
    name: 'questions',
  });

  const [settings, setSettings] = React.useState(DEFAULT_SETTINGS);
  const onSettingsChange = React.useCallback(
    (patch: Partial<VoiceDeliverySettings>) =>
      setSettings((prev) => ({ ...prev, ...patch })),
    []
  );

  const questionTexts = React.useMemo(
    () => (questions ?? []).map((q) => q.text.trim()).filter(Boolean),
    [questions]
  );

  const {
    playing,
    step: rawStep,
    phase,
    toggle,
  } = useCallSimulation({
    questionCount: questionTexts.length,
    durationSecs: durationToSeconds(settings.duration),
  });

  return {
    displayName: name?.trim() || 'Your Agent',
    questionTexts,
    settings,
    onSettingsChange,
    playing,
    // Deleting questions mid-call can leave the step past the end.
    step: Math.min(rawStep, Math.max(0, questionTexts.length - 1)),
    phase,
    toggle,
  };
}
