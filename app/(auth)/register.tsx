import React, { useState } from "react";
import { View, Image, ScrollView, StyleSheet, ImageBackground } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { authService } from "@/services/authService";
import { Formik } from "formik";
import * as yup from "yup";
import { MaskService } from "react-native-masked-text";
import { useMutation } from "@/hooks/useMutation";
import { AxiosError } from "axios";
import {
  TextInput,
  Button,
  Text,
  Menu,
  Divider,
  Provider as PaperProvider,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { greenTheme } from "../AppTheme";

export default function RegisterScreen() {
  const { role } = useLocalSearchParams<{ role: "driver" | "student" }>();
  const router = useRouter();
  const theme = useTheme();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [anoMenuVisible, setAnoMenuVisible] = useState(false);

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
          veiculo: yup.string().required("Veículo obrigatório"),
          cor_veiculo: yup.string().required("Cor obrigatória"),
          ano_veiculo: yup
            .number()
            .typeError("O Ano deve ser um número")
            .required("Ano obrigatório"),
          numero_cnh: yup
            .string()
            .matches(/^\d{11}$/, "CNH deve conter exatamente 11 dígitos")
            .required("CNH obrigatória"),
        }
      : {
          universidade: yup.string().required("Universidade obrigatória"),
          curso: yup.string().required("Curso obrigatório"),
        }),
  });

  const generateYearOptions = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let year = 2012; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse();
  };

  const [register, isRegistering] = useMutation(authService.registerUser);

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

  const renderInput = (
    fieldProps: any,
    name: string,
    label: string,
    options: any = {}
  ) => {
    const hasError = !!fieldProps.errors[name] && fieldProps.touched[name];

    // Tratamento especial para campos com máscara
    const handleChange = (text: string) => {
      let processedText = text;

      if (name === "cpf_cnpj") {
        processedText = MaskService.toMask("cpf", text);
      } else if (name === "telefone") {
        processedText = MaskService.toMask("cel-phone", text, {
          maskType: "BRL",
          withDDD: true,
          dddMask: "(99) ",
        });
      } else if (name === "numero_cnh") {
        // Remove caracteres não numéricos e limita a 11 dígitos
        processedText = text.replace(/[^0-9]/g, "").slice(0, 11);
      }

      fieldProps.setFieldValue(name, processedText);
    };

    return (
      <View key={name} style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          label={label}
          value={fieldProps.values[name]}
          onBlur={fieldProps.handleBlur(name)}
          onChangeText={handleChange}
          error={hasError}
          style={styles.input}
          {...options}
        />
        {hasError && (
          <Text style={styles.errorText}>
            {fieldProps.errors[name] as string}
          </Text>
        )}
      </View>
    );
  };

  const renderAnoSelect = (fieldProps: any) => {
    const hasError =
      !!fieldProps.errors.ano_veiculo && fieldProps.touched.ano_veiculo;
    const anos = generateYearOptions();

    return (
      <View style={styles.inputContainer}>
        <Menu
          visible={anoMenuVisible}
          onDismiss={() => setAnoMenuVisible(false)}
          anchor={
            <TouchableRipple onPress={() => setAnoMenuVisible(true)}>
              <TextInput
                mode="outlined"
                label="Ano do Veículo"
                value={
                  fieldProps.values.ano_veiculo
                    ? fieldProps.values.ano_veiculo.toString()
                    : ""
                }
                editable={false}
                error={hasError}
                right={<TextInput.Icon icon="menu-down" />}
              />
            </TouchableRipple>
          }
          style={styles.menu}
        >
          <ScrollView style={{ maxHeight: 200 }}>
            {anos.map((ano) => (
              <Menu.Item
                key={ano}
                title={ano.toString()}
                onPress={() => {
                  fieldProps.setFieldValue("ano_veiculo", ano);
                  setAnoMenuVisible(false);
                }}
              />
            ))}
          </ScrollView>
        </Menu>
        {hasError && (
          <Text style={styles.errorText}>
            {fieldProps.errors.ano_veiculo as string}
          </Text>
        )}
      </View>
    );
  };

  return (
    <PaperProvider theme={greenTheme}>
      <ImageBackground
        source={require("../../assets/images/green-waves-bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <Formik
          initialValues={{
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
                  veiculo: "",
                  cor_veiculo: "",
                  ano_veiculo: "",
                  numero_cnh: "",
                }
              : { universidade: "", curso: "" }),
          }}
          validationSchema={schema}
          onSubmit={async (values) => {
            try {
              const response = await register(values);
              const successMessage =
                response?.data?.message || "Cadastro realizado com sucesso!";
              showToast("success", "Sucesso", successMessage);
              setTimeout(() => router.back(), 1500);
            } catch (error) {
              const err = error as AxiosError<{
                response?: string;
                message?: string;
              }>;
              const errorMessage =
                err.response?.data?.response ||
                err.response?.data?.message ||
                err.message ||
                "Erro ao cadastrar.";

              showToast("error", "Erro no Cadastro", errorMessage);
            }
          }}
        >
          {(formikProps) => (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.container}>
                <TouchableRipple
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color={theme.colors.primary}
                  />
                </TouchableRipple>

                <Image
                  source={
                    role === "driver"
                      ? require("../../assets/images/persona-motorista.png")
                      : require("../../assets/images/persona-estudante.png")
                  }
                  style={styles.persona}
                />

                <Text variant="headlineMedium" style={styles.title}>
                  Cadastro como {role === "driver" ? "Motorista" : "Estudante"}
                </Text>

                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Informações Básicas
                </Text>

                {renderInput(formikProps, "nome", "Nome")}
                {renderInput(formikProps, "sobre_nome", "Sobrenome")}
                {renderInput(formikProps, "email", "E-mail", {
                  keyboardType: "email-address",
                  autoCapitalize: "none",
                })}

                {renderInput(formikProps, "senha", "Senha", {
                  secureTextEntry: secureTextEntry,
                  right: (
                    <TextInput.Icon
                      icon={secureTextEntry ? "eye-off" : "eye"}
                      onPress={() => setSecureTextEntry(!secureTextEntry)}
                    />
                  ),
                })}

                {renderInput(formikProps, "confirmSenha", "Confirmar Senha", {
                  secureTextEntry: secureConfirmTextEntry,
                  right: (
                    <TextInput.Icon
                      icon={secureConfirmTextEntry ? "eye-off" : "eye"}
                      onPress={() =>
                        setSecureConfirmTextEntry(!secureConfirmTextEntry)
                      }
                    />
                  ),
                })}

                {renderInput(formikProps, "cpf_cnpj", "CPF", {
                  keyboardType: "numeric",
                })}

                {renderInput(formikProps, "telefone", "Telefone", {
                  keyboardType: "phone-pad",
                })}

                <Divider style={styles.divider} />

                <Text variant="titleMedium" style={styles.sectionTitle}>
                  {role === "driver"
                    ? "Informações do Motorista"
                    : "Informações Acadêmicas"}
                </Text>

                {role === "driver" ? (
                  <>
                    {renderInput(formikProps, "placa", "Placa do Veículo")}
                    {renderInput(formikProps, "cor_veiculo", "Cor do Veículo")}
                    {renderAnoSelect(formikProps)}
                    {renderInput(formikProps, "numero_cnh", "Número da CNH", {
                      keyboardType: "numeric",
                    })}
                    {renderInput(formikProps, "veiculo", "Modelo do Veículo")}
                  </>
                ) : (
                  <>
                    {renderInput(formikProps, "universidade", "Universidade")}
                    {renderInput(formikProps, "curso", "Curso")}
                  </>
                )}

                <Button
                  mode="contained"
                  onPress={() => formikProps.handleSubmit()}
                  loading={isRegistering}
                  disabled={isRegistering}
                  style={styles.registerButton}
                  labelStyle={styles.registerButtonText}
                >
                  {isRegistering ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </View>
            </ScrollView>
          )}
        </Formik>
        <Toast />
      </ImageBackground>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
  },
  persona: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginVertical: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#0a7d42"
  },
  sectionTitle: {
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#555",
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
  registerButton: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: "#0a7d42",
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  divider: {
    marginVertical: 15,
    height: 1,
  },
  menu: {
    marginTop: 50,
  },
});