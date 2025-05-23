import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "driver" | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [role]);

  return (
    <ImageBackground
      source={require("../assets/images/green-waves-bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text variant="headlineLarge" style={styles.title}>
          Bem-vindo de volta!
        </Text>

        <Text variant="titleMedium" style={styles.subtitle}>
          {role
            ? `Entrar como ${role === "driver" ? "Motorista" : "Estudante"}`
            : "Escolha seu perfil para continuar"}
        </Text>

        {!role ? (
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => setRole("student")}
              style={styles.outlinedButton}
              labelStyle={styles.buttonLabel}
            >
              Sou Estudante
            </Button>
            <Button
              mode="outlined"
              onPress={() => setRole("driver")}
              style={styles.outlinedButton}
              labelStyle={styles.buttonLabel}
            >
              Sou Motorista
            </Button>
          </View>
        ) : (
          <Animated.View
            style={[styles.buttonContainer, { opacity: fadeAnim }]}
          >
            <Button
              mode="outlined"
              onPress={() =>
                router.push({ pathname: "/login", params: { role } })
              }
              style={styles.outlinedButton}
              labelStyle={styles.buttonLabel}
            >
              Entrar
            </Button>
            <Button
              mode="contained"
              onPress={() =>
                router.push({ pathname: "/register", params: { role } })
              }
              style={styles.filledButton}
              labelStyle={styles.buttonLabel}
            >
              Criar Conta
            </Button>
            <Button
              mode="text"
              onPress={() => setRole(null)}
              style={styles.backButton}
              labelStyle={styles.backButtonLabel}
            >
              Voltar
            </Button>
          </Animated.View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    color: "#eee",
    textAlign: "center",
    marginBottom: 48,
  },
  buttonContainer: {
    gap: 12,
    alignItems: "center",
    width: "100%",
  },
  outlinedButton: {
    borderColor: "#fff",
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 20,
    width: "80%",
  },
  filledButton: {
    backgroundColor: "#0a7d42",
    borderRadius: 20,
    paddingHorizontal: 20,
    width: "80%",
  },
  backButton: {
    marginTop: 12,
  },
  buttonLabel: {
    fontWeight: "bold",
    color: "#fff",
  },
  backButtonLabel: {
    color: "#ccc",
    fontWeight: "normal",
  },
});
