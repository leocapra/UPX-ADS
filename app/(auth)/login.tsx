// app/(auth)/login.tsx
import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "@/services/authService";
import { useMutation } from "@/hooks/useMutation";

export default function LoginScreen() {
  const { role } = useLocalSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [login, isLoading] = useMutation(authService.loginUser);

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

    try {
      const response = await login({
        email,
        senha,
        role: role === "driver" ? 3 : 4,
      });

      const { token, user } = response.data;

      console.log(`response data`, response.data)

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      showSuccess();

      setTimeout(() => {
        if (user.role_id === 3) {
          router.push("/(driver)");
        } else {
          router.push("/(student)");
        }
      }, 1500);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao realizar login";
      showError(msg);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/")}
      >
        <Ionicons name="arrow-back" size={24} color="#0a7d42" />
      </TouchableOpacity>

      <Image
        source={
          role === "driver"
            ? require("../../assets/images/persona-motorista.png")
            : require("../../assets/images/persona-estudante.png")
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
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => router.push({ pathname: "/register", params: { role } })}
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
