import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Botao } from "../../src/components/Botao";
import { Cabecalho } from "../../src/components/Cabecalho";
import { Tela } from "../../src/components/Tela";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  ItemPergunta,
  listarPerguntasComRespostas,
  Pergunta,
  registrarResposta,
  RespostaSalva,
  ResultadoEnvio,
} from "../../src/services/quiz";
import { cores, espacos, fontes, raios } from "../../src/theme";
import { entradaNativa } from "../../src/utils/anim";
import { tempoAteProximaPergunta } from "../../src/utils/calcularPontos";

type Estado =
  | { tipo: "carregando" }
  | { tipo: "vazio" }
  | { tipo: "lista"; itens: ItemPergunta[] }
  | {
      tipo: "respondendo";
      pergunta: Pergunta;
      tentativaAnterior: RespostaSalva | null;
      ehDoDia: boolean;
    }
  | {
      tipo: "enviando";
      pergunta: Pergunta;
      tentativaAnterior: RespostaSalva | null;
      ehDoDia: boolean;
    }
  | { tipo: "resultado"; pergunta: Pergunta; resultado: ResultadoEnvio; ehDoDia: boolean };

export default function Quiz() {
  const { usuario } = useAuth();
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const inicioRef = useRef<number>(0);

  const carregar = useCallback(async () => {
    if (!usuario) return;
    try {
      const itens = await listarPerguntasComRespostas(usuario.uid);
      if (itens.length === 0) {
        setEstado({ tipo: "vazio" });
      } else {
        setEstado({ tipo: "lista", itens });
      }
    } catch {
      setEstado({ tipo: "vazio" });
    }
  }, [usuario?.uid]);

  useFocusEffect(
    useCallback(() => {
      setEstado((e) => (e.tipo === "lista" || e.tipo === "vazio" ? { tipo: "carregando" } : e));
      carregar();
    }, [carregar])
  );

  function abrirPergunta(item: ItemPergunta) {
    inicioRef.current = Date.now();
    setEscolhida(null);
    setEstado({
      tipo: "respondendo",
      pergunta: item.pergunta,
      tentativaAnterior: item.resposta,
      ehDoDia: item.ehDoDia,
    });
  }

  async function aoEnviar() {
    if (
      !usuario ||
      escolhida === null ||
      (estado.tipo !== "respondendo" && estado.tipo !== "enviando")
    )
      return;

    if (estado.tipo === "respondendo") {
      const { pergunta, tentativaAnterior, ehDoDia } = estado;
      setEstado({ tipo: "enviando", pergunta, tentativaAnterior, ehDoDia });

      const tempoRespostaMs = Date.now() - inicioRef.current;

      try {
        const resultado = await registrarResposta({
          uid: usuario.uid,
          pergunta,
          alternativaEscolhida: escolhida,
          tempoRespostaMs,
          respostaAnterior: tentativaAnterior,
        });
        setEstado({ tipo: "resultado", pergunta, resultado, ehDoDia });
      } catch {
        setEstado({ tipo: "respondendo", pergunta, tentativaAnterior, ehDoDia });
      }
    }
  }

  function aoTentarDeNovo() {
    if (estado.tipo !== "resultado") return;
    inicioRef.current = Date.now();
    setEscolhida(null);
    setEstado({
      tipo: "respondendo",
      pergunta: estado.pergunta,
      tentativaAnterior: {
        perguntaId: estado.pergunta.id,
        tentativas: 1,
        acertou: false,
        pontosGanhos: 0,
        tempoRespostaMs: 0,
        respondidoEm: null as any,
      },
      ehDoDia: estado.ehDoDia,
    });
  }

  function voltarParaLista() {
    carregar();
  }

  return (
    <Tela>
      <Cabecalho />

      <ScrollView contentContainerStyle={estilos.scroll}>
        {estado.tipo === "carregando" && (
          <View style={estilos.centro}>
            <ActivityIndicator size="large" color={cores.primaria} />
          </View>
        )}

        {estado.tipo === "vazio" && <VazioView />}

        {estado.tipo === "lista" && (
          <ListaView itens={estado.itens} aoTocar={abrirPergunta} />
        )}

        {(estado.tipo === "respondendo" || estado.tipo === "enviando") && (
          <RespondendoView
            pergunta={estado.pergunta}
            tentativaAnterior={estado.tentativaAnterior}
            ehDoDia={estado.ehDoDia}
            escolhida={escolhida}
            setEscolhida={setEscolhida}
            enviando={estado.tipo === "enviando"}
            aoEnviar={aoEnviar}
            aoVoltar={voltarParaLista}
          />
        )}

        {estado.tipo === "resultado" && (
          <ResultadoView
            resultado={estado.resultado}
            ehDoDia={estado.ehDoDia}
            aoTentarDeNovo={aoTentarDeNovo}
            aoConcluir={voltarParaLista}
          />
        )}
      </ScrollView>
    </Tela>
  );
}

