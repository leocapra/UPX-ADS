import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "@/services/socket";
import { Text, Button, Provider as PaperProvider } from "react-native-paper";
import { greenTheme } from "../AppTheme";
import Toast from "react-native-toast-message";
import { useQuery } from "@/hooks/useQuery";
import { rideService } from "@/services/rideService";

interface RideData {
  rideId: string;
  clientName: string;
  origem: {
    latitude: number;
    longitude: number;
  };
  destino: {
    latitude: string;
    longitude: string;
    nome: string;
  };
}

function DriverHomeScreen() {
  const [userName, setUserName] = useState("Motorista");
  const [rides, setRides] = useState<RideData[]>([]);

  const [corridas, corridasError, refetchCorridas, isCorridasLoading] =
    useQuery(() => rideService.getRide(), []);

  console.log("corridas,", corridas?.data);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.nome) {
            setUserName(parsedUser.nome);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar nome:", error);
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    if (corridas?.data?.length) {
      const mappedRides: RideData[] = corridas?.data?.map((item: any) => ({
        rideId: item?.id,
        clientName: item?.nome,
        origem: {
          latitude: item?.origem?.latitude,
          longitude: item?.origem?.longitude,
        },
        destino: {
          latitude: item?.destino?.latitude,
          longitude: item?.destino?.longitude,
          nome: item?.destino?.nome,
        },
      }));

      setRides(mappedRides);
    }
  }, [corridas]);

  useEffect(() => {
    socket.on("new_ride", (rideData: RideData) => {
      const alreadyExists = rides.some((ride) => ride.rideId === rideData.rideId);
      if (!alreadyExists) {
        setRides((prevRides) => [...prevRides, rideData])
      }

      Toast.show({
        type: "success",
        text1: "Nova corrida solicitada",
        text2: `De ${rideData.clientName} para ${rideData.destino.nome}`,
      });
    });

    return () => {
      socket.off("new_ride");
    };
  }, [rides]);

  const renderRide = ({ item }: { item: RideData }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideInfo}>
        <Text variant="bodyLarge" style={styles.clientName}>
          {item.clientName}
        </Text>
        <Text variant="bodyMedium" style={styles.destText}>
          Destino: {item.destino.nome}
        </Text>
      </View>
      <Button
        mode="contained"
        style={styles.acceptButton}
        labelStyle={styles.acceptText}
      >
        Aceitar
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      {rides.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="headlineMedium" style={styles.welcomeText}>
            Olá, {userName}!
          </Text>
          <Text variant="bodyLarge" style={styles.instructionText}>
            Bem-vindo ao BoraUni
          </Text>
          <Text variant="bodyMedium" style={styles.instructionText}>
            Aguarde solicitações de corrida
          </Text>
          <Image
            source={require("@/assets/images/cafe.png")}
            style={styles.coffeeImage}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#0a7d42" />
        </View>
      ) : (
        <>
          <Text variant="headlineMedium" style={styles.welcomeText}>
            Corridas Disponíveis
          </Text>
          <FlatList
            data={rides}
            keyExtractor={(item) => item.rideId}
            renderItem={renderRide}
            contentContainerStyle={styles.ridesList}
          />
        </>
      )}
      <Toast />
    </View>
  );
}

export default function DriverHome() {
  return (
    <PaperProvider theme={greenTheme}>
      <DriverHomeScreen />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    textAlign: "center",
    color: "#0a7d42",
    fontWeight: "bold",
    marginBottom: 8,
  },
  instructionText: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 24,
  },
  coffeeImage: {
    width: 150,
    height: 150,
    marginBottom: 32,
  },
  ridesList: {
    paddingBottom: 24,
  },
  rideCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  rideInfo: {
    flex: 1,
  },
  clientName: {
    color: "#0a7d42",
    fontWeight: "bold",
  },
  destText: {
    color: "#333333",
    marginTop: 4,
  },
  acceptButton: {
    marginLeft: 16,
    borderRadius: 8,
    backgroundColor: "#0a7d42",
  },
  acceptText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
