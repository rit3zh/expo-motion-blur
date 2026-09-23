import * as React from 'react';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import { COLORS, COMPONENT_NAMES, ICON_STROKE_WIDTHS, ICON_VIEW_BOX, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const SparkleIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.SPARKLE,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX}>
      <Path
        d="M12 1.54C13.44 8.1 15.9 10.56 22.46 12C15.9 13.44 13.44 15.9 12 22.46C10.56 15.9 8.1 13.44 1.54 12C8.1 10.56 10.56 8.1 12 1.54Z"
        fill={color}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

SparkleIconBase.displayName = `${COMPONENT_NAMES.SPARKLE_ICON}Base`;

const SparkleIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(SparkleIconBase);

SparkleIcon.displayName = COMPONENT_NAMES.SPARKLE_ICON;

export { SparkleIcon };
