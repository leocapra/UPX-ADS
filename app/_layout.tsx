import { Stack } from "expo-router";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <>
      <Stack
        screenOptions={{
          animation: Platform.OS === "android" ? "slide_from_right" : "default",
          headerShown: false,
        }}
      />
      <Toast />
    </>
  );
}
