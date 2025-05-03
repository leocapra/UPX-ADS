// components/StudentHeader.tsx
import { View, Image, TouchableOpacity } from "react-native";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DriverHeader() {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      }}
    >
      <Image
        source={require("@/assets/images/bora-uni-logo.png")}
        style={{ width: 120, height: 60, resizeMode: "contain" }}
      />
      <View style={{ flex: 1 }} />
      <DrawerToggleButton tintColor="#0a7d42" />
    </View>
  );
}
