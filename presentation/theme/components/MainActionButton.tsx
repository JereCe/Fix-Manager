import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "../hooks/useThemeColor";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}

export default function MainActionButton({ icon, label, onPress }: Props) {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 160,
        height: 160,
        borderRadius: 8,
        borderColor: "#ccc",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        backgroundColor: backgroundColor,
      }}
    >
      <Ionicons name={icon} size={90} color="white" />
      <Text style={{ color: "#fff", marginTop: 8, textAlign: "center" }}>
        {label}
      </Text>
    </Pressable>
  );
}
