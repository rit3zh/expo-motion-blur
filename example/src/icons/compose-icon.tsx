import * as React from 'react';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const ComposeIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.COMPOSE,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Path
        d="M10.6 4H7.6A4 4 0 0 0 3.6 8V16.3A4 4 0 0 0 7.6 20.3H16.3A4 4 0 0 0 20.3 16.3V13.4M16.9 4.3A2 2 0 0 1 19.7 7.1L11.7 15.1H8.4V12.8Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

ComposeIconBase.displayName = `${COMPONENT_NAMES.COMPOSE_ICON}Base`;

const ComposeIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(ComposeIconBase);

ComposeIcon.displayName = COMPONENT_NAMES.COMPOSE_ICON;

export { ComposeIcon };
