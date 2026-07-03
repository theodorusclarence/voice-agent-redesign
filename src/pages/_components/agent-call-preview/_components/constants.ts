export const VOICE_OPTIONS = ['Fred', 'Nova', 'Sage', 'Ember'] as const;
export const TONE_OPTIONS = [
  'Professional',
  'Friendly',
  'Casual',
  'Warm',
] as const;
export const SPEED_OPTIONS = ['0.75x', '1x', '1.25x', '1.5x'] as const;
export const DURATION_OPTIONS = [
  '5 mins',
  '10 mins',
  '15 mins',
  '30 mins',
] as const;

export const LANGUAGE_CODES: Record<string, string> = {
  English: 'EN',
  Spanish: 'ES',
  French: 'FR',
  German: 'DE',
  Japanese: 'JA',
};
export const LANGUAGE_OPTIONS = Object.keys(LANGUAGE_CODES);

export interface VoiceDeliverySettings {
  voice: string;
  tone: string;
  speed: string;
  duration: string;
  language: string;
}

export const DEFAULT_SETTINGS: VoiceDeliverySettings = {
  voice: 'Fred',
  tone: 'Professional',
  speed: '1x',
  duration: '10 mins',
  language: 'English',
};

export function durationToSeconds(duration: string): number {
  return (parseInt(duration, 10) || 10) * 60;
}
