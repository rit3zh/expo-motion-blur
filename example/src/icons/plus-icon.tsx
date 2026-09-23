import * as React from 'react';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const PlusIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.PLUS,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX} fill="none">
      <Path d="M12 4V20M4 12H20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
};

PlusIconBase.displayName = `${COMPONENT_NAMES.PLUS_ICON}Base`;

const PlusIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(PlusIconBase);

PlusIcon.displayName = COMPONENT_NAMES.PLUS_ICON;

export { PlusIcon };
