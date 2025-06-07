import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

interface CustomButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexBasis: "43%",
    backgroundColor: "#759aad",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: "center",
    margin: 6,
  },
  label: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CustomButton;
