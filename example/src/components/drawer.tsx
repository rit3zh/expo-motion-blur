import * as React from 'react';
import { memo, useCallback, useEffect, useMemo } from 'react';
import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
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
  DRAWER_ANIMATION,
  DRAWER_GESTURE,
  DRAWER_LAYOUT,
} from '../constants';
import type { IDrawerProps } from '../interfaces';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const dismissKeyboard = (): void => {
  Keyboard.dismiss();
};

const DrawerBase: React.FC<IDrawerProps> = ({
  isOpen,
  onOpenChange,
  progress,
  drawerContent,
  children,
}: IDrawerProps): React.JSX.Element => {
  const { width: windowWidth } = useWindowDimensions();
  const drawerWidth = windowWidth - DRAWER_LAYOUT.PEEK_WIDTH;

  const dragStart = useSharedValue<number>(0);
  const target = useSharedValue<number>(0);

  const close = useCallback((): void => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (isOpen) {
      Keyboard.dismiss();
    }
    const next = isOpen ? 1 : 0;
    if (target.get() === next) {
      return;
    }
    target.set(next);
    progress.set(withSpring(next, DRAWER_ANIMATION.SPRING));
  }, [isOpen, progress, target]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      close();
      return true;
    });
    return () => subscription.remove();
  }, [close, isOpen]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-DRAWER_GESTURE.ACTIVE_OFFSET, DRAWER_GESTURE.ACTIVE_OFFSET])
        .failOffsetY([-DRAWER_GESTURE.ACTIVE_OFFSET, DRAWER_GESTURE.ACTIVE_OFFSET])
        .onStart((event) => {
          dragStart.set(progress.get());
          if (event.translationX > 0) {
            scheduleOnRN(dismissKeyboard);
          }
        })
        .onUpdate((event) => {
          progress.set(clamp(dragStart.get() + event.translationX / drawerWidth, 0, 1));
        })
        .onEnd((event) => {
          const shouldOpen =
            Math.abs(event.velocityX) > DRAWER_GESTURE.FLING_VELOCITY
              ? event.velocityX > 0
              : progress.get() > DRAWER_GESTURE.OPEN_THRESHOLD;
          const next = shouldOpen ? 1 : 0;
          target.set(next);
          progress.set(
            withSpring(next, {
              ...DRAWER_ANIMATION.SPRING,
              velocity: event.velocityX / drawerWidth,
            })
          );
          scheduleOnRN(onOpenChange, shouldOpen);
        }),
    [dragStart, drawerWidth, onOpenChange, progress, target]
  );

  const drawerSizeStyle = useMemo<ViewStyle>(() => ({ width: drawerWidth }), [drawerWidth]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          progress.get(),
          [0, 1],
          [-DRAWER_LAYOUT.PARALLAX_OFFSET, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.get(), [0, 1], [0, drawerWidth], Extrapolation.CLAMP) },
    ],
    borderRadius: interpolate(
      progress.get(),
      [0, DRAWER_ANIMATION.CORNER_PROGRESS],
      [0, DRAWER_LAYOUT.CORNER_RADIUS],
      Extrapolation.CLAMP
    ),
  }));

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 1], [0, 1], Extrapolation.CLAMP),
    borderRadius: interpolate(
      progress.get(),
      [0, DRAWER_ANIMATION.CORNER_PROGRESS],
      [0, DRAWER_LAYOUT.CORNER_RADIUS],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.root}>
        <Animated.View
          accessibilityElementsHidden={!isOpen}
          importantForAccessibility={isOpen ? 'auto' : 'no-hide-descendants'}
          style={[styles.drawer, drawerSizeStyle, drawerStyle]}>
          {drawerContent}
        </Animated.View>
        <Animated.View style={[styles.content, contentStyle]}>
          {children}
          <AnimatedPressable
            accessibilityRole="button"
            accessibilityLabel={ACCESSIBILITY_LABELS.CLOSE_SIDEBAR}
            accessibilityElementsHidden={!isOpen}
            importantForAccessibility={isOpen ? 'auto' : 'no-hide-descendants'}
            onPress={close}
            style={[styles.scrim, !isOpen && styles.passThrough, scrimStyle]}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

DrawerBase.displayName = `${COMPONENT_NAMES.DRAWER}Base`;

const Drawer: React.NamedExoticComponent<IDrawerProps> = memo<IDrawerProps>(DrawerBase);

Drawer.displayName = COMPONENT_NAMES.DRAWER;

export { Drawer };

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.SIDEBAR_BACKGROUND,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  content: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    borderCurve: 'continuous',
    backgroundColor: COLORS.BACKGROUND,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.DRAWER_EDGE,
    backgroundColor: COLORS.DRAWER_SCRIM,
  },
  passThrough: {
    pointerEvents: 'none',
  },
});
