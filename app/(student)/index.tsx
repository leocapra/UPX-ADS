import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router"; // Importa o hook useRouter

import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Linking,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

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
  const [isLoading, setIsLoading] = useState(false);
  const progress = useState(new Animated.Value(0))[0];

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

  const startLoadingAnimation = () => {
    setIsLoading(true);
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setIsLoading(false);
      progress.setValue(0);
      setIsRiding(!isRiding);
      if (isRiding) {
        router.push("/(student)/RatingScreen"); // Usando router.push para navegar
      }
    });
  };

  const handlePressIn = () => {
    startLoadingAnimation();
  };

  const handlePressOut = () => {
    if (isLoading) {
      Animated.timing(progress, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).stop();
      setIsLoading(false);
      progress.setValue(0);
    }
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

          <TouchableOpacity
            style={[styles.confirmButton, isRiding && styles.finishButton]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
            ) : (
              <Text style={styles.confirmButtonText}>
                {isRiding ? "Finalizar corrida" : "Embarcar"}
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 50 : 0,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    color: "#0a7d42",
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  suggestion: {
    padding: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  mapButton: {
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  mapButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#0a7d42",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    overflow: "hidden",
  },
  finishButton: {
    backgroundColor: "#d9534f",
  },
  loadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  ratingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  ratingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 40,
  },
  star: {
    fontSize: 40,
    color: "#FFD700",
    marginHorizontal: 5,
  },
  backButton: {
    backgroundColor: "#0a7d42",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
