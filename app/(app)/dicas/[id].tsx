import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Avatar } from "../../../src/components/Avatar";
import { Botao } from "../../../src/components/Botao";
import { Cabecalho } from "../../../src/components/Cabecalho";
import { CampoTexto } from "../../../src/components/CampoTexto";
import { Tela } from "../../../src/components/Tela";
import { useAuth } from "../../../src/contexts/AuthContext";
import { usePerfil } from "../../../src/contexts/PerfilContext";
import { urlAvatarPadrao } from "../../../src/data/avatares";
import {
  buscarPost,
  comentar,
  deletarComentario,
  deletarPost,
  ForumComentario,
  ForumPost,
  listarComentarios,
} from "../../../src/services/forum";
import { cores, espacos, fontes, raios } from "../../../src/theme";
import { entradaNativa } from "../../../src/utils/anim";

function confirmar(titulo: string, mensagem: string): Promise<boolean> {
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }
  return new Promise((resolve) => {
    Alert.alert(titulo, mensagem, [
      { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
      { text: "Confirmar", style: "destructive", onPress: () => resolve(true) },
    ]);
  });
}

export default function DetalhePost() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { usuario } = useAuth();
  const { perfil, ehAdmin } = usePerfil();

  const [post, setPost] = useState<ForumPost | null>(null);
  const [comentarios, setComentarios] = useState<ForumComentario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [novoComentario, setNovoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function carregar() {
    if (!id) return;
    setCarregando(true);
    try {
      const [p, c] = await Promise.all([
        buscarPost(id),
        listarComentarios(id),
      ]);
      setPost(p);
      setComentarios(c);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  async function aoComentar() {
    if (!usuario || !perfil || !post) return;
    if (!novoComentario.trim()) return;
    if (novoComentario.trim().length < 3) return;

    setEnviando(true);
    try {
      await comentar({
        postId: post.id,
        userId: usuario.uid,
        autorNickname: perfil.nickname,
        autorAvatarUrl: perfil.avatarUrl,
        conteudo: novoComentario,
      });
      setNovoComentario("");
      carregar();
    } finally {
      setEnviando(false);
    }
  }

  async function aoDeletarPost() {
    if (!post) return;
    const ok = await confirmar(
      "Excluir publicação",
      "Tem certeza? Esta ação não pode ser desfeita."
    );
    if (!ok) return;
    await deletarPost(post.id);
    router.back();
  }

  async function aoDeletarComentario(c: ForumComentario) {
    if (!post) return;
    const ok = await confirmar(
      "Excluir comentário",
      "Tem certeza?"
    );
    if (!ok) return;
    await deletarComentario(post.id, c.id);
    carregar();
  }

  if (carregando) {
    return (
      <Tela>
        <Cabecalho />
        <View style={estilos.centro}>
          <ActivityIndicator size="large" color={cores.primaria} />
        </View>
      </Tela>
    );
  }

  if (!post) {
    return (
      <Tela>
        <Cabecalho />
        <View style={estilos.centro}>
          <Ionicons name="alert-circle" size={56} color={cores.textoSecundario} />
          <Text style={estilos.naoEncontrado}>Publicação não encontrada</Text>
          <Botao
            titulo="Voltar"
            variante="secundario"
            onPress={() => router.back()}
            style={{ marginTop: espacos.md }}
          />
        </View>
      </Tela>
    );
  }

  const podeApagarPost = ehAdmin || post.userId === usuario?.uid;

  return (
    <Tela>
      <Cabecalho />

      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={estilos.scroll}>
          <Pressable
            onPress={() => router.back()}
            style={estilos.voltar}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={24} color={cores.texto} />
            <Text style={estilos.voltarTexto}>Voltar</Text>
          </Pressable>

          <Animated.View
            entering={entradaNativa(FadeInUp.duration(280))}
            style={estilos.cartaoPost}
          >
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(app)/usuario/[uid]",
                  params: { uid: post.userId },
                })
              }
              style={estilos.autor}
            >
              <Avatar
                url={post.autorAvatarUrl || urlAvatarPadrao(post.autorNickname)}
                tamanho={36}
              />
              <Text style={estilos.autorNick}>{post.autorNickname}</Text>
            </Pressable>

            <Text style={estilos.titulo}>{post.titulo}</Text>
            <Text style={estilos.conteudo}>{post.conteudo}</Text>

            {podeApagarPost && (
              <Pressable
                onPress={aoDeletarPost}
                style={estilos.btnDeletarPost}
                hitSlop={10}
              >
                <Ionicons name="trash" size={18} color={cores.erro} />
                <Text style={estilos.btnDeletarPostTexto}>Excluir</Text>
              </Pressable>
            )}
          </Animated.View>

          <Text style={estilos.secaoTitulo}>
            Comentários ({comentarios.length})
          </Text>

          <View style={estilos.cartaoComentar}>
            <CampoTexto
              rotulo=""
              valor={novoComentario}
              aoMudar={setNovoComentario}
              multiline
              maxLength={500}
              autoCapitalize="sentences"
              placeholder="Adicione um comentário..."
            />
            <Botao
              titulo="Comentar"
              onPress={aoComentar}
              carregando={enviando}
              desabilitado={novoComentario.trim().length < 3}
              style={{ marginTop: espacos.sm }}
            />
          </View>

          {comentarios.length === 0 ? (
            <Text style={estilos.semComentarios}>
              Seja o primeiro a comentar.
            </Text>
          ) : (
            comentarios.map((c, i) => {
              const podeApagar = ehAdmin || c.userId === usuario?.uid;
              return (
                <Animated.View
                  key={c.id}
                  entering={entradaNativa(FadeInUp.duration(220).delay(i * 40))}
                  style={estilos.cartaoComentario}
                >
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/(app)/usuario/[uid]",
                        params: { uid: c.userId },
                      })
                    }
                    style={estilos.autorComentario}
                  >
                    <Avatar
                      url={
                        c.autorAvatarUrl || urlAvatarPadrao(c.autorNickname)
                      }
                      tamanho={28}
                      comBorda={false}
                    />
                    <Text style={estilos.autorNickComentario}>
                      {c.autorNickname}
                    </Text>
                  </Pressable>
                  <Text style={estilos.conteudoComentario}>{c.conteudo}</Text>
                  {podeApagar && (
                    <Pressable
                      onPress={() => aoDeletarComentario(c)}
                      hitSlop={8}
                      style={estilos.btnDelComentario}
                    >
                      <Ionicons name="trash" size={14} color={cores.erro} />
                    </Pressable>
                  )}
                </Animated.View>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    padding: espacos.lg,
    paddingBottom: espacos.xxl,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: espacos.lg,
  },
  naoEncontrado: {
    color: cores.texto,
    fontSize: fontes.media,
    marginTop: espacos.sm,
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
  cartaoPost: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.lg,
    gap: espacos.sm,
  },
  autor: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
  },
  autorNick: {
    color: cores.texto,
    fontSize: fontes.base,
    fontWeight: "600",
  },
  titulo: {
    color: cores.texto,
    fontSize: fontes.grande,
    fontWeight: "700",
    lineHeight: 28,
    marginTop: espacos.xs,
  },
  conteudo: {
    color: cores.texto,
    fontSize: fontes.media,
    lineHeight: 24,
  },
  btnDeletarPost: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-end",
    marginTop: espacos.sm,
    paddingHorizontal: espacos.sm,
    paddingVertical: espacos.xs,
    borderRadius: raios.pill,
    borderWidth: 1,
    borderColor: cores.erro,
  },
  btnDeletarPostTexto: {
    color: cores.erro,
    fontSize: fontes.pequena,
    fontWeight: "600",
  },
  secaoTitulo: {
    color: cores.primaria,
    fontSize: fontes.pequena,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: espacos.lg,
    marginBottom: espacos.sm,
  },
  cartaoComentar: {
    backgroundColor: cores.superficie,
    borderRadius: raios.medio,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.md,
    marginBottom: espacos.md,
  },
  semComentarios: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    textAlign: "center",
    paddingVertical: espacos.lg,
  },
  cartaoComentario: {
    backgroundColor: cores.superficie,
    borderRadius: raios.medio,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacos.md,
    marginBottom: espacos.sm,
    gap: espacos.xs,
  },
  autorComentario: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.xs,
  },
  autorNickComentario: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    fontWeight: "600",
  },
  conteudoComentario: {
    color: cores.texto,
    fontSize: fontes.base,
    lineHeight: 20,
  },
  btnDelComentario: {
    position: "absolute",
    top: espacos.sm,
    right: espacos.sm,
    padding: 4,
  },
});
