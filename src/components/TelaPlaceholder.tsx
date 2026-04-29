import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { cores, espacos, fontes, raios } from "../theme";
import { Cabecalho } from "./Cabecalho";
import { Tela } from "./Tela";

type Props = {
  titulo: string;
  icone: keyof typeof import("@expo/vector-icons/build/Ionicons").default.glyphMap;
  descricao: string;
  fase: string;
  comVoltar?: boolean;
};

export function TelaPlaceholder({
  titulo,
  icone,
  descricao,
  fase,
  comVoltar = false,
}: Props) {
  const router = useRouter();

  return (
    <Tela>
      <Cabecalho />

      <View style={estilos.conteudo}>
        {comVoltar && (
          <Pressable
            onPress={() => router.back()}
            style={estilos.voltar}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={24} color={cores.texto} />
            <Text style={estilos.voltarTexto}>Voltar</Text>
          </Pressable>
        )}

        <View style={estilos.iconeWrap}>
          <Ionicons name={icone} size={72} color={cores.primaria} />
        </View>

        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.descricao}>{descricao}</Text>

        <View style={estilos.tag}>
          <Ionicons name="construct-outline" size={16} color={cores.aviso} />
          <Text style={estilos.tagTexto}>Em construção • {fase}</Text>
        </View>
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  conteudo: {
    flex: 1,
    padding: espacos.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: espacos.md,
  },
  voltar: {
    position: "absolute",
    top: espacos.md,
    left: espacos.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  voltarTexto: {
    color: cores.texto,
    fontSize: fontes.base,
    fontWeight: "600",
  },
  iconeWrap: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: cores.primariaFraca,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: espacos.md,
  },
  titulo: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
  },
  descricao: {
    color: cores.textoSecundario,
    fontSize: fontes.media,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.xs,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.aviso,
    borderRadius: raios.pill,
    paddingHorizontal: espacos.md,
    paddingVertical: 6,
    marginTop: espacos.md,
  },
  tagTexto: {
    color: cores.aviso,
    fontSize: fontes.pequena,
    fontWeight: "600",
  },
});
