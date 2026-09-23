import * as React from 'react';
import { memo } from 'react';
import Svg, { Defs, Mask, Path, Rect } from 'react-native-svg';

import {
  COLORS,
  COMPONENT_NAMES,
  ICON_STROKE_WIDTHS,
  ICON_VIEW_BOX,
  ICON_VIEW_BOX_SIZE,
} from '../constants';
import type { IIconProps } from '../interfaces';

const EnvelopeIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
  color = COLORS.WHITE,
  strokeWidth = ICON_STROKE_WIDTHS.ENVELOPE_FOLDS,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={ICON_VIEW_BOX}>
      <Defs>
        <Mask id="envelope-folds">
          <Rect width={ICON_VIEW_BOX_SIZE} height={ICON_VIEW_BOX_SIZE} fill="white" />
          <Path
            d="M3 5.9L12 12.9L21 5.9M2.8 19L9.7 11.9M21.2 19L14.3 11.9"
            stroke="black"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Mask>
      </Defs>
      <Rect
        x={2}
        y={4.5}
        width={20}
        height={15}
        rx={2.2}
        fill={color}
        mask="url(#envelope-folds)"
      />
    </Svg>
  );
};

EnvelopeIconBase.displayName = `${COMPONENT_NAMES.ENVELOPE_ICON}Base`;

const EnvelopeIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(EnvelopeIconBase);

EnvelopeIcon.displayName = COMPONENT_NAMES.ENVELOPE_ICON;

export { EnvelopeIcon };
