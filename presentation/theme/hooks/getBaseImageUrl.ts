import { Platform } from "react-native";

export const getBaseImageUrl = () => {
  return Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_API_URL_IMG_BASE_URL_IOS
    : process.env.EXPO_PUBLIC_API_URL_IMG_BASE_URL_ANDROID;
};
