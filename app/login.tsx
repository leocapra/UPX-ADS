import React, { useState } from "react";
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
import Toast from "react-native-toast-message";
import { loginUser } from "@/services/authService";

export default function LoginScreen() {
  const { role } = useLocalSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    router.push("/");
  };

  const handleNavigateToRegister = () => {
    router.push({ pathname: "/register", params: { role } });
  };

  const showError = (message: string) => {
    Toast.show({
      type: "error",
      text1: "Erro no Login",
      text2: message,
    });
  };

  const showSuccess = () => {
    Toast.show({
      type: "success",
      text1: "Bem-vindo!",
      text2: "Login realizado com sucesso!",
    });
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      return showError("Preencha todos os campos.");
    }

    setLoading(true);
    try {
      const response = await loginUser({
        email,
        senha,
        role: role === "driver" ? 3 : 4,
      });

      showSuccess();
      setTimeout(() => {
        if (role === "driver") {
          router.push({ pathname: "/DriverHome", params: { role: "driver" } });
        } else if (role === "student") {
          router.push({ pathname: "/StudentHome", params: { role: "student" } });
        }
      }, 1500);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao realizar login";
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#0a7d42" />
      </TouchableOpacity>

      <Image
        source={
          role === "driver"
            ? require("../assets/images/persona-motorista.png")
            : require("../assets/images/persona-estudante.png")
        }
        style={styles.persona}
      />

      <Text style={styles.title}>
        Login como {role === "driver" ? "Motorista" : "Estudante"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerLink}
        onPress={handleNavigateToRegister}
      >
        <Text style={styles.registerLinkText}>
          Não tem uma conta?{" "}
          <Text style={styles.registerLinkHighlight}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>

      <Toast />
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
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerLinkText: {
    color: "#666",
  },
  registerLinkHighlight: {
    color: "#0a7d42",
    fontWeight: "bold",
  },
});
