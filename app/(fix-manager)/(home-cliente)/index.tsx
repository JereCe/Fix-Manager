import { View } from "react-native";
import React from "react";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

const HomeClienteScreen = () => {
  const primary = useThemeColor({}, "primary");
  return (
    <View
      style={{
        paddingTop: 100,
        paddingHorizontal: 20,
      }}
    >
      <ThemedText style={{ fontFamily: "RobotoThin", color: primary }}>
        HomeClienteScreen
      </ThemedText>
      <ThemedText style={{ fontFamily: "RobotoRegular" }}>
        HomeClienteScreen
      </ThemedText>
      <ThemedText style={{ fontFamily: "RobotoSemiBold" }}>
        HomeClienteScreen
      </ThemedText>
      <ThemedText style={{ fontFamily: "RobotoExtraBold" }}>
        HomeClienteScreen
      </ThemedText>
    </View>
  );
};

export default HomeClienteScreen;
