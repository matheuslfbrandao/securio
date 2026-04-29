import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";

export default function AuthLayout() {
  const { usuario, carregando } = useAuth();

  if (carregando) return null;
  if (usuario) return <Redirect href="/(app)/home" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 220,
      }}
    />
  );
}