function VazioView() {
  return (
    <View style={estilos.cartaoCentralizado}>
      <Ionicons name="time-outline" size={64} color={cores.primaria} />
      <Text style={estilos.cartaoTitulo}>Nenhuma pergunta ainda</Text>
      <Text style={estilos.cartaoTexto}>
        A primeira pergunta diária ainda não foi liberada. Volte mais tarde!
      </Text>
    </View>
  );
}

function ListaView({
  itens,
  aoTocar,
}: {
  itens: ItemPergunta[];
  aoTocar: (i: ItemPergunta) => void;
}) {
  const doDia = itens.find((i) => i.ehDoDia);
  const pendentes = itens.filter((i) => !i.concluida && !i.ehDoDia);
  const concluidas = itens.filter((i) => i.concluida);

  return (
    <Animated.View entering={entradaNativa(FadeIn.duration(220))}>
      <Text style={estilos.tituloTela}>Quiz Diário</Text>

      {doDia && (
        <Animated.View entering={entradaNativa(FadeInUp.duration(280).delay(60))}>
          <CardDoDia item={doDia} aoTocar={() => aoTocar(doDia)} />
        </Animated.View>
      )}

      {pendentes.length > 0 && (
        <>
          <Text style={estilos.subtitulo}>
            Perguntas anteriores ({pendentes.length})
          </Text>
          <Text style={estilos.subDica}>
            Responda perguntas anteriores para ganhar pontos. Sem bônus de velocidade.
          </Text>
          {pendentes.map((item, i) => (
            <Animated.View
              key={item.pergunta.id}
              entering={entradaNativa(FadeInUp.duration(220).delay(120 + i * 40))}
            >
              <CardAnterior item={item} aoTocar={() => aoTocar(item)} />
            </Animated.View>
          ))}
        </>
      )}

      {concluidas.length > 0 && (
        <>
          <Text style={estilos.subtitulo}>Concluídas ({concluidas.length})</Text>
          {concluidas.map((item) => (
            <CardConcluido key={item.pergunta.id} item={item} />
          ))}
        </>
      )}
    </Animated.View>
  );
}

