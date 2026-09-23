import * as React from 'react';
import { memo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const MicrophoneIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.MICROPHONE,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Rect
        x={8}
        y={2.35}
        width={8}
        height={12.65}
        rx={4}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M4.5 13.9A8.125 8.125 0 0 0 19.5 13.9M12 18.9V22.1"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

MicrophoneIconBase.displayName = `${COMPONENT_NAMES.MICROPHONE_ICON}Base`;

const MicrophoneIcon: React.NamedExoticComponent<IIconProps> =
  memo<IIconProps>(MicrophoneIconBase);

MicrophoneIcon.displayName = COMPONENT_NAMES.MICROPHONE_ICON;

export { MicrophoneIcon };
