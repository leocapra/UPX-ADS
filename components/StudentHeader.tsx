import { View, Image, StyleSheet } from "react-native";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useTheme } from "react-native-paper";

export default function StudentHeader() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Image
        source={require("@/assets/images/bora-uni-logo.png")}
        style={styles.logo}
      />
      <View style={styles.spacer} />
      <DrawerToggleButton tintColor={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logo: {
    width: 120,
    height: 60,
    resizeMode: "contain",
  },
  spacer: {
    flex: 1,
  },
});
