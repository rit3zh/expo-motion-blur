import type { AUTH_BUTTON_VARIANTS } from '../constants';

type TAuthButtonVariant = (typeof AUTH_BUTTON_VARIANTS)[keyof typeof AUTH_BUTTON_VARIANTS];

export type { TAuthButtonVariant };
