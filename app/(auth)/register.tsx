// app/(auth)/register.tsx
import React from "react";
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
import { authService } from "@/services/authService";
import { registerStyles } from "./registerStyles";
import { Controller, useForm } from "react-hook-form";
import { MaskService } from "react-native-masked-text";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@/hooks/useMutation";
import { AxiosError } from "axios";

interface FormData {
  nome: string;
  sobre_nome: string;
  email: string;
  senha: string;
  confirmSenha: string;
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

interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

export default function RegisterScreen() {
  const { role } = useLocalSearchParams<{ role: "driver" | "student" }>();
  const router = useRouter();

  const schema = yup.object().shape({
    nome: yup.string().required("Nome é obrigatório"),
    sobre_nome: yup.string().required("Sobrenome é obrigatório"),
    email: yup
      .string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    senha: yup
      .string()
      .min(6, "Mínimo de 6 caracteres")
      .required("Senha obrigatória"),
    confirmSenha: yup
      .string()
      .oneOf([yup.ref("senha")], "As senhas não coincidem")
      .required("Confirme a senha"),
    cpf_cnpj: yup
      .string()
      .matches(/\d{3}\.\d{3}\.\d{3}-\d{2}/, "CPF inválido")
      .required("CPF obrigatório"),
    telefone: yup
      .string()
      .matches(/\(\d{2}\) \d{5}-\d{4}/, "Telefone inválido")
      .required("Telefone obrigatório"),
    ...(role === "driver"
      ? {
          placa: yup.string().required("Placa obrigatória"),
          modelo_veiculo: yup.string().required("Modelo obrigatório"),
          cor_veiculo: yup.string().required("Cor obrigatória"),
          ano_veiculo: yup.string().required("Ano obrigatório"),
          numero_cnh: yup.string().required("CNH obrigatória"),
        }
      : {
          universidade: yup.string().required("Universidade obrigatória"),
          curso: yup.string().required("Curso obrigatório"),
        }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      nome: "",
      sobre_nome: "",
      email: "",
      senha: "",
      confirmSenha: "",
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
    },
  });

  const showToast = (
    type: "success" | "error",
    title: string,
    message: string
  ) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      visibilityTime: 4000,
      autoHide: true,
    });
  };

  const [register, isRegistering, registerData, registerError] =
    useMutation(authService.registerUser);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await register(data);

      const successMessage =
        (response as { data?: ErrorResponse })?.data?.message ||
        "Cadastro realizado com sucesso!";
      showToast("success", "Sucesso", successMessage);
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erro ao cadastrar. Tente novamente.";
      showToast("error", "Erro no Cadastro", errorMessage);
    }
  };

  const renderInput = (
    name: keyof FormData,
    placeholder: string,
    options: any = {}
  ) => (
    <Controller
      key={name}
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur } }) => (
        <View style={{ marginBottom: 10 }}>
          <TextInput
            style={[
              registerStyles.input,
              errors[name] && { borderColor: "red" },
            ]}
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            onChangeText={(text) =>
              onChange(
                name === "cpf_cnpj"
                  ? MaskService.toMask("cpf", text)
                  : name === "telefone"
                  ? MaskService.toMask("cel-phone", text, {
                      maskType: "BRL",
                      withDDD: true,
                      dddMask: "(15) ",
                    })
                  : text
              )
            }
            {...options}
          />
          {errors[name] && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {errors[name]?.message as string}
            </Text>
          )}
        </View>
      )}
    />
  );

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

          <Text style={registerStyles.sectionTitle}>Informações Básicas</Text>
          {renderInput("nome", "Nome")}
          {renderInput("sobre_nome", "Sobrenome")}
          {renderInput("email", "E-mail", { keyboardType: "email-address" })}
          {renderInput("senha", "Senha", { secureTextEntry: true })}
          {renderInput("confirmSenha", "Confirmar Senha", {
            secureTextEntry: true,
          })}
          {renderInput("cpf_cnpj", "CPF", { keyboardType: "numeric" })}
          {renderInput("telefone", "Telefone", { keyboardType: "numeric" })}

          <Text style={registerStyles.sectionTitle}>
            {role === "driver"
              ? "Informações do Motorista"
              : "Informações Acadêmicas"}
          </Text>

          {role === "driver" ? (
            <>
              {renderInput("placa", "Placa")}
              {renderInput("modelo_veiculo", "Modelo")}
              {renderInput("cor_veiculo", "Cor")}
              {renderInput("ano_veiculo", "Ano")}
              {renderInput("numero_cnh", "CNH")}
            </>
          ) : (
            <>
              {renderInput("universidade", "Universidade")}
              {renderInput("curso", "Curso")}
            </>
          )}

          <TouchableOpacity
            style={[
              registerStyles.registerButton,
              isRegistering && { opacity: 0.5 },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isRegistering}
          >
            <Text style={registerStyles.registerButtonText}>
              {isRegistering ? "Cadastrando..." : "Cadastrar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
    </>
  );
}
