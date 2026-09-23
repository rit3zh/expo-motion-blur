const SHEET_LAYOUT = {
  INSET: 10,
  CORNER_RADIUS: 46,
} as const;

const SHEET_GESTURE = {
  ACTIVE_OFFSET: 10,
  DISMISS_DISTANCE: 120,
  DISMISS_VELOCITY: 800,
  OVERDRAG_LIMIT: 40,
} as const;

const SHEET_ANIMATION = {
  ENTER_SPRING: { mass: 1, stiffness: 250, damping: 26 },
  EXIT_SPRING: { mass: 1, stiffness: 250, damping: 40, overshootClamping: true },
  SETTLE_SPRING: { mass: 1, stiffness: 380, damping: 28 },
} as const;

const SHEET_MOTION_BLUR = {
  INTENSITY: 36,
  SPEED_FOR_MAX_BLUR: 1500,
  SAMPLES: 20,
} as const;

export { SHEET_LAYOUT, SHEET_GESTURE, SHEET_ANIMATION, SHEET_MOTION_BLUR };
