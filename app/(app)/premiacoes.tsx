import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Cabecalho } from "../../src/components/Cabecalho";
import { Tela } from "../../src/components/Tela";
import { listarPremiacoes, Premiacao } from "../../src/services/premiacoes";
import { cores, espacos, fontes, raios } from "../../src/theme";
import { entradaNativa } from "../../src/utils/anim";

type Estado =
  | { tipo: "carregando" }
  | { tipo: "erro" }
  | { tipo: "ok"; andamento: Premiacao[]; concluidas: Premiacao[] };

export default function Premiacoes() {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });

  const carregar = useCallback(async () => {
    try {
      const r = await listarPremiacoes();
      setEstado({ tipo: "ok", andamento: r.andamento, concluidas: r.concluidas });
    } catch {
      setEstado({ tipo: "erro" });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return (
    <Tela>
      <Cabecalho />

      <ScrollView contentContainerStyle={estilos.scroll}>
        <Animated.View entering={entradaNativa(FadeIn.duration(220))}>
          <Text style={estilos.titulo}>Premiações</Text>
          <Text style={estilos.subtitulo}>
            Conquiste pontos no quiz e concorra a prêmios oferecidos por nossos
            patrocinadores.
          </Text>
        </Animated.View>

        {estado.tipo === "carregando" && (
          <View style={estilos.centro}>
            <ActivityIndicator size="large" color={cores.primaria} />
          </View>
        )}

        {estado.tipo === "erro" && (
          <View style={estilos.centro}>
            <Text style={estilos.vazio}>Erro ao carregar premiações.</Text>
          </View>
        )}

        {estado.tipo === "ok" && (
          <>
            {estado.andamento.length === 0 && estado.concluidas.length === 0 ? (
              <Animated.View
                entering={entradaNativa(FadeInUp.duration(280))}
                style={estilos.cartaoVazio}
              >
                <Ionicons name="ribbon-outline" size={56} color={cores.primaria} />
                <Text style={estilos.cartaoVazioTitulo}>
                  Nenhuma premiação ainda
                </Text>
                <Text style={estilos.cartaoVazioTexto}>
                  Em breve patrocinadores oferecerão prêmios incríveis. Continue
                  acumulando pontos!
                </Text>
              </Animated.View>
            ) : null}

            {estado.andamento.length > 0 && (
              <>
                <Text style={estilos.secao}>Em andamento</Text>
                {estado.andamento.map((p, i) => (
                  <Animated.View
                    key={p.id}
                    entering={entradaNativa(FadeInUp.duration(280).delay(60 + i * 80))}
                  >
                    <CardAndamento premiacao={p} />
                  </Animated.View>
                ))}
              </>
            )}

            {estado.concluidas.length > 0 && (
              <>
                <Text style={estilos.secao}>Concluídas</Text>
                {estado.concluidas.map((p, i) => (
                  <Animated.View
                    key={p.id}
                    entering={entradaNativa(FadeInUp.duration(280).delay(60 + i * 80))}
                  >
                    <CardConcluida premiacao={p} />
                  </Animated.View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </Tela>
  );
}

function CardAndamento({ premiacao }: { premiacao: Premiacao }) {
  const [agora, setAgora] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const fim = premiacao.prazo.toMillis();
  const restante = fim - agora;
  const expirou = restante <= 0;

  return (
    <View style={[estilos.cartao, estilos.cartaoAndamento]}>
      <View style={estilos.cabecalhoCartao}>
        <View style={estilos.tagAndamento}>
          <View style={estilos.dotAndamento} />
          <Text style={estilos.tagAndamentoTexto}>EM ANDAMENTO</Text>
        </View>
        <Text style={estilos.patrocinador}>{premiacao.patrocinador}</Text>
      </View>

      <Text style={estilos.tituloPremio}>{premiacao.titulo}</Text>

      <View style={estilos.linhaPremio}>
        <Ionicons name="gift" size={18} color={cores.primaria} />
        <Text style={estilos.premio}>{premiacao.premio}</Text>
      </View>

      {premiacao.descricao ? (
        <Text style={estilos.descricao}>{premiacao.descricao}</Text>
      ) : null}

      <View style={estilos.rodape}>
        <Ionicons
          name={expirou ? "time" : "hourglass-outline"}
          size={16}
          color={expirou ? cores.erro : cores.textoSecundario}
        />
        <Text
          style={[
            estilos.rodapeTexto,
            expirou && { color: cores.erro },
          ]}
        >
          {expirou
            ? "Encerrada — aguardando vencedores"
            : `Termina em ${formatarRestante(restante)}`}
        </Text>
      </View>
    </View>
  );
}

function CardConcluida({ premiacao }: { premiacao: Premiacao }) {
  const router = useRouter();
  const vencedores = premiacao.vencedores ?? [];
  const vencedoresUids = premiacao.vencedoresUids ?? [];

  return (
    <View style={[estilos.cartao, estilos.cartaoConcluida]}>
      <View style={estilos.cabecalhoCartao}>
        <View style={estilos.tagConcluida}>
          <Ionicons name="checkmark-circle" size={14} color={cores.fundo} />
          <Text style={estilos.tagConcluidaTexto}>CONCLUÍDA</Text>
        </View>
        <Text style={estilos.patrocinador}>{premiacao.patrocinador}</Text>
      </View>

      <Text style={estilos.tituloPremio}>{premiacao.titulo}</Text>

      <View style={estilos.linhaPremio}>
        <Ionicons name="gift" size={18} color={cores.primaria} />
        <Text style={estilos.premio}>{premiacao.premio}</Text>
      </View>

      <Text style={estilos.subSecao}>
        Vencedores ({vencedores.length})
      </Text>

      {vencedores.length === 0 ? (
        <Text style={estilos.descricao}>Sem vencedores cadastrados.</Text>
      ) : (
        <View style={estilos.gridVencedores}>
          {vencedores.map((nick, i) => {
            const uid = vencedoresUids[i];
            const Wrapper: any = uid ? Pressable : View;
            return (
              <Wrapper
                key={`${nick}-${i}`}
                onPress={
                  uid
                    ? () =>
                        router.push({
                          pathname: "/(app)/usuario/[uid]",
                          params: { uid },
                        })
                    : undefined
                }
                style={estilos.chipVencedor}
              >
                <Ionicons
                  name="trophy"
                  size={14}
                  color={cores.primaria}
                />
                <Text style={estilos.chipVencedorTexto}>{nick}</Text>
              </Wrapper>
            );
          })}
        </View>
      )}
    </View>
  );
}

function formatarRestante(ms: number): string {
  const dias = Math.floor(ms / (1000 * 60 * 60 * 24));
  const horas = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (dias > 0) return `${dias}d ${horas}h`;
  if (horas > 0) return `${horas}h`;
  const minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${minutos}min`;
}

const estilos = StyleSheet.create({
  scroll: {
    padding: espacos.lg,
    paddingBottom: espacos.xxl,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  centro: {
    paddingVertical: espacos.xxl,
    alignItems: "center",
  },
  vazio: {
    color: cores.textoSecundario,
    fontSize: fontes.media,
    textAlign: "center",
  },
  titulo: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    lineHeight: 20,
    marginTop: espacos.xs,
    marginBottom: espacos.lg,
  },
  secao: {
    color: cores.primaria,
    fontSize: fontes.pequena,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: espacos.md,
    marginBottom: espacos.sm,
  },
  cartaoVazio: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.xl,
    alignItems: "center",
    gap: espacos.sm,
  },
  cartaoVazioTitulo: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
    marginTop: espacos.sm,
  },
  cartaoVazioTexto: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    textAlign: "center",
    lineHeight: 22,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    padding: espacos.lg,
    marginBottom: espacos.md,
    gap: espacos.sm,
  },
  cartaoAndamento: {
    borderColor: cores.primaria,
    shadowColor: cores.primaria,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  cartaoConcluida: {
    borderColor: cores.borda,
    opacity: 0.92,
  },
  cabecalhoCartao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagAndamento: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: cores.primariaFraca,
    paddingHorizontal: espacos.sm,
    paddingVertical: 4,
    borderRadius: raios.pill,
  },
  dotAndamento: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: cores.primaria,
  },
  tagAndamentoTexto: {
    color: cores.primaria,
    fontSize: fontes.pequena,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  tagConcluida: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: cores.primaria,
    paddingHorizontal: espacos.sm,
    paddingVertical: 4,
    borderRadius: raios.pill,
  },
  tagConcluidaTexto: {
    color: cores.fundo,
    fontSize: fontes.pequena,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  patrocinador: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    fontWeight: "600",
    fontStyle: "italic",
  },
  tituloPremio: {
    color: cores.texto,
    fontSize: fontes.grande,
    fontWeight: "700",
    lineHeight: 26,
  },
  linhaPremio: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  premio: {
    color: cores.primaria,
    fontSize: fontes.media,
    fontWeight: "600",
    flex: 1,
  },
  descricao: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    lineHeight: 20,
  },
  rodape: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: espacos.xs,
  },
  rodapeTexto: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    fontWeight: "600",
  },
  subSecao: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: espacos.sm,
  },
  gridVencedores: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacos.xs,
  },
  chipVencedor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: cores.primariaFraca,
    paddingHorizontal: espacos.sm,
    paddingVertical: 6,
    borderRadius: raios.pill,
    borderWidth: 1,
    borderColor: cores.bordaCard,
  },
  chipVencedorTexto: {
    color: cores.texto,
    fontSize: fontes.base,
    fontWeight: "600",
  },
});
