// app/(student)/index.tsx
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function StudentHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, Estudante!</Text>
      <Text style={styles.subtitle}>Você está na página inicial</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    color: "#0a7d42",
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