function CardDoDia({
  item,
  aoTocar,
}: {
  item: ItemPergunta;
  aoTocar: () => void;
}) {
  if (item.concluida) {
    return (
      <View style={estilos.cardDoDiaConcluido}>
        <View style={estilos.metaLinha}>
          <View style={estilos.tagDestaque}>
            <Ionicons name="star" size={14} color={cores.fundo} />
            <Text style={estilos.tagDestaqueTexto}>PERGUNTA DO DIA</Text>
          </View>
        </View>
        <Text style={estilos.enunciadoCard}>{item.pergunta.enunciado}</Text>
        <View style={estilos.linhaConcluida}>
          <Ionicons
            name={item.resposta?.acertou ? "checkmark-circle" : "close-circle"}
            size={20}
            color={item.resposta?.acertou ? cores.sucesso : cores.erro}
          />
          <Text style={estilos.textoConcluida}>
            {item.resposta?.acertou
              ? `Acertou! +${item.resposta.pontosGanhos} pts`
              : "Não acertou"}
          </Text>
        </View>
        <ContadorView />
      </View>
    );
  }

  return (
    <Pressable
      onPress={aoTocar}
      style={({ pressed }) => [estilos.cardDoDia, pressed && { opacity: 0.85 }]}
    >
      <View style={estilos.metaLinha}>
        <View style={estilos.tagDestaque}>
          <Ionicons name="star" size={14} color={cores.fundo} />
          <Text style={estilos.tagDestaqueTexto}>PERGUNTA DO DIA</Text>
        </View>
        <View style={estilos.tagBonus}>
          <Ionicons name="flash" size={12} color={cores.primariaClara} />
          <Text style={estilos.tagBonusTexto}>Bônus de velocidade</Text>
        </View>
      </View>
      <Text style={estilos.enunciadoCard}>{item.pergunta.enunciado}</Text>
      <View style={estilos.linhaCta}>
        <Text style={estilos.categoriaTexto}>{item.pergunta.categoria}</Text>
        <View style={estilos.cta}>
          <Text style={estilos.ctaTexto}>Responder</Text>
          <Ionicons name="arrow-forward" size={18} color={cores.primaria} />
        </View>
      </View>
    </Pressable>
  );
}

