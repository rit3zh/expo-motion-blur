import * as React from 'react';
import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const GearIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.GEAR,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Path
        d="M10.25 2.05A10.1 10.1 0 0 1 13.75 2.05C14.74 2.23 14.22 4.56 15.13 4.97A7.7 7.7 0 0 1 16.53 5.77C17.33 6.36 19.09 4.74 19.74 5.51A10.1 10.1 0 0 1 21.49 8.55C21.83 9.49 19.55 10.2 19.66 11.2A7.7 7.7 0 0 1 19.66 12.8C19.55 13.8 21.83 14.51 21.49 15.45A10.1 10.1 0 0 1 19.74 18.49C19.09 19.26 17.33 17.64 16.53 18.23A7.7 7.7 0 0 1 15.13 19.03C14.22 19.44 14.74 21.77 13.75 21.95A10.1 10.1 0 0 1 10.25 21.95C9.26 21.77 9.78 19.44 8.87 19.03A7.7 7.7 0 0 1 7.47 18.23C6.67 17.64 4.91 19.26 4.26 18.49A10.1 10.1 0 0 1 2.51 15.45C2.17 14.51 4.45 13.8 4.34 12.8A7.7 7.7 0 0 1 4.34 11.2C4.45 10.2 2.17 9.49 2.51 8.55A10.1 10.1 0 0 1 4.26 5.51C4.91 4.74 6.67 6.36 7.47 5.77A7.7 7.7 0 0 1 8.87 4.97C9.78 4.56 9.26 2.23 10.25 2.05Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3.4} stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
};

GearIconBase.displayName = `${COMPONENT_NAMES.GEAR_ICON}Base`;

const GearIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(GearIconBase);

GearIcon.displayName = COMPONENT_NAMES.GEAR_ICON;

export { GearIcon };
