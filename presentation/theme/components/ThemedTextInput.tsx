import { View, TextInputProps, StyleSheet, TextInput } from "react-native";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "../hooks/useThemeColor";

interface Props extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
}

const ThemedTextInput = ({ icon, ...rest }: Props) => {
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "textColor");

  const [isActive, setIsActive] = useState(false);

  const inputRef = useRef<TextInput>(null);

  return (
    <View
      style={{
        ...styles.border,
        borderColor: isActive ? primaryColor : "#CCC",
        backgroundColor: useThemeColor({}, "textInputBG"),
        marginBottom: 15,
      }}
      onTouchStart={() => inputRef.current?.focus()}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={24}
          color={textColor}
          style={{
            marginRight: 10,
          }}
        />
      )}
      <TextInput
        ref={inputRef}
        placeholderTextColor={textColor}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        style={{
          color: textColor,
          marginRight: 10,
          flex: 1,
        }}
        {...rest}
      />
    </View>
  );
};

export default ThemedTextInput;

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  Background: {
    backgroundColor: "#0A0F15",
  },
});