function CardAnterior({
  item,
  aoTocar,
}: {
  item: ItemPergunta;
  aoTocar: () => void;
}) {
  return (
    <Pressable
      onPress={aoTocar}
      style={({ pressed }) => [estilos.cardItem, pressed && { opacity: 0.7 }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={estilos.itemCategoria}>{item.pergunta.categoria}</Text>
        <Text style={estilos.itemEnunciado} numberOfLines={2}>
          {item.pergunta.enunciado}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={cores.textoSecundario} />
    </Pressable>
  );
}

function CardConcluido({ item }: { item: ItemPergunta }) {
  return (
    <View style={[estilos.cardItem, estilos.cardItemConcluido]}>
      <View style={estilos.iconeConcluido}>
        <Ionicons
          name={item.resposta?.acertou ? "checkmark-circle" : "close-circle"}
          size={22}
          color={item.resposta?.acertou ? cores.sucesso : cores.erro}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={estilos.itemCategoria}>{item.pergunta.categoria}</Text>
        <Text style={estilos.itemEnunciado} numberOfLines={1}>
          {item.pergunta.enunciado}
        </Text>
      </View>
      {item.resposta && item.resposta.acertou && (
        <Text style={estilos.itemPontos}>+{item.resposta.pontosGanhos}</Text>
      )}
    </View>
  );
}

function RespondendoView({
  pergunta,
  tentativaAnterior,
  ehDoDia,
  escolhida,
  setEscolhida,
  enviando,
  aoEnviar,
  aoVoltar,
}: {
  pergunta: Pergunta;
  tentativaAnterior: RespostaSalva | null;
  ehDoDia: boolean;
  escolhida: number | null;
  setEscolhida: (i: number) => void;
  enviando: boolean;
  aoEnviar: () => void;
  aoVoltar: () => void;
}) {
  const tentativaNum = tentativaAnterior ? 2 : 1;

  return (
    <View>
      <Pressable onPress={aoVoltar} style={estilos.voltar} hitSlop={10}>
        <Ionicons name="arrow-back" size={22} color={cores.texto} />
        <Text style={estilos.voltarTexto}>Voltar</Text>
      </Pressable>

      <View style={estilos.cartaoPergunta}>
        <View style={estilos.metaLinha}>
          {ehDoDia && (
            <View style={estilos.tagDestaque}>
              <Ionicons name="star" size={12} color={cores.fundo} />
              <Text style={estilos.tagDestaqueTexto}>DO DIA</Text>
            </View>
          )}
          <View style={estilos.tag}>
            <Ionicons name="pricetag-outline" size={12} color={cores.primaria} />
            <Text style={estilos.tagTexto}>{pergunta.categoria}</Text>
          </View>
          <View style={estilos.tag}>
            <Text style={estilos.tagTexto}>{tentativaNum}ª tentativa</Text>
          </View>
        </View>

        <Text style={estilos.enunciado}>{pergunta.enunciado}</Text>

        {pergunta.alternativas.map((alt, i) => {
          const ativa = escolhida === i;
          return (
            <Pressable
              key={i}
              onPress={() => !enviando && setEscolhida(i)}
              style={({ pressed }) => [
                estilos.alternativa,
                ativa && estilos.alternativaAtiva,
                pressed && !enviando && { opacity: 0.7 },
              ]}
            >
              <View style={[estilos.bullet, ativa && estilos.bulletAtivo]}>
                <Text
                  style={[estilos.bulletTexto, ativa && estilos.bulletTextoAtivo]}
                >
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text style={estilos.alternativaTexto}>{alt}</Text>
            </Pressable>
          );
        })}
      </View>

      <Botao
        titulo="Confirmar resposta"
        onPress={aoEnviar}
        carregando={enviando}
        desabilitado={escolhida === null}
        style={{ marginTop: espacos.lg }}
      />
    </View>
  );
}

function ResultadoView({
  resultado,
  ehDoDia,
  aoTentarDeNovo,
  aoConcluir,
}: {
  resultado: ResultadoEnvio;
  ehDoDia: boolean;
  aoTentarDeNovo: () => void;
  aoConcluir: () => void;
}) {
  return (
    <View
      style={[
        estilos.cartaoCentralizado,
        resultado.acertou ? estilos.cartaoSucesso : estilos.cartaoErro,
      ]}
    >
      <Ionicons
        name={resultado.acertou ? "checkmark-circle" : "close-circle"}
        size={72}
        color={resultado.acertou ? cores.sucesso : cores.erro}
      />
      <Text style={estilos.cartaoTitulo}>
        {resultado.acertou ? "Acertou!" : "Errou"}
      </Text>

      {resultado.acertou && (
        <View style={estilos.pontosWrap}>
          <Text style={estilos.pontosNum}>+{resultado.pontosGanhos}</Text>
          <Text style={estilos.pontosLabel}>pontos</Text>
          {ehDoDia && resultado.multiplicador > 1.05 && (
            <Text style={estilos.multiplicador}>
              ({resultado.multiplicador.toFixed(2)}x velocidade)
            </Text>
          )}
        </View>
      )}

      <Text style={estilos.cartaoTexto}>{resultado.explicacao}</Text>

      {resultado.podeTentarNovamente ? (
        <Botao
          titulo="Tentar novamente"
          onPress={aoTentarDeNovo}
          style={{ marginTop: espacos.md, alignSelf: "stretch" }}
        />
      ) : (
        <Botao
          titulo="Voltar para lista"
          onPress={aoConcluir}
          style={{ marginTop: espacos.md, alignSelf: "stretch" }}
        />
      )}
    </View>
  );
}

function ContadorView() {
  const [tempo, setTempo] = useState(tempoAteProximaPergunta());
  useEffect(() => {
    const id = setInterval(() => setTempo(tempoAteProximaPergunta()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <View style={estilos.contadorWrap}>
      <Ionicons name="time-outline" size={16} color={cores.primaria} />
      <Text style={estilos.contadorTexto}>
        Próxima em{" "}
        {String(tempo.horas).padStart(2, "0")}:
        {String(tempo.minutos).padStart(2, "0")}:
        {String(tempo.segundos).padStart(2, "0")}
      </Text>
    </View>
  );
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
  voltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: espacos.md,
  },
  voltarTexto: {
    color: cores.texto,
    fontSize: fontes.base,
    fontWeight: "600",
  },
  tituloTela: {
    fontSize: fontes.titulo,
    fontWeight: "700",
    color: cores.texto,
    marginBottom: espacos.lg,
  },
  subtitulo: {
    color: cores.texto,
    fontSize: fontes.media,
    fontWeight: "700",
    marginTop: espacos.lg,
    marginBottom: espacos.xs,
  },
  subDica: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    marginBottom: espacos.sm,
  },
  cardDoDia: {
    backgroundColor: cores.primariaFraca,
    borderRadius: raios.grande,
    borderWidth: 2,
    borderColor: cores.primaria,
    padding: espacos.lg,
    gap: espacos.sm,
    shadowColor: cores.primaria,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  cardDoDiaConcluido: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 2,
    borderColor: cores.bordaCard,
    padding: espacos.lg,
    gap: espacos.sm,
  },
  cartaoPergunta: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.lg,
    gap: espacos.md,
  },
  metaLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacos.xs,
  },
  tagDestaque: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: cores.primaria,
    paddingHorizontal: espacos.sm,
    paddingVertical: 4,
    borderRadius: raios.pill,
  },
  tagDestaqueTexto: {
    color: cores.fundo,
    fontSize: fontes.pequena,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  tagBonus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(125, 235, 224, 0.2)",
    paddingHorizontal: espacos.sm,
    paddingVertical: 4,
    borderRadius: raios.pill,
  },
  tagBonusTexto: {
    color: cores.primariaClara,
    fontSize: fontes.pequena,
    fontWeight: "600",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: cores.primariaFraca,
    paddingHorizontal: espacos.sm,
    paddingVertical: 4,
    borderRadius: raios.pill,
  },
  tagTexto: {
    color: cores.primaria,
    fontSize: fontes.pequena,
    fontWeight: "600",
  },
  enunciadoCard: {
    color: cores.texto,
    fontSize: fontes.media,
    fontWeight: "600",
    lineHeight: 22,
  },
  linhaCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: espacos.sm,
  },
  categoriaTexto: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ctaTexto: {
    color: cores.primaria,
    fontSize: fontes.media,
    fontWeight: "700",
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
    backgroundColor: cores.superficie,
    borderRadius: raios.medio,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacos.md,
    marginBottom: espacos.xs,
  },
  cardItemConcluido: {
    opacity: 0.6,
  },
  iconeConcluido: {
    width: 28,
    alignItems: "center",
  },
  itemCategoria: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  itemEnunciado: {
    color: cores.texto,
    fontSize: fontes.base,
    marginTop: 2,
  },
  itemPontos: {
    color: cores.primaria,
    fontSize: fontes.media,
    fontWeight: "700",
  },
  linhaConcluida: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.xs,
  },
  textoConcluida: {
    color: cores.texto,
    fontSize: fontes.base,
    fontWeight: "600",
  },
  contadorWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: espacos.sm,
  },
  contadorTexto: {
    color: cores.primaria,
    fontSize: fontes.base,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  enunciado: {
    color: cores.texto,
    fontSize: fontes.grande,
    fontWeight: "600",
    lineHeight: 28,
    marginBottom: espacos.sm,
  },
  alternativa: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.md,
    backgroundColor: cores.superficieSolida,
    borderWidth: 1.5,
    borderColor: cores.borda,
    borderRadius: raios.medio,
    padding: espacos.md,
  },
  alternativaAtiva: {
    borderColor: cores.primaria,
    backgroundColor: cores.primariaFraca,
  },
  bullet: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: cores.borda,
    alignItems: "center",
    justifyContent: "center",
  },
  bulletAtivo: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  bulletTexto: {
    color: cores.textoSecundario,
    fontWeight: "700",
    fontSize: fontes.base,
  },
  bulletTextoAtivo: {
    color: cores.textoEscuro,
  },
  alternativaTexto: {
    color: cores.texto,
    fontSize: fontes.media,
    flex: 1,
  },
  cartaoCentralizado: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.xl,
    alignItems: "center",
    gap: espacos.sm,
  },
  cartaoSucesso: {
    borderColor: cores.sucesso,
  },
  cartaoErro: {
    borderColor: cores.erro,
  },
  cartaoTitulo: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
    marginTop: espacos.sm,
  },
  cartaoTexto: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    textAlign: "center",
    lineHeight: 22,
  },
  pontosWrap: {
    alignItems: "center",
    marginVertical: espacos.sm,
  },
  pontosNum: {
    color: cores.primaria,
    fontSize: fontes.destaque,
    fontWeight: "700",
  },
  pontosLabel: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
  },
  multiplicador: {
    color: cores.primariaClara,
    fontSize: fontes.pequena,
    marginTop: 4,
    fontWeight: "600",
  },
});
