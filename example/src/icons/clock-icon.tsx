import * as React from 'react';
import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const ClockIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.CLOCK,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M12 7.7V12.3L9.8 14.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

ClockIconBase.displayName = `${COMPONENT_NAMES.CLOCK_ICON}Base`;

const ClockIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(ClockIconBase);

ClockIcon.displayName = COMPONENT_NAMES.CLOCK_ICON;

export { ClockIcon };
