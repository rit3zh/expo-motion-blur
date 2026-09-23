import * as React from 'react';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const WaveformIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.WAVEFORM,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Path
        d="M5.25 9.75V14.25M9.75 4.75V19.25M14.25 6.75V16.25M18.75 9.9V14.1"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

WaveformIconBase.displayName = `${COMPONENT_NAMES.WAVEFORM_ICON}Base`;

const WaveformIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(WaveformIconBase);

WaveformIcon.displayName = COMPONENT_NAMES.WAVEFORM_ICON;

export { WaveformIcon };
