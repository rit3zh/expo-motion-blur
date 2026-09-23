import * as React from 'react';
import { memo } from 'react';
import Svg, {
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import { COMPONENT_NAMES, ICON_VIEW_BOX_SIZE } from '../constants';
import type { IIconProps } from '../interfaces';

const VIEW_BOX = '0 0 268.1522 273.8827';

const GoogleIconBase: React.FC<IIconProps> = ({
  size = ICON_VIEW_BOX_SIZE,
}: IIconProps): React.JSX.Element => {
  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX}>
      <Defs>
        <LinearGradient
          id="s"
          x1="219.6997"
          y1="329.5351"
          x2="254.4673"
          y2="329.5351"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#0fbc5c" />
          <Stop offset="1" stopColor="#0cba65" />
        </LinearGradient>
        <RadialGradient
          id="m"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-1.936885,1.043001,1.455731,2.555422,290.5254,-400.6338)"
          cx="109.6267"
          cy="135.8619"
          fx="109.6267"
          fy="135.8619"
          r="71.46001">
          <Stop offset=".2312727" stopColor="#ff4541" />
          <Stop offset=".3115468" stopColor="#ff4540" />
          <Stop offset=".4575163" stopColor="#ff4640" />
          <Stop offset=".540305" stopColor="#ff473f" />
          <Stop offset=".6993464" stopColor="#ff5138" />
          <Stop offset=".7712418" stopColor="#ff5b33" />
          <Stop offset=".8605665" stopColor="#ff6c29" />
          <Stop offset="1" stopColor="#ff8c18" />
        </RadialGradient>
        <RadialGradient
          id="n"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-3.512595,-4.45809,-1.692547,1.260616,870.8006,191.554)"
          cx="45.25866"
          cy="279.2738"
          fx="45.25866"
          fy="279.2738"
          r="71.46001">
          <Stop offset=".1315461" stopColor="#0cba65" />
          <Stop offset=".2097843" stopColor="#0bb86d" />
          <Stop offset=".2972969" stopColor="#09b479" />
          <Stop offset=".3962575" stopColor="#08ad93" />
          <Stop offset=".4771242" stopColor="#0aa6a9" />
          <Stop offset=".5684245" stopColor="#0d9cc6" />
          <Stop offset=".667385" stopColor="#1893dd" />
          <Stop offset=".7687273" stopColor="#258bf1" />
          <Stop offset=".8585063" stopColor="#3086ff" />
        </RadialGradient>
        <RadialGradient
          id="l"
          cx="304.0166"
          cy="118.0089"
          fx="304.0166"
          fy="118.0089"
          r="47.85445"
          gradientTransform="matrix(2.064353,-4.926832e-6,-2.901531e-6,2.592041,-297.6788,-151.7469)"
          gradientUnits="userSpaceOnUse">
          <Stop offset=".4084578" stopColor="#fb4e5a" />
          <Stop offset="1" stopColor="#ff4540" />
        </RadialGradient>
        <RadialGradient
          id="o"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-0.2485783,2.083138,2.962486,0.3341668,-255.1463,-331.1636)"
          cx="181.001"
          cy="177.2013"
          fx="181.001"
          fy="177.2013"
          r="71.46001">
          <Stop offset=".3660131" stopColor="#ff4e3a" />
          <Stop offset=".4575163" stopColor="#ff8a1b" />
          <Stop offset=".540305" stopColor="#ffa312" />
          <Stop offset=".6156363" stopColor="#ffb60c" />
          <Stop offset=".7712418" stopColor="#ffcd0a" />
          <Stop offset=".8605665" stopColor="#fecf0a" />
          <Stop offset=".9150327" stopColor="#fecf08" />
          <Stop offset="1" stopColor="#fdcd01" />
        </RadialGradient>
        <RadialGradient
          id="p"
          cx="207.6733"
          cy="108.0972"
          fx="207.6733"
          fy="108.0972"
          r="41.1025"
          gradientTransform="matrix(-1.249206,1.343263,-3.896837,-3.425693,880.5011,194.9051)"
          gradientUnits="userSpaceOnUse">
          <Stop offset=".3159041" stopColor="#ff4c3c" />
          <Stop offset=".6038179" stopColor="#ff692c" />
          <Stop offset=".7268366" stopColor="#ff7825" />
          <Stop offset=".884534" stopColor="#ff8d1b" />
          <Stop offset="1" stopColor="#ff9f13" />
        </RadialGradient>
        <RadialGradient
          id="r"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-1.936885,-1.043001,1.455731,-2.555422,290.5254,838.6834)"
          cx="109.6267"
          cy="135.8619"
          fx="109.6267"
          fy="135.8619"
          r="71.46001">
          <Stop offset=".2312727" stopColor="#0fbc5f" />
          <Stop offset=".3115468" stopColor="#0fbc5f" />
          <Stop offset=".3660131" stopColor="#0fbc5e" />
          <Stop offset=".4575163" stopColor="#0fbc5d" />
          <Stop offset=".540305" stopColor="#12bc58" />
          <Stop offset=".6993464" stopColor="#28bf3c" />
          <Stop offset=".7712418" stopColor="#38c02b" />
          <Stop offset=".8605665" stopColor="#52c218" />
          <Stop offset=".9150327" stopColor="#67c30f" />
          <Stop offset="1" stopColor="#86c504" />
        </RadialGradient>
        <RadialGradient
          id="j"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-0.081402,-1.93722,2.926737,-0.1162508,-215.1345,632.8606)"
          cx="154.8697"
          cy="145.9691"
          fx="154.8697"
          fy="145.9691"
          r="71.46001">
          <Stop offset=".1416122" stopColor="#1abd4d" />
          <Stop offset=".2475151" stopColor="#6ec30d" />
          <Stop offset=".3115468" stopColor="#8ac502" />
          <Stop offset=".3660131" stopColor="#a2c600" />
          <Stop offset=".4456735" stopColor="#c8c903" />
          <Stop offset=".540305" stopColor="#ebcb03" />
          <Stop offset=".6156363" stopColor="#f7cd07" />
          <Stop offset=".6993454" stopColor="#fdcd04" />
          <Stop offset=".7712418" stopColor="#fdce05" />
          <Stop offset=".8605661" stopColor="#ffce0a" />
        </RadialGradient>
        <ClipPath id="i">
          <Path
            d="M371.3784 193.2406H237.0825v53.4375h77.167c-1.2405 7.5627-4.0259 15.0024-8.1049 21.7862-4.6734 7.7723-10.4511 13.6895-16.373 18.1957-17.7389 13.4983-38.42 16.2584-52.7828 16.2584-36.2824 0-67.2833-23.2865-79.2844-54.9287-.4843-1.1482-.8059-2.3344-1.1975-3.5068-2.652-8.0533-4.101-16.5825-4.101-25.4474 0-9.226 1.5691-18.0575 4.4301-26.3985 11.2851-32.8967 42.9849-57.4674 80.1789-57.4674 7.4811 0 14.6854.8843 21.5173 2.6481 15.6135 4.0309 26.6578 11.9698 33.4252 18.2494l40.834-39.7111c-24.839-22.616-57.2194-36.3201-95.8444-36.3201-30.8782-.00066-59.3863 9.55308-82.7477 25.6992-18.9454 13.0941-34.4833 30.6254-44.9695 50.9861-9.75366 18.8785-15.09441 39.7994-15.09441 62.2934 0 22.495 5.34891 43.6334 15.10261 62.3374v.126c10.3023 19.8567 25.3678 36.9537 43.6783 49.9878 15.9962 11.3866 44.6789 26.5516 84.0307 26.5516 22.6301 0 42.6867-4.0517 60.3748-11.6447 12.76-5.4775 24.0655-12.6217 34.3012-21.8036 13.5247-12.1323 24.1168-27.1388 31.3465-44.4041 7.2297-17.2654 11.097-36.7895 11.097-57.957 0-9.858-.9971-19.8694-2.6881-28.9684Z"
            fill="#000"
          />
        </ClipPath>
      </Defs>
      <G transform="matrix(0.957922,0,0,0.985255,-90.17436,-78.85577)">
        <G clipPath="url(#i)">
          <Path
            d="M92.07563 219.9585c.14844 22.14 6.5014 44.983 16.11767 63.4234v.1269c6.9482 13.3919 16.4444 23.9704 27.2604 34.4518l65.326-23.67c-12.3593-6.2344-14.2452-10.0546-23.1048-17.0253-9.0537-9.0658-15.8015-19.4735-20.0038-31.677h-.1693l.1693-.1269c-2.7646-8.0587-3.0373-16.6129-3.1393-25.5029Z"
            fill="url(#j)"
          />
          <Path
            d="M237.0835 79.02491c-6.4568 22.52569-3.988 44.42139 0 57.16129 7.4561.0055 14.6388.8881 21.4494 2.6464 15.6135 4.0309 26.6566 11.97 33.424 18.2496l41.8794-40.7256c-24.8094-22.58904-54.6663-37.2961-96.7528-37.33169Z"
            fill="url(#l)"
          />
          <Path
            d="M236.9434 78.84678c-31.6709-.00068-60.9107 9.79833-84.8718 26.35902-8.8968 6.149-17.0612 13.2521-24.3311 21.1509-1.9045 17.7429 14.2569 39.5507 46.2615 39.3702 15.5284-17.9373 38.4946-29.5427 64.0561-29.5427.0233 0 .046.0019.0693.002l-1.0439-57.33536c-.0472-.00003-.0929-.00406-.1401-.00406Z"
            fill="url(#m)"
          />
          <Path
            d="m341.4751 226.3788-28.2685 19.2848c-1.2405 7.5627-4.0278 15.0023-8.1068 21.7861-4.6734 7.7723-10.4506 13.6898-16.3725 18.196-17.7022 13.4704-38.3286 16.2439-52.6877 16.2553-14.8415 25.1018-17.4435 37.6749 1.0439 57.9342 22.8762-.0167 43.157-4.1174 61.0458-11.7965 12.9312-5.551 24.3879-12.7913 34.7609-22.0964 13.7061-12.295 24.4421-27.5034 31.7688-45.0003 7.3267-17.497 11.2446-37.2822 11.2446-58.7336Z"
            fill="url(#n)"
          />
          <Path
            d="M234.9956 191.2104v57.4981h136.0062c1.1962-7.8745 5.1523-18.0644 5.1523-26.5001 0-9.858-.9963-21.899-2.6873-30.998Z"
            fill="#3086ff"
          />
          <Path
            d="M128.3894 124.3268c-8.393 9.1191-15.5632 19.326-21.2483 30.3646-9.75351 18.8785-15.09402 41.8295-15.09402 64.3235 0 .317.02642.6271.02855.9436 4.31953 8.2244 59.66647 6.6495 62.45617 0-.0035-.3103-.0387-.6128-.0387-.9238 0-9.226 1.5696-16.0262 4.4306-24.3672 3.5294-10.2885 9.0557-19.7628 16.1223-27.9257 1.6019-2.0309 5.8748-6.3969 7.1214-9.0157.4749-.9975-.8621-1.5574-.9369-1.9085-.0836-.3927-1.8762-.0769-2.2778-.3694-1.2751-.9288-3.8001-1.4138-5.3334-1.8449-3.2772-.9215-8.7085-2.9536-11.7252-5.0601-9.5357-6.6586-24.417-14.6122-33.5047-24.2164Z"
            fill="url(#o)"
          />
          <Path
            d="M162.0989 155.8569c22.1123 13.3013 28.4714-6.7139 43.173-12.9771L179.698 90.21568c-9.4075 3.92642-18.2957 8.80465-26.5426 14.50442-12.316 8.5122-23.192 18.8995-32.1763 30.7204Z"
            fill="url(#p)"
          />
          <Path
            d="M171.0987 290.222c-29.6829 10.6413-34.3299 11.023-37.0622 29.2903 5.2213 5.0597 10.8312 9.74 16.7926 13.9835 15.9962 11.3867 46.766 26.5517 86.1178 26.5517.0462 0 .0904-.004.1366-.004v-59.1574c-.0298.0001-.064.002-.0938.002-14.7359 0-26.5113-3.8435-38.5848-10.5273-2.9768-1.6479-8.3775 2.7772-11.1229.799-3.7865-2.7284-12.8991 2.3508-16.1833-.9378Z"
            fill="url(#r)"
          />
          <Path
            d="M219.6997 299.0227v59.9959c5.506.6402 11.2361 1.0289 17.2472 1.0289 6.0259 0 11.8556-.3073 17.5204-.8723v-59.7481c-6.3482 1.0777-12.3272 1.461-17.4776 1.461-5.9318 0-11.7005-.6858-17.29-1.8654Z"
            opacity=".5"
            fill="url(#s)"
          />
        </G>
      </G>
    </Svg>
  );
};

GoogleIconBase.displayName = `${COMPONENT_NAMES.GOOGLE_ICON}Base`;

const GoogleIcon: React.NamedExoticComponent<IIconProps> = memo<IIconProps>(GoogleIconBase);

GoogleIcon.displayName = COMPONENT_NAMES.GOOGLE_ICON;

export { GoogleIcon };
