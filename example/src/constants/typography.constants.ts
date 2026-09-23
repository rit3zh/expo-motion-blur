import type { TextStyle } from 'react-native';

const TYPOGRAPHY = {
  BODY: {
    fontSize: 17,
    fontWeight: '400',
  },
  BODY_SEMIBOLD: {
    fontSize: 17,
    fontWeight: '600',
  },
  PARAGRAPH: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
  },
  TITLE: {
    fontSize: 22,
    fontWeight: '700',
  },
} as const satisfies Record<string, TextStyle>;

export { TYPOGRAPHY };
