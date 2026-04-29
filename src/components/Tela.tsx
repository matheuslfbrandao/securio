import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cores } from "../theme";
import { BackgroundCyber } from "./BackgroundCyber";

type Props = {
  children: ReactNode;
  style?: ViewStyle;
  semSafeArea?: boolean;
};

export function Tela({ children, style, semSafeArea = false }: Props) {
  const Container = semSafeArea ? View : SafeAreaView;
  return (
    <View style={estilos.fundo}>
      <BackgroundCyber />
      <Container style={[estilos.container, style]}>{children}</Container>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: cores.fundoEscuro,
    overflow: "hidden",
  },
  container: {
    flex: 1,
  },
});
