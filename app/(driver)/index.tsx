import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "@/services/socket";
import Toast from "react-native-toast-message";

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

export default function DriverHome() {
  const [userName, setUserName] = useState("Motorista");
  const [rides, setRides] = useState<RideData[]>([]);

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
    socket.on("new_ride", (rideData: RideData) => {
      console.log("🚗 Nova corrida recebida:", rideData);
      setRides((prevRides) => [...prevRides, rideData]);

      // Toast simples
      Toast.show({
        type: "success",
        text1: "Nova corrida solicitada",
        text2: `De ${rideData.clientName} para ${rideData.destino.nome}`,
      });
    });

    return () => {
      socket.off("new_ride");
    };
  }, []);

  const renderRide = ({ item }: { item: RideData }) => (
    <View style={styles.rideCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.clientName}>{item.clientName}</Text>
        <Text style={styles.destText}>Destino: {item.destino.nome}</Text>
      </View>
      <TouchableOpacity style={styles.acceptButton}>
        <Text style={styles.acceptText}>Aceitar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {rides.length === 0 ? (
        <>
          <Text style={styles.welcomeText}>
            Olá, {userName}! Seja bem-vindo ao BoraUni.
          </Text>
          <Text style={styles.instructionText}>
            Por favor, aguarde algum estudante fazer a solicitação de corrida.
            Enquanto isso, tome um café :)
          </Text>
          <Image
            source={require("@/assets/images/cafe.png")}
            style={styles.coffeeImage}
            resizeMode="contain"
          />
          <ActivityIndicator
            size="large"
            color="#0a7d42"
            style={{ marginTop: 20 }}
          />
        </>
      ) : (
        <>
          <Text style={styles.welcomeText}>Corridas Disponíveis</Text>
          <FlatList
            data={rides}
            keyExtractor={(item) => item.rideId}
            renderItem={renderRide}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </>
      )}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  welcomeText: {
    fontSize: 22,
    color: "#0a7d42",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  coffeeImage: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 30,
  },
  rideCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    marginBottom: 10,
  },
  clientName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0a7d42",
  },
  destText: {
    fontWeight: "600",
    marginTop: 4,
  },
  acceptButton: {
    backgroundColor: "#0a7d42",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  acceptText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
