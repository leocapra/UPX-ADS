import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@/hooks/useMutation";
import { rideService } from "@/services/rideService";
import axios from "axios";
import { styles } from "./indexStyle";

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

export default function StudentHome() {
  const router = useRouter();

  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [destination, setDestination] = useState<SuggestionType | null>(null);
  const [isRiding, setIsRiding] = useState(false);
  const [rideRequested, setRideRequested] = useState(false); // New state to track if ride was requested

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
      console.log("Corrida solicitada com sucesso!");
      setIsRiding(true);
      setRideRequested(true);
    } catch (err) {
      console.error("Erro ao solicitar corrida:", err);
    }
  };

  const handleFinalizarCorrida = () => {
    console.log("Corrida finalizada");
    setIsRiding(false);
    setRideRequested(false);
    setDestination(null);
    setSearch("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Para onde vamos?</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o destino"
        value={search}
        onChangeText={setSearch}
      />

      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setDestination(item);
                setSearch(item.display_name);
                setSuggestions([]);
              }}
            >
              <Text style={styles.suggestion}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {destination && (
        <>
          <TouchableOpacity style={styles.mapButton} onPress={handleOpenMaps}>
            <Text style={styles.mapButtonText}>Ver rota no Google Maps</Text>
          </TouchableOpacity>

          {!rideRequested ? (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleSolicitarCorrida}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>Solicitar Corrida</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.confirmButton, styles.finishButton]}
              onPress={handleFinalizarCorrida}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>Finalizar Corrida</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}
