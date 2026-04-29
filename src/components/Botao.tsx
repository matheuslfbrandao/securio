import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { cores, espacos, fontes, raios } from "../theme";

type Variante = "primario" | "secundario" | "fantasma";

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  carregando?: boolean;
  desabilitado?: boolean;
  style?: ViewStyle;
};

export function Botao({
  titulo,
  onPress,
  variante = "primario",
  carregando = false,
  desabilitado = false,
  style,
}: Props) {
  const inativo = carregando || desabilitado;
  const fundo =
    variante === "primario"
      ? estilos.primario
      : variante === "secundario"
      ? estilos.secundario
      : estilos.fantasma;
  const texto =
    variante === "primario" ? estilos.textoPrimario : estilos.textoSecundario;

  return (
    <Pressable
      onPress={inativo ? undefined : onPress}
      style={({ pressed }) => [
        estilos.base,
        fundo,
        pressed && !inativo && estilos.pressionado,
        inativo && estilos.desabilitado,
        style,
      ]}
    >
      {carregando ? (
        <ActivityIndicator
          color={variante === "primario" ? cores.textoEscuro : cores.primaria}
        />
      ) : (
        <Text style={texto}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: raios.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espacos.xl,
  },
  primario: {
    backgroundColor: cores.primaria,
    shadowColor: cores.primaria,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  secundario: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: cores.primaria,
  },
  fantasma: {
    backgroundColor: "transparent",
  },
  pressionado: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  desabilitado: {
    opacity: 0.4,
  },
  textoPrimario: {
    color: cores.textoEscuro,
    fontSize: fontes.media,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  textoSecundario: {
    color: cores.primaria,
    fontSize: fontes.media,
    fontWeight: "600",
  },
});
