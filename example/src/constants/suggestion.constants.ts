import type { ISuggestion } from '../interfaces';

const SUGGESTION_IDS = {
  VOICE_CHAT: 'voice-chat',
  CREATE_IMAGE: 'create-image',
  WRITE_OR_EDIT: 'write-or-edit',
} as const;

const SUGGESTIONS: readonly ISuggestion[] = [
  { id: SUGGESTION_IDS.VOICE_CHAT, label: 'Start a voice chat' },
  { id: SUGGESTION_IDS.CREATE_IMAGE, label: 'Create an image' },
  { id: SUGGESTION_IDS.WRITE_OR_EDIT, label: 'Write or edit' },
];

export { SUGGESTION_IDS, SUGGESTIONS };
