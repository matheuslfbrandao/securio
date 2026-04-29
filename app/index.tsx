import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Logo } from "../src/components/Logo";
import { Tela } from "../src/components/Tela";
import { useAuth } from "../src/contexts/AuthContext";
import { cores, espacos, fontes, raios } from "../src/theme";
import { entradaNativa } from "../src/utils/anim";

export default function WelcomeScreen() {
  const router = useRouter();
  const { usuario, carregando } = useAuth();

  const escala = useSharedValue(0.9);

  useEffect(() => {
    escala.value = withSequence(
      withTiming(1.04, { duration: 700, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
    );
  }, []);

  const estiloLogo = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  function continuar() {
    if (usuario) {
      router.replace("/(app)/home");
    } else {
      router.replace("/(auth)/login");
    }
  }

  if (carregando) {
    return (
      <Tela>
        <View style={estilos.centro}>
          <ActivityIndicator size="large" color={cores.primaria} />
        </View>
      </Tela>
    );
  }

  return (
    <Tela>
      <View style={estilos.container}>
        <View style={estilos.topo}>
          <Animated.View entering={entradaNativa(FadeIn.duration(700))} style={estilos.logoWrap}>
            <Animated.View style={estiloLogo}>
              <Logo tamanho="grande" />
            </Animated.View>
          </Animated.View>

          <Animated.Text
            entering={entradaNativa(FadeInUp.duration(500).delay(400))}
            style={estilos.tagline}
          >
            Conscientização em Cibersegurança
          </Animated.Text>

          <Animated.Text
            entering={entradaNativa(FadeInUp.duration(500).delay(550))}
            style={estilos.descricao}
          >
            Aprenda boas práticas de segurança digital com quizzes diários.
            Compita no ranking, conquiste prêmios e proteja-se dos golpes online.
          </Animated.Text>
        </View>

        <Animated.View
          entering={entradaNativa(FadeInUp.duration(500).delay(800))}
          style={estilos.creditos}
        >
          <View style={estilos.divisor} />

          <View style={estilos.creditoLinha}>
            <Ionicons name="person-circle" size={18} color={cores.primaria} />
            <Text style={estilos.creditoTexto}>
              Desenvolvido por{" "}
              <Text style={estilos.creditoDestaque}>Matheus Brandão</Text>
            </Text>
          </View>

          <View style={estilos.creditoLinha}>
            <Ionicons name="school" size={18} color={cores.primaria} />
            <Text style={estilos.creditoTexto}>
              MVP do Trabalho de Conclusão de Curso
            </Text>
          </View>

          <Text style={estilos.creditoCurso}>
            Bacharelado em Sistemas de Informação · UFVJM
          </Text>
        </Animated.View>

        <Animated.View
          entering={entradaNativa(FadeInUp.duration(500).delay(1000))}
          style={estilos.acaoWrap}
        >
          <Pressable
            onPress={continuar}
            style={({ pressed }) => [
              estilos.botao,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Text style={estilos.botaoTexto}>
              {usuario ? "Continuar" : "Começar agora"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color={cores.fundo} />
          </Pressable>

          {usuario && (
            <Text style={estilos.subBotao}>
              Logado como{" "}
              <Text style={{ color: cores.primaria, fontWeight: "700" }}>
                {usuario.displayName ?? usuario.email}
              </Text>
            </Text>
          )}
        </Animated.View>
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: espacos.xl,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  topo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: espacos.md,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: espacos.md,
  },
  tagline: {
    fontSize: fontes.media,
    color: cores.primaria,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: espacos.lg,
    textAlign: "center",
  },
  descricao: {
    fontSize: fontes.base,
    color: cores.textoSecundario,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 400,
  },
  creditos: {
    gap: espacos.xs,
    paddingVertical: espacos.lg,
  },
  divisor: {
    height: 1,
    backgroundColor: cores.borda,
    marginBottom: espacos.md,
    opacity: 0.6,
  },
  creditoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
    justifyContent: "center",
  },
  creditoTexto: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
  },
  creditoDestaque: {
    color: cores.texto,
    fontWeight: "700",
  },
  creditoCurso: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    textAlign: "center",
    marginTop: 2,
    fontStyle: "italic",
    letterSpacing: 0.3,
  },
  acaoWrap: {
    alignItems: "center",
    gap: espacos.sm,
    paddingBottom: espacos.lg,
  },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espacos.sm,
    backgroundColor: cores.primaria,
    paddingHorizontal: espacos.xl,
    paddingVertical: 16,
    borderRadius: raios.pill,
    minWidth: 240,
    shadowColor: cores.primaria,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 10,
  },
  botaoTexto: {
    color: cores.fundo,
    fontSize: fontes.media,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subBotao: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
  },
});
