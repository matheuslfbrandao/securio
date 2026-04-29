import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
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
import { Tela } from "../../../src/components/Tela";
import { useAuth } from "../../../src/contexts/AuthContext";
import { usePerfil } from "../../../src/contexts/PerfilContext";
import { urlAvatarPadrao } from "../../../src/data/avatares";
import {
  buscarPerfilPublico,
  calcularPosicaoNoRanking,
  definirPapel,
  PerfilPublico,
} from "../../../src/services/usuarios";
import { cores, espacos, fontes, raios } from "../../../src/theme";
import { entradaNativa } from "../../../src/utils/anim";

function abrirLink(url: string) {
  Linking.openURL(url).catch(() => {});
}

export default function UsuarioPublico() {
  const { uid } = useLocalSearchParams<{ uid: string }>();
  const router = useRouter();
  const { usuario } = useAuth();
  const { ehAdmin } = usePerfil();

  const [perfil, setPerfil] = useState<PerfilPublico | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [posicao, setPosicao] = useState<number | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  async function carregar() {
    if (!uid) return;
    setCarregando(true);
    try {
      const p = await buscarPerfilPublico(uid);
      setPerfil(p);
      if (p) {
        const pos = await calcularPosicaoNoRanking(uid, p.pontosTotais);
        setPosicao(pos);
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [uid]);

  async function alterarPapel(novo: "admin" | "usuario") {
    if (!perfil) return;
    setSalvando(true);
    setErro(null);
    setAviso(null);
    try {
      await definirPapel(perfil.uid, novo);
      setAviso(
        novo === "admin"
          ? `${perfil.nickname} agora é admin.`
          : `${perfil.nickname} agora é usuário comum.`
      );
      setPerfil({ ...perfil, papel: novo });
    } catch (e: any) {
      setErro(e?.message ?? "Erro ao alterar papel.");
    } finally {
      setSalvando(false);
    }
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

  if (!perfil) {
    return (
      <Tela>
        <Cabecalho />
        <View style={estilos.centro}>
          <Ionicons name="alert-circle" size={64} color={cores.textoSecundario} />
          <Text style={estilos.tituloErro}>Usuário não encontrado</Text>
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

  const ehProprio = usuario?.uid === perfil.uid;

  return (
    <Tela>
      <Cabecalho />

      <ScrollView contentContainerStyle={estilos.scroll}>
        <Pressable
          onPress={() => router.back()}
          style={estilos.voltar}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={24} color={cores.texto} />
          <Text style={estilos.voltarTexto}>Voltar</Text>
        </Pressable>

        <Animated.View entering={entradaNativa(FadeInUp.duration(280))}>
          <View style={estilos.headerWrap}>
            <Avatar
              url={perfil.avatarUrl ?? urlAvatarPadrao(perfil.nickname)}
              tamanho={96}
              comBorda={false}
            />
            <Text style={estilos.nickname}>{perfil.nickname}</Text>
            {perfil.papel === "admin" && (
              <View style={estilos.tagAdmin}>
                <Ionicons name="key" size={12} color={cores.fundo} />
                <Text style={estilos.tagAdminTexto}>ADMIN</Text>
              </View>
            )}
            {perfil.nomeCompleto && (
              <Text style={estilos.nomeCompleto}>{perfil.nomeCompleto}</Text>
            )}
          </View>

          <View style={estilos.estatisticas}>
            <View style={estilos.estatItem}>
              <Ionicons name="trophy" size={24} color={cores.primaria} />
              <Text style={estilos.estatValor}>{perfil.pontosTotais}</Text>
              <Text style={estilos.estatRotulo}>Pontos</Text>
            </View>
            {posicao && (
              <View style={estilos.estatItem}>
                <Ionicons name="podium" size={24} color={cores.primaria} />
                <Text style={estilos.estatValor}>#{posicao}</Text>
                <Text style={estilos.estatRotulo}>Posição</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {perfil.bio ? (
          <Animated.View
            entering={entradaNativa(FadeInUp.duration(280).delay(100))}
            style={estilos.cartao}
          >
            <Text style={estilos.cartaoTitulo}>Bio</Text>
            <Text style={estilos.bio}>{perfil.bio}</Text>
          </Animated.View>
        ) : null}

        {(perfil.universidade ||
          perfil.cidade ||
          perfil.instagram ||
          perfil.linkedin ||
          perfil.github) && (
          <Animated.View
            entering={entradaNativa(FadeInUp.duration(280).delay(150))}
            style={estilos.cartao}
          >
            <Text style={estilos.cartaoTitulo}>Sobre</Text>

            {perfil.universidade && (
              <Linha icone="school" texto={perfil.universidade} />
            )}
            {perfil.cidade && (
              <Linha icone="location" texto={perfil.cidade} />
            )}
            {perfil.instagram && (
              <Linha
                icone="logo-instagram"
                texto={`@${perfil.instagram}`}
                onPress={() =>
                  abrirLink(`https://instagram.com/${perfil.instagram}`)
                }
              />
            )}
            {perfil.linkedin && (
              <Linha
                icone="logo-linkedin"
                texto={perfil.linkedin}
                onPress={() =>
                  abrirLink(`https://linkedin.com/in/${perfil.linkedin}`)
                }
              />
            )}
            {perfil.github && (
              <Linha
                icone="logo-github"
                texto={perfil.github}
                onPress={() => abrirLink(`https://github.com/${perfil.github}`)}
              />
            )}
          </Animated.View>
        )}

        {ehAdmin && !ehProprio && (
          <Animated.View
            entering={entradaNativa(FadeInUp.duration(280).delay(200))}
            style={[estilos.cartao, estilos.cartaoAdmin]}
          >
            <View style={estilos.adminCabecalho}>
              <Ionicons name="key" size={20} color={cores.primaria} />
              <Text style={estilos.cartaoTitulo}>Ações de admin</Text>
            </View>
            {erro && <Text style={estilos.feedbackErro}>{erro}</Text>}
            {aviso && <Text style={estilos.feedbackSucesso}>{aviso}</Text>}

            {perfil.papel === "admin" ? (
              <Botao
                titulo="Remover de admin"
                variante="secundario"
                onPress={() => alterarPapel("usuario")}
                carregando={salvando}
              />
            ) : (
              <Botao
                titulo="Promover a admin"
                onPress={() => alterarPapel("admin")}
                carregando={salvando}
              />
            )}
          </Animated.View>
        )}

        {ehProprio && (
          <Animated.View
            entering={entradaNativa(FadeInUp.duration(280).delay(200))}
            style={estilos.botaoEditar}
          >
            <Botao
              titulo="Editar meu perfil"
              variante="secundario"
              onPress={() => router.push("/(app)/perfil")}
            />
          </Animated.View>
        )}
      </ScrollView>
    </Tela>
  );
}

function Linha({
  icone,
  texto,
  onPress,
}: {
  icone: keyof typeof Ionicons.glyphMap;
  texto: string;
  onPress?: () => void;
}) {
  const Wrapper: any = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={({ pressed }: { pressed?: boolean }) => [
        estilos.linha,
        pressed && Platform.OS !== "web" && { opacity: 0.6 },
      ]}
    >
      <Ionicons name={icone} size={20} color={cores.primaria} />
      <Text style={estilos.linhaTexto}>{texto}</Text>
      {onPress && (
        <Ionicons
          name="open-outline"
          size={16}
          color={cores.textoSecundario}
        />
      )}
    </Wrapper>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: espacos.lg,
  },
  tituloErro: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
    marginTop: espacos.md,
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
  headerWrap: {
    alignItems: "center",
    gap: espacos.xs,
    paddingVertical: espacos.lg,
  },
  nickname: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
    marginTop: espacos.sm,
  },
  nomeCompleto: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
  },
  tagAdmin: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: cores.primaria,
    paddingHorizontal: espacos.sm,
    paddingVertical: 3,
    borderRadius: raios.pill,
    marginTop: 4,
  },
  tagAdminTexto: {
    color: cores.fundo,
    fontSize: fontes.pequena,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  estatisticas: {
    flexDirection: "row",
    backgroundColor: cores.primariaFraca,
    borderRadius: raios.medio,
    padding: espacos.md,
    marginVertical: espacos.md,
    justifyContent: "space-around",
  },
  estatItem: {
    alignItems: "center",
    gap: 2,
  },
  estatValor: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
  },
  estatRotulo: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.lg,
    marginBottom: espacos.md,
  },
  cartaoAdmin: {
    borderColor: cores.primaria,
  },
  adminCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.xs,
    marginBottom: espacos.sm,
  },
  cartaoTitulo: {
    color: cores.primaria,
    fontSize: fontes.media,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: espacos.sm,
  },
  bio: {
    color: cores.texto,
    fontSize: fontes.base,
    lineHeight: 22,
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
    paddingVertical: espacos.sm,
  },
  linhaTexto: {
    color: cores.texto,
    fontSize: fontes.base,
    flex: 1,
  },
  feedbackErro: {
    color: cores.erro,
    fontSize: fontes.base,
    marginBottom: espacos.sm,
  },
  feedbackSucesso: {
    color: cores.sucesso,
    fontSize: fontes.base,
    marginBottom: espacos.sm,
    fontWeight: "700",
  },
  botaoEditar: {
    marginTop: espacos.sm,
  },
});
