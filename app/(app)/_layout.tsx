import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { cores, fontes } from "../../src/theme";

export default function AppLayout() {
  const { usuario, carregando } = useAuth();

  if (carregando) return null;
  if (!usuario) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: cores.fundoEscuro,
          borderTopColor: cores.borda,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 90 : 70,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 30 : 12,
        },
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarLabelStyle: {
          fontSize: fontes.pequena,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: "Quiz",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bulb" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: "Ranking",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="premiacoes"
        options={{
          title: "Premiações",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ribbon" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="dicas" options={{ href: null }} />
      <Tabs.Screen name="parceiro" options={{ href: null }} />
      <Tabs.Screen name="admin" options={{ href: null }} />
      <Tabs.Screen name="usuario" options={{ href: null }} />
    </Tabs>
  );
}
