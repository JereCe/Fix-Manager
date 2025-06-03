/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",

    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    background: "#121E28", // Fondo general
    cardBackground: "#1F2E3C", // Cuadros o tarjetas
    textInputBG: "#1F2E3C", // Fondos de inputs
    buttonColor: "#759AAD", // Color del botón principal
    textColor: "#A5AAB1",
    primary: "#3D64F4",
  },
  dark: {
    text: "#ECEDEE",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    background: "#121E28", // Fondo general
    cardBackground: "#1F2E3C", // Cuadros o tarjetas
    textInputBG: "#1F2E3C", // Fondos de inputs
    buttonColor: "#759AAD", // Color del botón principal
    textColor: "#A5AAB1",
    primary: "#3D64F4",
  },
};
