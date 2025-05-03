// app/(driver)/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useMutation } from "@/hooks/useMutation";
import { userService } from "@/services/userService";
import Toast from "react-native-toast-message";

interface UserData {
  email: string;
  telefone?: string;
  placa?: string;
  veiculo?: string;
  cor_veiculo?: string;
  ano_veiculo?: string;
  numero_cnh?: string;
}

export default function SettingsScreen() {
  const [user, setUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData>({
    email: "",
    telefone: "",
    placa: "",
    veiculo: "",
    cor_veiculo: "",
    ano_veiculo: "",
    numero_cnh: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [mutateUpdateUser, isSaving] = useMutation(userService.updateUser);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const freshData = await userService.getUserProfile();
        if (freshData) {
          setUser(freshData);
          setFormData({
            email: freshData.email || "",
            telefone: freshData.telefone || "",
            placa: freshData.placa || "",
            veiculo: freshData.veiculo || "",
            cor_veiculo: freshData.cor_veiculo || "",
            ano_veiculo: freshData.ano_veiculo || "",
            numero_cnh: freshData.numero_cnh || "",
          });
        }
      } catch (error) {
        console.error("Error loading user data from API:", error);
        try {
          const userData = await AsyncStorage.getItem("user");
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              if (parsedUser) {
                setUser(parsedUser);
                setFormData({
                  email: parsedUser.email || "",
                  telefone: parsedUser.telefone || "",
                  placa: parsedUser.placa || "",
                  veiculo: parsedUser.veiculo || "",
                  cor_veiculo: parsedUser.cor_veiculo || "",
                  ano_veiculo: parsedUser.ano_veiculo || "",
                  numero_cnh: parsedUser.numero_cnh || "",
                });
              }
            } catch (parseError) {
              console.error("Error parsing user data:", parseError);
            }
          }
        } catch (storageError) {
          console.error("AsyncStorage error:", storageError);
        }
        showErrorToast("Erro ao carregar dados do usuário");
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const showSuccessToast = (message: string) => {
    Toast.show({
      type: "success",
      text1: "Sucesso",
      text2: message,
      visibilityTime: 3000,
    });
  };

  const showErrorToast = (message: string) => {
    Toast.show({
      type: "error",
      text1: "Erro",
      text2: message,
      visibilityTime: 3000,
    });
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatPhoneNumber = (text: string): string => {
    const cleaned = text.replace(/\D/g, "").slice(0, 11);
    const part1 = cleaned.slice(0, 2);
    const part2 = cleaned.slice(2, 7);
    const part3 = cleaned.slice(7, 11);

    if (cleaned.length <= 2) return `(${part1}`;
    if (cleaned.length <= 7) return `(${part1}) ${part2}`;
    return `(${part1}) ${part2}-${part3}`;
  };

  const validateForm = () => {
    if (
      !formData.email ||
      !formData.telefone ||
      !formData.placa ||
      !formData.veiculo ||
      !formData.cor_veiculo ||
      !formData.ano_veiculo ||
      !formData.numero_cnh
    ) {
      showErrorToast("Todos os campos são obrigatórios");
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    try {
      const dataToSend = {
        ...formData,
        telefone: formData.telefone?.replace(/\D/g, ""),
      };

      await mutateUpdateUser(dataToSend);

      showSuccessToast("Dados atualizados com sucesso!");
      setIsEditing(false);
    } catch (error) {
      console.error("Erro completo:", error);
      let errorMessage = "Falha ao atualizar dados";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      showErrorToast(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7d42" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Erro ao carregar perfil</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configurações do Motorista</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
          keyboardType="email-address"
          editable={isEditing}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={formData.telefone}
          onChangeText={(text) =>
            handleInputChange("telefone", formatPhoneNumber(text))
          }
          keyboardType="phone-pad"
          editable={isEditing}
          maxLength={15}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Placa do Veículo</Text>
        <TextInput
          style={styles.input}
          value={formData.placa}
          onChangeText={(text) =>
            handleInputChange("placa", text.toUpperCase())
          }
          editable={isEditing}
          maxLength={7}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Modelo do Veículo</Text>
        <TextInput
          style={styles.input}
          value={formData.veiculo}
          onChangeText={(text) => handleInputChange("veiculo", text)}
          editable={isEditing}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Cor do Veículo</Text>
        <TextInput
          style={styles.input}
          value={formData.cor_veiculo}
          onChangeText={(text) => handleInputChange("cor_veiculo", text)}
          editable={isEditing}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Ano do Veículo</Text>
        <TextInput
          style={styles.input}
          value={formData.ano_veiculo}
          onChangeText={(text) => handleInputChange("ano_veiculo", text)}
          keyboardType="numeric"
          editable={isEditing}
          maxLength={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Número da CNH</Text>
        <TextInput
          style={styles.input}
          value={formData.numero_cnh}
          onChangeText={(text) => handleInputChange("numero_cnh", text)}
          keyboardType="numeric"
          editable={isEditing}
        />
      </View>

      {!isEditing ? (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
            onPress={handleSaveChanges}
            disabled={isSaving}
          >
            <Text style={styles.buttonText}>
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setIsEditing(false);
              setFormData({
                email: user.email || "",
                telefone: user.telefone || "",
                placa: user.placa || "",
                veiculo: user.veiculo || "",
                cor_veiculo: user.cor_veiculo || "",
                ano_veiculo: user.ano_veiculo || "",
                numero_cnh: user.numero_cnh || "",
              });
            }}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      )}

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0a7d42",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  editButton: {
    backgroundColor: "#0a7d42",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#0a7d42",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
