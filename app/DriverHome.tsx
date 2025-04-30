// pages/driverHome.tsx
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

export default function DriverHome() {
  const router = useRouter();

  const handleLogout = () => {
    // Realiza o logout e redireciona para a tela de login
    router.push("/login"); // Caminho para a tela de login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeMessage}>Bem-vindo, Motorista!</Text>

      <Text style={styles.infoText}>
        Aqui você pode gerenciar suas informações, visualizar corridas e muito
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
