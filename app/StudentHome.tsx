// pages/studentHome.tsx
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

export default function StudentHome() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeMessage}>Bem-vindo, Estudante!</Text>

      <Text style={styles.infoText}>
        Aqui você pode gerenciar suas informações, visualizar suas aulas e muito
        mais.
      </Text>

      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0a7d42",
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
});
