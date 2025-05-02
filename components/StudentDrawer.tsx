// components/StudentDrawer.tsx
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export function CustomDrawerContent(props: any) {
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/bora-uni-logo.png")}
          style={styles.logo}
        />
      </View>

      <DrawerItem
        label="Início"
        onPress={() => router.push("/(student)")}
        icon={({ color, size }) => (
          <Ionicons name="home" size={size} color="#0a7d42" />
        )}
        labelStyle={styles.label}
        style={styles.item}
      />

      <DrawerItem
        label="Meu Perfil"
        onPress={() => router.push("../(student)/profile")}
        icon={({ color, size }) => (
          <Ionicons name="person" size={size} color="#0a7d42" />
        )}
        labelStyle={styles.label}
        style={styles.item}
      />

      <DrawerItem
        label="Configurações"
        onPress={() => router.push("../(student)/settings")}
        icon={({ color, size }) => (
          <Ionicons name="settings" size={size} color="#0a7d42" />
        )}
        labelStyle={styles.label}
        style={styles.item}
      />

      <DrawerItem
        label="Sair"
        onPress={() => router.push("../(auth)/login")}
        icon={({ color, size }) => (
          <Ionicons name="log-out" size={size} color="#ff4444" />
        )}
        labelStyle={[styles.label, { color: "#ff4444" }]}
        style={styles.item}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logo: {
    width: 160,
    height: 60,
    resizeMode: "contain",
    marginBottom: 10,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    marginHorizontal: 10,
  },
  label: {
    fontSize: 16,
    color: "#0a7d42",
    marginLeft: -15,
  },
});
