# expo-motion-blur

Native Motion Blur for Android & iOS

https://github.com/user-attachments/assets/REPLACE_WITH_VIDEO_ID

## Installation

```sh
npx expo install expo-motion-blur
```

This package contains native code and requires a [development build](https://docs.expo.dev/develop/development-builds/introduction/). It is not supported in Expo Go.

## Usage

Wrap any moving content in `MotionBlurView`. The blur follows the view's on-screen velocity, whatever is driving it.

```tsx
import { MotionBlurView } from 'expo-motion-blur';

<MotionBlurView intensity={40} speedForMaxBlur={1500}>
  <Card />
</MotionBlurView>;
```

## API

`MotionBlurView` accepts all `View` props, plus the following:

| Prop              | Type      | Default | Description                                                                |
| ----------------- | --------- | ------- | -------------------------------------------------------------------------- |
| `intensity`       | `number`  | `40`    | Maximum streak length, in points, on each side of the content.             |
| `speedForMaxBlur` | `number`  | `1500`  | Speed, in points per second, at which `intensity` is reached.              |
| `samples`         | `number`  | `32`    | Texture reads per pixel (4–64). Higher values are smoother but cost more.  |
| `enabled`         | `boolean` | `true`  | When `false`, children render as in a plain `View`.                        |
| `live`            | `boolean` | `false` | Re-captures children every frame. Use for content that changes mid-motion. |

## Platform support

| Platform                  | Behavior                                           |
| ------------------------- | -------------------------------------------------- |
| iOS / tvOS 16.4+          | Per-pixel Metal shader                             |
| Android 13+               | Per-pixel runtime shader                           |
| Android 12                | Directional blur along the view's center of motion |
| Android 11 and below, Web | No blur; children render normally                  |

## License

MIT
