import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { usePerfil } from "../contexts/PerfilContext";
import { cores, espacos, fontes } from "../theme";
import { Avatar } from "./Avatar";
import { Logo } from "./Logo";

export function Cabecalho() {
  const router = useRouter();
  const { perfil } = usePerfil();

  const nickname = perfil?.nickname ?? "...";
  const pontos = perfil?.pontosTotais ?? 0;
  const avatarUrl = perfil?.avatarUrl;

  return (
    <View style={estilos.container}>
      <Logo tamanho="pequeno" />
      <Pressable
        onPress={() => router.push("/(app)/perfil")}
        style={estilos.perfil}
      >
        <Avatar url={avatarUrl} tamanho={40} />
        <View>
          <Text style={estilos.nickname} numberOfLines={1}>
            {nickname}
          </Text>
          <View style={estilos.linhaPontos}>
            <View style={estilos.pontoIndicador} />
            <Text style={estilos.pontos}>{pontos} pts</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: espacos.lg,
    paddingVertical: espacos.md,
  },
  perfil: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
    maxWidth: 180,
  },
  nickname: {
    color: cores.texto,
    fontSize: fontes.base,
    fontWeight: "600",
  },
  linhaPontos: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pontoIndicador: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: cores.primaria,
  },
  pontos: {
    color: cores.primaria,
    fontSize: fontes.pequena,
    fontWeight: "600",
  },
});
