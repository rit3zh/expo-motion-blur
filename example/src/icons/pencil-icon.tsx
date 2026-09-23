import * as React from 'react';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const PencilIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.PENCIL,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Path
        d="M5.6 13.4L14.05 5.2A3.2 3.2 0 0 1 18.55 9.7L10 18L3.9 19.65ZM13.1 6.1L17.6 10.6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

PencilIconBase.displayName = `${COMPONENT_NAMES.PENCIL_ICON}Base`;

const PencilIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(PencilIconBase);

PencilIcon.displayName = COMPONENT_NAMES.PENCIL_ICON;

export { PencilIcon };
