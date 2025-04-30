import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function HomePage() {
  const { role } = useLocalSearchParams();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login"); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeMessage}>
        Bem-vindo, {role === "driver" ? "Motorista" : "Estudante"}!
      </Text>

      <Text style={styles.infoText}>
        Essa é a sua página inicial. Aqui você pode gerenciar suas informações.
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
