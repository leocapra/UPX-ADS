// RatingScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const RatingScreen = () => {
  const [rating, setRating] = useState(0);
  const router = useRouter();

  return (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingTitle}>Avalie sua corrida</Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={styles.star}>{star <= rating ? "★" : "☆"}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(student)")}
      >
        <Text style={styles.backButtonText}>Voltar ao início</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default RatingScreen;
