import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/contexts/AuthContext";
import { PerfilProvider } from "../src/contexts/PerfilContext";
import { cores } from "../src/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PerfilProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
              animationDuration: 250,
              contentStyle: { backgroundColor: cores.fundoEscuro },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </PerfilProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
