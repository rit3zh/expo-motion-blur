import * as React from 'react';
import { memo } from 'react';
import Animated, { useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import {
  COLORS,
  COMPONENT_NAMES,
  ICON_STROKE_WIDTHS,
  ICON_VIEW_BOX,
  ICON_VIEW_BOX_SIZE,
  MENU_ICON_BARS,
} from '../constants';
import type { IMenuBarPose, IMenuIconProps } from '../interfaces';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const getBarPath = (from: IMenuBarPose, to: IMenuBarPose, t: number): string => {
  'worklet';
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t;
  const halfLength = from.halfLength + (to.halfLength - from.halfLength) * t;
  const angle = from.angle + (to.angle - from.angle) * t;
  const dx = Math.cos(angle) * halfLength;
  const dy = Math.sin(angle) * halfLength;
  return `M${x - dx} ${y - dy}L${x + dx} ${y + dy}`;
};

const MenuIconBase: React.FC<IMenuIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.MENU,
  progress,
}: IMenuIconProps): React.JSX.Element => {
  const idleProgress = useSharedValue<number>(0);
  const morphProgress = progress ?? idleProgress;

  const animatedProps = useAnimatedProps(() => {
    const t = Math.min(Math.max(morphProgress.get(), 0), 1);
    return {
      d:
        getBarPath(MENU_ICON_BARS.TOP.MENU, MENU_ICON_BARS.TOP.CLOSE, t) +
        getBarPath(MENU_ICON_BARS.BOTTOM.MENU, MENU_ICON_BARS.BOTTOM.CLOSE, t),
    };
  });

  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <AnimatedPath
        animatedProps={animatedProps}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

MenuIconBase.displayName = `${COMPONENT_NAMES.MENU_ICON}Base`;

const MenuIcon: React.NamedExoticComponent<IMenuIconProps> = memo<IMenuIconProps>(MenuIconBase);

MenuIcon.displayName = COMPONENT_NAMES.MENU_ICON;

export { MenuIcon };
