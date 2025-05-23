import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "@/services/authService";
import { useMutation } from "@/hooks/useMutation";
import {
  Text,
  TextInput,
  Button,
  TouchableRipple,
  useTheme,
  Avatar,
  Provider as PaperProvider,
} from "react-native-paper";
import { greenTheme } from "../AppTheme";

export default function LoginScreen() {
  const { role } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
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
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      showSuccess();

      setTimeout(() => {
        router.push(user.role_id === 3 ? "/(driver)" : "/(student)");
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
    <PaperProvider theme={greenTheme}>
      <ImageBackground
        source={require("../../assets/images/green-waves-bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <TouchableRipple
              style={styles.backButton}
              onPress={() => router.push("/")}
              borderless
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableRipple>

            <View style={styles.card}>
              <Avatar.Image
                size={120}
                source={
                  role === "driver"
                    ? require("../../assets/images/persona-motorista.png")
                    : require("../../assets/images/persona-estudante.png")
                }
                style={styles.persona}
              />

              <Text variant="headlineMedium" style={styles.title}>
                Login como {role === "driver" ? "Motorista" : "Estudante"}
              </Text>

              <TextInput
                mode="outlined"
                label="Email"
                placeholder="Digite seu email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                mode="outlined"
                label="Senha"
                placeholder="Digite sua senha"
                secureTextEntry={secureTextEntry}
                value={senha}
                onChangeText={setSenha}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={secureTextEntry ? "eye-off" : "eye"}
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                  />
                }
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
                labelStyle={styles.loginButtonText}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>

              <Button
                mode="text"
                onPress={() =>
                  router.push({ pathname: "/register", params: { role } })
                }
                style={styles.registerLink}
                labelStyle={styles.registerLinkText}
              >
                Não tem uma conta?{" "}
                <Text style={styles.registerLinkHighlight}>Cadastre-se</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
        <Toast />
      </ImageBackground>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 24,
    borderRadius: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    color: "#0a7d42",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  loginButton: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#0a7d42",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  persona: {
    alignSelf: "center",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  registerLink: {
    marginTop: 16,
  },
  registerLinkText: {
    color: "#666",
    textAlign: "center",
  },
  registerLinkHighlight: {
    color: "#0a7d42",
    fontWeight: "bold",
  },
});
