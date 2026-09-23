import * as React from 'react';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const BrushIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.BRUSH,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Path
        d="M15.9 5A8.4 8.4 0 1 0 14.4 20.3M19.9 10.1A8.4 8.4 0 0 1 17.6 17.9Q16.9 18.3 16.3 17.9M13.3 10.3L20.3 3.4M9.8 12.1A1.9 1.9 0 1 1 11.7 14L9.5 14.4Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

BrushIconBase.displayName = `${COMPONENT_NAMES.BRUSH_ICON}Base`;

const BrushIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(BrushIconBase);

BrushIcon.displayName = COMPONENT_NAMES.BRUSH_ICON;

export { BrushIcon };
