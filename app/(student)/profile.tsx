// app/(student)/profile.tsx
import { View, Text, StyleSheet } from "react-native";

export default function StudentProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      {/* Adicione o conteúdo do perfil aqui */}
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
    marginBottom: 20,
    fontWeight: "bold",
  },
});
