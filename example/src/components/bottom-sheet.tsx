import { MotionBlurView } from 'expo-motion-blur';
import * as React from 'react';
import { memo, useCallback, useEffect, useMemo } from 'react';
import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
  ACCESSIBILITY_LABELS,
  COLORS,
  COMPONENT_NAMES,
  SHEET_ANIMATION,
  SHEET_GESTURE,
  SHEET_LAYOUT,
  SHEET_MOTION_BLUR,
} from '../constants';
import type { IBottomSheetProps } from '../interfaces';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const rubberBand = (overdrag: number): number => {
  'worklet';
  const limit = SHEET_GESTURE.OVERDRAG_LIMIT;
  return limit * (1 - 1 / ((overdrag * 0.55) / limit + 1));
};

const BottomSheetBase: React.FC<IBottomSheetProps> = ({
  visible,
  onClose,
  children,
  style,
}: IBottomSheetProps): React.JSX.Element => {
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useSharedValue<number>(windowHeight);
  const sheetHeight = useSharedValue<number>(windowHeight);
  const dragStart = useSharedValue<number>(0);
  const isClosing = useSharedValue<boolean>(!visible);
  const isVisible = useSharedValue<boolean>(visible);

  const getHiddenOffset = useCallback((): number => {
    'worklet';
    return sheetHeight.get() + SHEET_LAYOUT.INSET;
  }, [sheetHeight]);

  const handleExited = useCallback((): void => {
    'worklet';
    if (isVisible.get()) {
      isClosing.set(false);
      translateY.set(withSpring(0, SHEET_ANIMATION.ENTER_SPRING));
    }
  }, [isClosing, isVisible, translateY]);

  const handleSheetLayout = useCallback(
    (event: LayoutChangeEvent): void => {
      sheetHeight.set(event.nativeEvent.layout.height);
    },
    [sheetHeight]
  );

  useEffect(() => {
    isVisible.set(visible);
    if (visible) {
      Keyboard.dismiss();
    }
  }, [isVisible, visible]);

  useEffect(() => {
    if (visible) {
      isClosing.set(false);
      translateY.set(Math.min(translateY.get(), getHiddenOffset()));
      translateY.set(withSpring(0, SHEET_ANIMATION.ENTER_SPRING));
      return;
    }
    if (isClosing.get()) {
      return;
    }
    isClosing.set(true);
    translateY.set(withSpring(getHiddenOffset(), SHEET_ANIMATION.EXIT_SPRING));
  }, [getHiddenOffset, isClosing, translateY, visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => subscription.remove();
  }, [onClose, visible]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-SHEET_GESTURE.ACTIVE_OFFSET, SHEET_GESTURE.ACTIVE_OFFSET])
        .onStart(() => {
          dragStart.set(translateY.get());
        })
        .onUpdate((event) => {
          if (isClosing.get()) {
            return;
          }
          const offset = dragStart.get() + event.translationY;
          translateY.set(offset >= 0 ? offset : -rubberBand(-offset));
        })
        .onEnd((event) => {
          if (isClosing.get()) {
            return;
          }
          if (
            translateY.get() > SHEET_GESTURE.DISMISS_DISTANCE ||
            event.velocityY > SHEET_GESTURE.DISMISS_VELOCITY
          ) {
            isClosing.set(true);
            translateY.set(
              withSpring(
                getHiddenOffset(),
                { ...SHEET_ANIMATION.EXIT_SPRING, velocity: event.velocityY },
                (finished?: boolean) => {
                  if (finished) {
                    handleExited();
                  }
                }
              )
            );
            scheduleOnRN(onClose);
            return;
          }
          translateY.set(
            withSpring(0, { ...SHEET_ANIMATION.SETTLE_SPRING, velocity: event.velocityY })
          );
        }),
    [dragStart, getHiddenOffset, handleExited, isClosing, onClose, translateY]
  );

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.get(), [0, getHiddenOffset()], [1, 0], Extrapolation.CLAMP),
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }));

  return (
    <View
      accessibilityViewIsModal={visible}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}
      style={[styles.root, !visible && styles.passThrough]}>
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={ACCESSIBILITY_LABELS.DISMISS_SHEET}
        onPress={onClose}
        style={[styles.backdrop, backdropStyle]}
      />
      <GestureDetector gesture={panGesture}>
        <Animated.View onLayout={handleSheetLayout} style={[styles.sheet, sheetStyle]}>
          <MotionBlurView
            intensity={SHEET_MOTION_BLUR.INTENSITY}
            speedForMaxBlur={SHEET_MOTION_BLUR.SPEED_FOR_MAX_BLUR}
            samples={SHEET_MOTION_BLUR.SAMPLES}>
            <View style={[styles.card, style]}>{children}</View>
          </MotionBlurView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

BottomSheetBase.displayName = `${COMPONENT_NAMES.BOTTOM_SHEET}Base`;

const BottomSheet: React.NamedExoticComponent<IBottomSheetProps> =
  memo<IBottomSheetProps>(BottomSheetBase);

BottomSheet.displayName = COMPONENT_NAMES.BOTTOM_SHEET;

export { BottomSheet };

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'box-none',
  },
  passThrough: {
    pointerEvents: 'none',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.SHEET_BACKDROP,
  },
  sheet: {
    position: 'absolute',
    left: SHEET_LAYOUT.INSET,
    right: SHEET_LAYOUT.INSET,
    bottom: SHEET_LAYOUT.INSET,
  },
  card: {
    borderRadius: SHEET_LAYOUT.CORNER_RADIUS,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.SHEET_EDGE,
    backgroundColor: COLORS.SHEET_BACKGROUND,
  },
});
