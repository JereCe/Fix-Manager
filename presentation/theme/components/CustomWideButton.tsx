import { Text, Pressable, PressableProps, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "../hooks/useThemeColor";

interface Props extends PressableProps {
  children: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const CustomWideButton = ({ children, icon, ...rest }: Props) => {
  const primaryColor = useThemeColor({}, "buttonColor");
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.button,
        {
          backgroundColor: isPressed ? primaryColor + "90" : primaryColor,
        },
      ]}
      {...rest}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color="white"
          style={{ marginRight: 6 }}
        />
      )}
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
};

export default CustomWideButton;

const styles = StyleSheet.create({
  button: {
    height: 50,
    minWidth: 150,
    borderRadius: 8,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  label: {
    color: "white",
    fontWeight: "bold",
  },
});
