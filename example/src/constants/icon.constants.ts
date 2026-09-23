import type { IMenuBarPose } from '../interfaces';

const ICON_VIEW_BOX_SIZE = 24;
const ICON_VIEW_BOX = `0 0 ${ICON_VIEW_BOX_SIZE} ${ICON_VIEW_BOX_SIZE}`;

const ICON_STROKE_WIDTHS = {
  MENU: 2.25,
  DASHED_CHAT: 2.25,
  SPARKLE: 1.8,
  WAVEFORM: 1.8,
  IMAGE: 1.8,
  PENCIL: 1.8,
  PLUS: 2,
  MICROPHONE: 2,
  VOICE_WAVEFORM: 2.18,
  SEARCH: 2.1,
  BRUSH: 2,
  BOOKS: 2,
  FOLDER: 2,
  HEART_BADGE: 2,
  HEART_FILL: 0.8,
  CLOCK: 2,
  SHAPES: 2,
  CHAT_BUBBLE: 2,
  COMPOSE: 2,
  GEAR: 2,
  ENVELOPE_FOLDS: 1.4,
} as const;

const MENU_ICON_BARS = {
  TOP: {
    MENU: { x: 11.7, y: 7.3, halfLength: 9.7, angle: 0 },
    CLOSE: { x: 12, y: 12, halfLength: 8.5, angle: Math.PI / 4 },
  },
  BOTTOM: {
    MENU: { x: 8, y: 17.4, halfLength: 6, angle: 0 },
    CLOSE: { x: 12, y: 12, halfLength: 8.5, angle: -Math.PI / 4 },
  },
} as const satisfies Record<string, Record<'MENU' | 'CLOSE', IMenuBarPose>>;

export { ICON_VIEW_BOX_SIZE, ICON_VIEW_BOX, ICON_STROKE_WIDTHS, MENU_ICON_BARS };
