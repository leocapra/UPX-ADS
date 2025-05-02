import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useMutation } from "@/hooks/useMutation";
import { userService } from "@/services/userService";
import Toast from "react-native-toast-message";

const avatarImages = [
  { id: 1, image: require("../../assets/images/avatar-01.png") },
  { id: 2, image: require("../../assets/images/avatar-02.jpeg") },
  { id: 3, image: require("../../assets/images/avatar-03.png") },
  { id: 4, image: require("../../assets/images/avatar-04.png") },
  { id: 5, image: require("../../assets/images/avatar-05.png") },
  { id: 6, image: require("../../assets/images/avatar-06.png") },
  { id: 7, image: require("../../assets/images/avatar-07.png") },
];
export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [savedIndex, setSavedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [mutateAvatar, isSaving] = useMutation(userService.updateAvatar);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const [userData, savedAvatarIndex] = await Promise.all([
          AsyncStorage.getItem("user"),
          AsyncStorage.getItem("avatarIndex"),
        ]);

        if (userData) setUser(JSON.parse(userData));
        if (savedAvatarIndex) {
          const index = parseInt(savedAvatarIndex, 10);
          const clampedIndex = Math.min(Math.max(index, 0), 6);
          setAvatarIndex(clampedIndex);
          setSavedIndex(clampedIndex);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
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

  const handleSelectAvatar = (index: number) => {
    if (index < 0 || index >= avatarImages.length) return;

    setAvatarIndex(index);
    setIsDirty(index !== savedIndex);
  };

  const handleSaveAvatar = async () => {
    try {
      await mutateAvatar({ avatar_id: avatarIndex + 1 });

      await AsyncStorage.setItem("avatarIndex", avatarIndex.toString());
      setSavedIndex(avatarIndex);
      setIsDirty(false);
      showSuccessToast("Avatar atualizado com sucesso!");
    } catch (error) {
      showErrorToast("Falha ao atualizar avatar");
      console.error("Error saving avatar:", error);
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
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <Image source={avatarImages[avatarIndex].image} style={styles.avatar} />

      <Text style={styles.label}>Nome: {user.nome}</Text>
      <Text style={styles.label}>Email: {user.email}</Text>
      <Text style={styles.label}>
        Tipo: {user.role_id === 3 ? "Motorista" : "Estudante"}
      </Text>

      <Text style={styles.subTitle}>Escolher avatar:</Text>
      <FlatList
        data={avatarImages}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.avatarList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleSelectAvatar(index)}
            activeOpacity={0.7}
          >
            <Image
              source={item.image}
              style={[
                styles.avatarOption,
                index === avatarIndex && styles.avatarSelected,
              ]}
            />
          </TouchableOpacity>
        )}
      />

      {isDirty && (
        <TouchableOpacity
          style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
          onPress={handleSaveAvatar}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Text>
        </TouchableOpacity>
      )}

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 10,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    marginVertical: 4,
    color: "#333",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    marginVertical: 16,
    borderWidth: 3,
    borderColor: "#0a7d42",
  },
  avatarList: {
    paddingHorizontal: 10,
  },
  avatarOption: {
    width: 70,
    height: 70,
    marginHorizontal: 8,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarSelected: {
    borderColor: "#0a7d42",
    transform: [{ scale: 1.1 }],
  },
  saveButton: {
    backgroundColor: "#0a7d42",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
