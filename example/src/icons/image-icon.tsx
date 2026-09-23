import * as React from 'react';
import { memo } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const ImageIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.IMAGE,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Rect
        x={3.75}
        y={4.75}
        width={15.9}
        height={14.5}
        rx={2}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Circle cx={13.3} cy={9.9} r={2.05} stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M3.75 15.25L5.88 13.12Q7.58 11.42 9.28 13.11L15.42 19.25"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

ImageIconBase.displayName = `${COMPONENT_NAMES.IMAGE_ICON}Base`;

const ImageIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(ImageIconBase);

ImageIcon.displayName = COMPONENT_NAMES.IMAGE_ICON;

export { ImageIcon };
