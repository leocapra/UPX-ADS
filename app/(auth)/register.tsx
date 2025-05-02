import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { registerUser } from "@/services/authService";
import { registerStyles } from "./registerStyles";

interface FormData {
  nome: string;
  sobre_nome: string;
  email: string;
  senha: string;
  cpf_cnpj: string;
  telefone: string;
  role_id: number;
  placa?: string;
  modelo_veiculo?: string;
  cor_veiculo?: string;
  ano_veiculo?: string;
  numero_cnh?: string;
  universidade?: string;
  curso?: string;
}

export default function RegisterScreen() {
  const { role } = useLocalSearchParams<{ role: "driver" | "student" }>();
  const router = useRouter();

  const initialFormData: FormData = {
    nome: "",
    sobre_nome: "",
    email: "",
    senha: "",
    cpf_cnpj: "",
    telefone: "",
    role_id: role === "driver" ? 3 : 4,
    ...(role === "driver"
      ? {
          placa: "",
          modelo_veiculo: "",
          cor_veiculo: "",
          ano_veiculo: "",
          numero_cnh: "",
        }
      : {
          universidade: "",
          curso: "",
        }),
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const showError = (message: string) => {
    Toast.show({
      type: "error",
      text1: "Erro no Cadastro",
      text2: message,
    });
  };

  const showSuccess = () => {
    Toast.show({
      type: "success",
      text1: "Sucesso",
      text2: "Cadastro realizado com sucesso!",
    });
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await registerUser(formData);
      showSuccess();
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Ocorreu um erro durante o cadastro. Tente novamente.";
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInfo = () => (
    <>
      <Text style={registerStyles.sectionTitle}>Informações Básicas</Text>
      {["nome", "sobre_nome", "email", "senha", "cpf_cnpj", "telefone"].map(
        (field) => (
          <TextInput
            key={field}
            style={registerStyles.input}
            placeholder={field.replace("_", " ").toUpperCase()}
            value={formData[field as keyof FormData] as string}
            onChangeText={(text) => handleChange(field as keyof FormData, text)}
            secureTextEntry={field === "senha"}
            keyboardType={
              field === "email"
                ? "email-address"
                : ["cpf_cnpj", "telefone"].includes(field)
                ? "numeric"
                : "default"
            }
            autoCapitalize={field === "email" ? "none" : "sentences"}
          />
        )
      )}
    </>
  );

  const renderRoleSpecificInfo = () => {
    const fields =
      role === "driver"
        ? [
            "placa",
            "modelo_veiculo",
            "cor_veiculo",
            "ano_veiculo",
            "numero_cnh",
          ]
        : ["universidade", "curso"];

    return (
      <>
        <Text style={registerStyles.sectionTitle}>
          {role === "driver"
            ? "Informações do Motorista"
            : "Informações Acadêmicas"}
        </Text>
        {fields.map((field) => (
          <TextInput
            key={field}
            style={registerStyles.input}
            placeholder={field.replace("_", " ").toUpperCase()}
            value={formData[field as keyof FormData] as string}
            onChangeText={(text) => handleChange(field as keyof FormData, text)}
            keyboardType={
              field === "ano_veiculo" || field === "numero_cnh"
                ? "numeric"
                : "default"
            }
            autoCapitalize={field === "placa" ? "characters" : "words"}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <ScrollView contentContainerStyle={registerStyles.scrollContainer}>
        <View style={registerStyles.container}>
          <TouchableOpacity
            style={registerStyles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#0a7d42" />
          </TouchableOpacity>

          <Image
            source={
              role === "driver"
                ? require("../../assets/images/persona-motorista.png")
                : require("../../assets/images/persona-estudante.png")
            }
            style={registerStyles.persona}
          />

          <Text style={registerStyles.title}>
            Cadastro como {role === "driver" ? "Motorista" : "Estudante"}
          </Text>

          {renderBasicInfo()}
          {renderRoleSpecificInfo()}

          <TouchableOpacity
            style={registerStyles.registerButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={registerStyles.registerButtonText}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast /> {/* Toast container */}
    </>
  );
}
