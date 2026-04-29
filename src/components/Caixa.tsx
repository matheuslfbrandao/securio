import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { cores, espacos, fontes, raios } from "../theme";

type Props = {
  marcado: boolean;
  aoMudar: (valor: boolean) => void;
  rotulo?: string;
  rotuloComponente?: React.ReactNode;
};

export function Caixa({ marcado, aoMudar, rotulo, rotuloComponente }: Props) {
  return (
    <Pressable
      onPress={() => aoMudar(!marcado)}
      style={({ pressed }) => [estilos.container, pressed && estilos.pressionado]}
    >
      <View style={[estilos.caixa, marcado && estilos.caixaMarcada]}>
        {marcado && (
          <Ionicons name="checkmark" size={16} color={cores.textoEscuro} />
        )}
      </View>
      {rotuloComponente ?? (rotulo && <Text style={estilos.rotulo}>{rotulo}</Text>)}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
  },
  caixa: {
    width: 22,
    height: 22,
    borderRadius: raios.pequeno / 2,
    borderWidth: 1.5,
    borderColor: cores.primaria,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  caixaMarcada: {
    backgroundColor: cores.primaria,
  },
  rotulo: {
    color: cores.texto,
    fontSize: fontes.base,
    flex: 1,
    fontWeight: "500",
  },
  pressionado: {
    opacity: 0.7,
  },
});
