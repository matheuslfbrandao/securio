import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { DocumentSnapshot } from "firebase/firestore";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Avatar } from "../../src/components/Avatar";
import { Cabecalho } from "../../src/components/Cabecalho";
import { Tela } from "../../src/components/Tela";
import { useAuth } from "../../src/contexts/AuthContext";
import { usePerfil } from "../../src/contexts/PerfilContext";
import { urlAvatarPadrao } from "../../src/data/avatares";
import {
  carregarPaginaRanking,
  EscopoRanking,
  ItemRanking,
} from "../../src/services/ranking";
import { cores, espacos, fontes, raios } from "../../src/theme";
import { entradaNativa } from "../../src/utils/anim";

type AbaId = "global" | "universidade" | "cidade";

export default function Ranking() {
  const { usuario } = useAuth();
  const { perfil } = usePerfil();
  const router = useRouter();

  const [aba, setAba] = useState<AbaId>("global");
  const [itens, setItens] = useState<ItemRanking[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [fim, setFim] = useState(false);
  const cursorRef = useRef<DocumentSnapshot | null>(null);
  const offsetRef = useRef(0);

  const [busca, setBusca] = useState("");

  const escopo = useMemo<EscopoRanking>(() => {
    if (aba === "universidade" && perfil?.universidade) {
      return { tipo: "universidade", valor: perfil.universidade };
    }
    if (aba === "cidade" && perfil?.cidade) {
      return { tipo: "cidade", valor: perfil.cidade };
    }
    return { tipo: "global" };
  }, [aba, perfil?.universidade, perfil?.cidade]);

  const semDadoLocal =
    (aba === "universidade" && !perfil?.universidade) ||
    (aba === "cidade" && !perfil?.cidade);

  const carregarPrimeira = useCallback(async () => {
    if (semDadoLocal) {
      setItens([]);
      setCarregando(false);
      setFim(true);
      return;
    }
    setCarregando(true);
    cursorRef.current = null;
    offsetRef.current = 0;
    try {
      const pagina = await carregarPaginaRanking(null, 0, escopo);
      setItens(pagina.itens);
      cursorRef.current = pagina.cursor;
      offsetRef.current = pagina.itens.length;
      setFim(pagina.fim);
    } finally {
      setCarregando(false);
    }
  }, [escopo, semDadoLocal]);

  const carregarProxima = useCallback(async () => {
    if (carregandoMais || fim || !cursorRef.current || semDadoLocal) return;
    setCarregandoMais(true);
    try {
      const pagina = await carregarPaginaRanking(
        cursorRef.current,
        offsetRef.current,
        escopo
      );
      setItens((atual) => [...atual, ...pagina.itens]);
      cursorRef.current = pagina.cursor;
      offsetRef.current += pagina.itens.length;
      setFim(pagina.fim);
    } finally {
      setCarregandoMais(false);
    }
  }, [carregandoMais, fim, escopo, semDadoLocal]);

  useFocusEffect(
    useCallback(() => {
      carregarPrimeira();
    }, [carregarPrimeira])
  );

  const filtrados = useMemo(() => {
    if (!busca.trim()) return itens;
    const t = busca.trim().toLowerCase();
    return itens.filter((i) => i.nickname.toLowerCase().includes(t));
  }, [itens, busca]);

  const minhaPosicao = useMemo(() => {
    return itens.find((i) => i.uid === usuario?.uid)?.posicao ?? null;
  }, [itens, usuario]);

  const subtituloAba: Record<AbaId, string> = {
    global: "Todos os usuários ordenados por pontos",
    universidade: perfil?.universidade
      ? `Pessoas de ${perfil.universidade}`
      : "Defina sua universidade no perfil",
    cidade: perfil?.cidade
      ? `Pessoas de ${perfil.cidade}`
      : "Defina sua cidade no perfil",
  };

  return (
    <Tela>
      <Cabecalho />

      <View style={estilos.conteudo}>
        <View style={estilos.cabecalhoTela}>
          <View style={{ flex: 1 }}>
            <Text style={estilos.titulo}>Ranking</Text>
            <Text style={estilos.subtitulo}>{subtituloAba[aba]}</Text>
            {minhaPosicao && (
              <Text style={estilos.subtituloPos}>
                Sua posição:{" "}
                <Text style={estilos.subtituloDestaque}>#{minhaPosicao}</Text>
              </Text>
            )}
          </View>
          <Ionicons name="trophy" size={32} color={cores.primaria} />
        </View>

        <View style={estilos.tabs}>
          {(["global", "universidade", "cidade"] as AbaId[]).map((a) => {
            const ativa = a === aba;
            const icone =
              a === "global" ? "earth" : a === "universidade" ? "school" : "location";
            const label =
              a === "global"
                ? "Global"
                : a === "universidade"
                ? "Universidade"
                : "Cidade";
            return (
              <Pressable
                key={a}
                onPress={() => setAba(a)}
                style={[estilos.tab, ativa && estilos.tabAtiva]}
              >
                <Ionicons
                  name={icone as any}
                  size={14}
                  color={ativa ? cores.fundo : cores.textoSecundario}
                />
                <Text style={[estilos.tabTexto, ativa && estilos.tabTextoAtiva]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={estilos.busca}>
          <Ionicons name="search" size={18} color={cores.textoSecundario} />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar por nickname..."
            placeholderTextColor={cores.textoSecundario}
            style={estilos.buscaInput}
            autoCapitalize="none"
          />
        </View>

        {semDadoLocal ? (
          <Animated.View
            entering={entradaNativa(FadeIn.duration(220))}
            style={estilos.cartaoVazio}
          >
            <Ionicons
              name={aba === "universidade" ? "school-outline" : "location-outline"}
              size={56}
              color={cores.primaria}
            />
            <Text style={estilos.vazioTitulo}>
              {aba === "universidade"
                ? "Defina sua universidade"
                : "Defina sua cidade"}
            </Text>
            <Text style={estilos.vazioTexto}>
              Para ver o ranking{" "}
              {aba === "universidade" ? "da sua universidade" : "da sua cidade"}
              , preencha esse campo no seu perfil.
            </Text>
            <Pressable
              onPress={() => router.push("/(app)/perfil")}
              style={({ pressed }) => [
                estilos.btnIr,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Ionicons name="person" size={18} color={cores.fundo} />
              <Text style={estilos.btnIrTexto}>Editar perfil</Text>
            </Pressable>
          </Animated.View>
        ) : carregando ? (
          <View style={estilos.centro}>
            <ActivityIndicator size="large" color={cores.primaria} />
          </View>
        ) : itens.length === 0 ? (
          <View style={estilos.centro}>
            <Text style={estilos.vazio}>Nenhum usuário neste ranking ainda.</Text>
          </View>
        ) : (
          <FlatList
            data={filtrados}
            keyExtractor={(i) => i.uid}
            contentContainerStyle={estilos.lista}
            onEndReached={carregarProxima}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={carregando}
                onRefresh={carregarPrimeira}
                tintColor={cores.primaria}
                colors={[cores.primaria]}
              />
            }
            renderItem={({ item, index }) => (
              <Animated.View
                entering={entradaNativa(
                  FadeInUp.duration(220).delay(Math.min(index * 25, 300))
                )}
              >
                <ItemLinha
                  item={item}
                  ehVoce={item.uid === usuario?.uid}
                  aoTocar={() =>
                    router.push({
                      pathname: "/(app)/usuario/[uid]",
                      params: { uid: item.uid },
                    })
                  }
                />
              </Animated.View>
            )}
            ListEmptyComponent={
              <Text style={estilos.vazio}>
                Nenhum usuário encontrado com esse nickname.
              </Text>
            }
            ListFooterComponent={
              carregandoMais ? (
                <View style={{ padding: espacos.md, alignItems: "center" }}>
                  <ActivityIndicator color={cores.primaria} />
                </View>
              ) : fim && filtrados.length > 0 ? (
                <Text style={estilos.fimLista}>— fim do ranking —</Text>
              ) : null
            }
          />
        )}
      </View>
    </Tela>
  );
}

function ItemLinha({
  item,
  ehVoce,
  aoTocar,
}: {
  item: ItemRanking;
  ehVoce: boolean;
  aoTocar: () => void;
}) {
  const ehTop3 = item.posicao <= 3;
  const corPosicao =
    item.posicao === 1
      ? "#FFD700"
      : item.posicao === 2
      ? "#C0C0C0"
      : item.posicao === 3
      ? "#CD7F32"
      : cores.textoSecundario;

  const localizacao = item.cidade && item.universidade
    ? `${item.universidade} • ${item.cidade}`
    : item.universidade || item.cidade;

  return (
    <Pressable
      onPress={aoTocar}
      style={({ pressed }) => [
        estilos.linha,
        ehTop3 && estilos.linhaTop3,
        ehVoce && estilos.linhaVoce,
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={estilos.posicao}>
        {ehTop3 ? (
          <Ionicons name="medal" size={24} color={corPosicao} />
        ) : (
          <Text style={[estilos.posicaoNum, { color: corPosicao }]}>
            {item.posicao}
          </Text>
        )}
      </View>

      <Avatar
        url={item.avatarUrl ?? urlAvatarPadrao(item.nickname)}
        tamanho={42}
      />

      <View style={estilos.info}>
        <Text style={[estilos.nickname, ehVoce && estilos.nicknameVoce]}>
          {item.nickname}
          {ehVoce && <Text style={estilos.tagVoce}> • você</Text>}
        </Text>
        {localizacao && (
          <Text style={estilos.localizacao} numberOfLines={1}>
            {localizacao}
          </Text>
        )}
      </View>

      <View style={estilos.pontosBox}>
        <Text style={estilos.pontosNum}>{item.pontosTotais}</Text>
        <Text style={estilos.pontosLabel}>pts</Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  conteudo: {
    flex: 1,
    padding: espacos.lg,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  cabecalhoTela: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: espacos.md,
  },
  titulo: {
    fontSize: fontes.titulo,
    fontWeight: "700",
    color: cores.texto,
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    marginTop: 2,
  },
  subtituloPos: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    marginTop: 2,
  },
  subtituloDestaque: {
    color: cores.primaria,
    fontWeight: "700",
  },
  tabs: {
    flexDirection: "row",
    gap: espacos.xs,
    marginBottom: espacos.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: raios.pill,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  tabAtiva: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
    shadowColor: cores.primaria,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  tabTexto: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  tabTextoAtiva: {
    color: cores.fundo,
  },
  busca: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
    backgroundColor: cores.superficie,
    borderRadius: raios.pill,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    paddingHorizontal: espacos.md,
    height: 44,
    marginBottom: espacos.sm,
  },
  buscaInput: {
    flex: 1,
    color: cores.texto,
    fontSize: fontes.media,
    outlineStyle: "none" as any,
  },
  centro: {
    paddingVertical: espacos.xxl,
    alignItems: "center",
  },
  vazio: {
    color: cores.textoSecundario,
    fontSize: fontes.media,
    textAlign: "center",
    paddingVertical: espacos.lg,
  },
  fimLista: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    textAlign: "center",
    paddingVertical: espacos.md,
    fontStyle: "italic",
  },
  cartaoVazio: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.xl,
    alignItems: "center",
    gap: espacos.sm,
    marginTop: espacos.lg,
  },
  vazioTitulo: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
    marginTop: espacos.sm,
  },
  vazioTexto: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    textAlign: "center",
    lineHeight: 22,
  },
  btnIr: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: cores.primaria,
    paddingHorizontal: espacos.lg,
    paddingVertical: espacos.sm,
    borderRadius: raios.pill,
    marginTop: espacos.md,
  },
  btnIrTexto: {
    color: cores.fundo,
    fontSize: fontes.media,
    fontWeight: "700",
  },
  lista: {
    gap: espacos.sm,
    paddingTop: espacos.sm,
    paddingBottom: espacos.xl,
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
    backgroundColor: cores.superficie,
    borderRadius: raios.medio,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacos.md,
  },
  linhaTop3: {
    borderColor: cores.primaria,
    backgroundColor: cores.primariaFraca,
    shadowColor: cores.primaria,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  linhaVoce: {
    borderColor: cores.primariaClara,
    borderWidth: 2,
  },
  posicao: {
    width: 36,
    alignItems: "center",
  },
  posicaoNum: {
    fontSize: fontes.grande,
    fontWeight: "700",
  },
  info: {
    flex: 1,
  },
  nickname: {
    color: cores.texto,
    fontSize: fontes.media,
    fontWeight: "600",
  },
  nicknameVoce: {
    color: cores.primariaClara,
  },
  tagVoce: {
    color: cores.primaria,
    fontWeight: "700",
    fontSize: fontes.pequena,
  },
  localizacao: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    marginTop: 2,
  },
  pontosBox: {
    alignItems: "flex-end",
  },
  pontosNum: {
    color: cores.primaria,
    fontSize: fontes.media,
    fontWeight: "700",
  },
  pontosLabel: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
  },
});
