import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@/hooks/useMutation";
import { rideService } from "@/services/rideService";
import axios from "axios";
import {
  Text,
  TextInput,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";
import { greenTheme } from "../AppTheme";
import Toast from "react-native-toast-message";

interface LocationType {
  latitude: number;
  longitude: number;
}

interface SuggestionType {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

function StudentHomeScreen() {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [destination, setDestination] = useState<SuggestionType | null>(null);
  const [rideRequested, setRideRequested] = useState(false);

  const [mutateCreateRide, createRideLoading] = useMutation(
    rideService.createRide
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permissão de localização negada");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: search,
              format: "json",
              addressdetails: 1,
              limit: 5,
            },
          }
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
      }
    };

    const delay = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(delay);
  }, [search]);

  const getGoogleMapsUrl = () => {
    if (!currentLocation || !destination) return null;
    return `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${destination.lat},${destination.lon}`;
  };

  const handleOpenMaps = () => {
    const url = getGoogleMapsUrl();
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("Erro ao abrir mapa:", err)
      );
    }
  };

  const handleSolicitarCorrida = async () => {
    if (!currentLocation || !destination) return;

    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) throw new Error("Usuário não encontrado");

      const user = JSON.parse(storedUser);

      const payload = {
        client_id: user.id,
        active: true,
        accept: false,
        rating: null,
        driver_id: null,
        origem: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        destino: {
          latitude: destination.lat,
          longitude: destination.lon,
          nome: destination.display_name,
        },
      };

      await mutateCreateRide(payload);
      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Corrida solicitada com sucesso!",
      });
      setRideRequested(true);
    } catch (err) {
      console.error("Erro ao solicitar corrida:", err);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível solicitar a corrida",
      });
    }
  };

  const handleFinalizarCorrida = () => {
    Toast.show({
      type: "success",
      text1: "Corrida finalizada",
      text2: "Obrigado por usar nosso serviço!",
    });
    setRideRequested(false);
    setDestination(null);
    setSearch("");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Para onde vamos?
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              mode="outlined"
              label="Destino"
              placeholder="Digite seu destino"
              value={search}
              onChangeText={setSearch}
              style={styles.input}
              left={<TextInput.Icon icon="map-marker" />}
              outlineColor="rgba(10, 125, 66, 0.2)"
              activeOutlineColor="#0a7d42"
            />
          </View>

          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => {
                    setDestination(item);
                    setSearch(item.display_name);
                    setSuggestions([]);
                  }}
                >
                  <Text style={styles.suggestionText}>{item.display_name}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
          )}

          {destination && (
            <View style={styles.buttonsContainer}>
              <Button
                mode="outlined"
                onPress={handleOpenMaps}
                style={styles.mapButton}
                icon="map"
                textColor="#0a7d42"
              >
                Ver rota no Google Maps
              </Button>

              {!rideRequested ? (
                <Button
                  mode="contained"
                  onPress={handleSolicitarCorrida}
                  loading={createRideLoading}
                  disabled={createRideLoading}
                  style={styles.confirmButton}
                  labelStyle={styles.buttonText}
                  icon="car"
                >
                  {createRideLoading ? "Solicitando..." : "Solicitar Corrida"}
                </Button>
              ) : (
                <Button
                  mode="contained"
                  onPress={handleFinalizarCorrida}
                  style={[styles.confirmButton, styles.finishButton]}
                  labelStyle={styles.buttonText}
                  icon="check"
                >
                  Finalizar Corrida
                </Button>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <Toast />
    </View>
  );
}

export default function StudentHome() {
  return (
    <PaperProvider theme={greenTheme}>
      <StudentHomeScreen />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginVertical: 24,
    color: "#0a7d42",
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#ffffff",
  },
  suggestionsList: {
    maxHeight: 200,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  suggestionText: {
    color: "#333333",
  },
  buttonsContainer: {
    marginTop: 24,
  },
  mapButton: {
    marginBottom: 16,
    borderColor: "#0a7d42",
  },
  confirmButton: {
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#0a7d42",
  },
  finishButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
