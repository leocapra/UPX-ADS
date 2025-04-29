import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const { role } = useLocalSearchParams();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#0a7d42" />
      </TouchableOpacity>

      {role === "driver" ? (
        <Image
          source={require("../assets/images/persona-motorista.png")}
          style={styles.persona}
        />
      ) : (
        <Image
          source={require("../assets/images/persona-estudante.png")}
          style={styles.persona}
        />
      )}

      <Text style={styles.title}>
        Login como {role === "driver" ? "Motorista" : "Estudante"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput style={styles.input} placeholder="Senha" secureTextEntry />

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    color: "#0a7d42",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: "#0a7d42",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  persona: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
    alignSelf: "center",
  },
});
