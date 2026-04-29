import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { DocumentSnapshot } from "firebase/firestore";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Avatar } from "../../../src/components/Avatar";
import { Cabecalho } from "../../../src/components/Cabecalho";
import { Tela } from "../../../src/components/Tela";
import { urlAvatarPadrao } from "../../../src/data/avatares";
import { ForumPost, listarPosts } from "../../../src/services/forum";
import { cores, espacos, fontes, raios } from "../../../src/theme";
import { entradaNativa } from "../../../src/utils/anim";

export default function ForumLista() {
  const router = useRouter();

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [fim, setFim] = useState(false);
  const cursorRef = useRef<DocumentSnapshot | null>(null);

  const carregarPrimeira = useCallback(async () => {
    setCarregando(true);
    cursorRef.current = null;
    try {
      const r = await listarPosts(null);
      setPosts(r.posts);
      cursorRef.current = r.cursor;
      setFim(r.fim);
    } finally {
      setCarregando(false);
    }
  }, []);

  const carregarProxima = useCallback(async () => {
    if (carregandoMais || fim || !cursorRef.current) return;
    setCarregandoMais(true);
    try {
      const r = await listarPosts(cursorRef.current);
      setPosts((atual) => [...atual, ...r.posts]);
      cursorRef.current = r.cursor;
      setFim(r.fim);
    } finally {
      setCarregandoMais(false);
    }
  }, [carregandoMais, fim]);

  useFocusEffect(
    useCallback(() => {
      carregarPrimeira();
    }, [carregarPrimeira])
  );

  return (
    <Tela>
      <Cabecalho />

      <View style={estilos.conteudo}>
        <View style={estilos.cabecalhoTela}>
          <Pressable
            onPress={() => router.replace("/(app)/home")}
            style={estilos.voltar}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={24} color={cores.texto} />
            <Text style={estilos.voltarTexto}>Voltar</Text>
          </Pressable>
        </View>

        <View style={estilos.tituloLinha}>
          <View>
            <Text style={estilos.titulo}>Dicas de Segurança</Text>
            <Text style={estilos.subtitulo}>
              Compartilhe e descubra dicas da comunidade.
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/(app)/dicas/novo")}
            style={({ pressed }) => [
              estilos.btnNovo,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="add" size={24} color={cores.fundo} />
          </Pressable>
        </View>

        {carregando ? (
          <View style={estilos.centro}>
            <ActivityIndicator size="large" color={cores.primaria} />
          </View>
        ) : posts.length === 0 ? (
          <View style={estilos.cartaoVazio}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={56}
              color={cores.primaria}
            />
            <Text style={estilos.vazioTitulo}>Ainda não tem nenhuma dica</Text>
            <Text style={estilos.vazioTexto}>
              Seja o primeiro a publicar uma dica para a comunidade!
            </Text>
            <Pressable
              onPress={() => router.push("/(app)/dicas/novo")}
              style={({ pressed }) => [
                estilos.btnNovoLargo,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Ionicons name="add" size={20} color={cores.fundo} />
              <Text style={estilos.btnNovoLargoTexto}>Criar primeira dica</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(p) => p.id}
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
                  FadeInUp.duration(220).delay(Math.min(index * 40, 400))
                )}
              >
                <ItemPost
                  post={item}
                  aoTocar={() =>
                    router.push({
                      pathname: "/(app)/dicas/[id]",
                      params: { id: item.id },
                    })
                  }
                />
              </Animated.View>
            )}
            ListFooterComponent={
              carregandoMais ? (
                <ActivityIndicator color={cores.primaria} style={{ padding: 16 }} />
              ) : fim && posts.length > 0 ? (
                <Text style={estilos.fimLista}>— fim das dicas —</Text>
              ) : null
            }
          />
        )}
      </View>
    </Tela>
  );
}

function ItemPost({
  post,
  aoTocar,
}: {
  post: ForumPost;
  aoTocar: () => void;
}) {
  return (
    <Pressable
      onPress={aoTocar}
      style={({ pressed }) => [estilos.card, pressed && { opacity: 0.7 }]}
    >
      <View style={estilos.autor}>
        <Avatar
          url={post.autorAvatarUrl || urlAvatarPadrao(post.autorNickname)}
          tamanho={32}
          comBorda={false}
        />
        <Text style={estilos.autorNick}>{post.autorNickname}</Text>
      </View>
      <Text style={estilos.cardTitulo}>{post.titulo}</Text>
      <Text style={estilos.cardConteudo} numberOfLines={3}>
        {post.conteudo}
      </Text>
      <View style={estilos.rodape}>
        <Ionicons
          name="chatbubble-outline"
          size={14}
          color={cores.textoSecundario}
        />
        <Text style={estilos.rodapeTexto}>
          {post.qtdComentarios}{" "}
          {post.qtdComentarios === 1 ? "comentário" : "comentários"}
        </Text>
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
    marginBottom: espacos.sm,
  },
  voltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  voltarTexto: {
    color: cores.texto,
    fontSize: fontes.base,
    fontWeight: "600",
  },
  tituloLinha: {
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
  btnNovo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: cores.primaria,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: cores.primaria,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  btnNovoLargo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: cores.primaria,
    paddingHorizontal: espacos.lg,
    paddingVertical: espacos.sm,
    borderRadius: raios.pill,
    marginTop: espacos.md,
  },
  btnNovoLargoTexto: {
    color: cores.fundo,
    fontSize: fontes.media,
    fontWeight: "700",
  },
  centro: {
    paddingVertical: espacos.xxl,
    alignItems: "center",
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
  lista: {
    gap: espacos.sm,
    paddingBottom: espacos.xl,
  },
  fimLista: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    textAlign: "center",
    paddingVertical: espacos.md,
    fontStyle: "italic",
  },
  card: {
    backgroundColor: cores.superficie,
    borderRadius: raios.medio,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacos.md,
    gap: espacos.xs,
  },
  autor: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.xs,
  },
  autorNick: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    fontWeight: "600",
  },
  cardTitulo: {
    color: cores.texto,
    fontSize: fontes.media,
    fontWeight: "700",
    marginTop: 2,
  },
  cardConteudo: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    lineHeight: 20,
  },
  rodape: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: espacos.xs,
  },
  rodapeTexto: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    fontWeight: "500",
  },
});
