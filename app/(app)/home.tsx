import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Cabecalho } from "../../src/components/Cabecalho";
import { Tela } from "../../src/components/Tela";
import { cores, espacos, fontes, raios } from "../../src/theme";
import { entradaNativa } from "../../src/utils/anim";

type Atalho = {
  titulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  rota: string;
};

const ATALHOS: Atalho[] = [
  { titulo: "Quiz", icone: "bulb-outline", rota: "/(app)/quiz" },
  { titulo: "Ranking", icone: "trophy-outline", rota: "/(app)/ranking" },
  {
    titulo: "Dicas de\nSegurança",
    icone: "shield-outline",
    rota: "/(app)/dicas",
  },
  {
    titulo: "Premiações",
    icone: "ribbon-outline",
    rota: "/(app)/premiacoes",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <Tela>
      <Cabecalho />

      <ScrollView contentContainerStyle={estilos.scroll}>
        <Animated.View entering={entradaNativa(FadeInDown.duration(260))}>
          <Pressable
            onPress={() => router.push("/(app)/parceiro")}
            style={({ pressed }) => [
              estilos.banner,
              pressed && estilos.bannerPressionado,
            ]}
          >
            <View style={estilos.bannerEsquerda}>
              <View style={estilos.bannerIcone}>
                <Ionicons name="person" size={22} color={cores.primaria} />
              </View>
              <View style={estilos.bannerTextos}>
                <Text style={estilos.bannerLinha1}>Anuncie sua empresa aqui!</Text>
                <Text style={estilos.bannerLinha2}>Seja um parceiro</Text>
              </View>
            </View>
            <Ionicons name="arrow-forward" size={22} color={cores.primaria} />
          </Pressable>
        </Animated.View>

        <View style={estilos.grade}>
          {ATALHOS.map((a, i) => (
            <Animated.View
              key={a.titulo}
              entering={entradaNativa(FadeInUp.duration(280).delay(80 + i * 60))}
              style={estilos.cardWrap}
            >
              <Pressable
                onPress={() => router.push(a.rota as any)}
                style={({ pressed }) => [
                  estilos.card,
                  pressed && estilos.cardPressionado,
                ]}
              >
                <View style={estilos.cardIcone}>
                  <Ionicons name={a.icone} size={36} color={cores.primaria} />
                </View>
                <Text style={estilos.cardTitulo}>{a.titulo}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  scroll: {
    padding: espacos.lg,
    paddingTop: espacos.sm,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: cores.superficie,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    borderRadius: raios.medio,
    padding: espacos.md,
    marginBottom: espacos.xl,
  },
  bannerPressionado: {
    opacity: 0.7,
  },
  bannerEsquerda: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.md,
    flex: 1,
  },
  bannerIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.primariaFraca,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTextos: {
    flex: 1,
  },
  bannerLinha1: {
    color: cores.texto,
    fontSize: fontes.media,
    fontWeight: "700",
  },
  bannerLinha2: {
    color: cores.texto,
    fontSize: fontes.media,
    fontWeight: "700",
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacos.md,
    justifyContent: "space-between",
  },
  cardWrap: {
    width: "47%",
  },
  card: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.lg,
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: espacos.md,
    shadowColor: cores.primaria,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4,
  },
  cardPressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
    shadowOpacity: 0.5,
    borderColor: cores.primaria,
  },
  cardIcone: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: cores.primariaFraca,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
  },
  cardTitulo: {
    color: cores.texto,
    fontSize: fontes.media,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});
