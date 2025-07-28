/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const goldColor = '#D4AF37';
const bronzeColor = '#8C7853';

export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: goldColor,
    icon: bronzeColor,
    tabIconDefault: bronzeColor,
    tabIconSelected: goldColor,
    card: 'rgba(255, 255, 255, 0.9)',
    border: goldColor,
    primary: goldColor,
    secondary: bronzeColor,
    backgroundImage: require('@/assets/images/arka-plan-aydinlik.jpg'),
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: goldColor,
    icon: bronzeColor,
    tabIconDefault: bronzeColor,
    tabIconSelected: goldColor,
    card: 'rgba(0, 0, 0, 0.7)',
    border: goldColor,
    primary: goldColor,
    secondary: bronzeColor,
    backgroundImage: require('@/assets/images/arka-plan-karanlik.jpg'),
  },
};
