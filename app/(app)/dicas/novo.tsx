import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Botao } from "../../../src/components/Botao";
import { Cabecalho } from "../../../src/components/Cabecalho";
import { CampoTexto } from "../../../src/components/CampoTexto";
import { Tela } from "../../../src/components/Tela";
import { useAuth } from "../../../src/contexts/AuthContext";
import { usePerfil } from "../../../src/contexts/PerfilContext";
import { criarPost } from "../../../src/services/forum";
import { cores, espacos, fontes, raios } from "../../../src/theme";

export default function NovoPost() {
  const router = useRouter();
  const { usuario } = useAuth();
  const { perfil } = usePerfil();

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function aoPublicar() {
    setErro(null);
    if (!titulo.trim() || !conteudo.trim()) {
      setErro("Preencha título e conteúdo.");
      return;
    }
    if (titulo.trim().length < 5) {
      setErro("Título muito curto.");
      return;
    }
    if (conteudo.trim().length < 20) {
      setErro("Conteúdo muito curto (mínimo 20 caracteres).");
      return;
    }
    if (!usuario || !perfil) return;

    setEnviando(true);
    try {
      const id = await criarPost({
        userId: usuario.uid,
        autorNickname: perfil.nickname,
        autorAvatarUrl: perfil.avatarUrl,
        titulo,
        conteudo,
      });
      router.replace({
        pathname: "/(app)/dicas/[id]",
        params: { id },
      });
    } catch (e: any) {
      setErro(e?.message ?? "Erro ao publicar.");
    } finally {
      setEnviando(false);
    }
  }

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

          <Text style={estilos.titulo}>Nova dica</Text>
          <Text style={estilos.subtitulo}>
            Compartilhe uma dica de segurança digital com a comunidade.
          </Text>

          <View style={estilos.cartao}>
            <CampoTexto
              rotulo="Título"
              valor={titulo}
              aoMudar={setTitulo}
              autoCapitalize="sentences"
              maxLength={120}
              placeholder="Ex: Como criar senhas fortes que você lembra"
            />
            <CampoTexto
              rotulo="Conteúdo"
              valor={conteudo}
              aoMudar={setConteudo}
              autoCapitalize="sentences"
              multiline
              maxLength={2000}
              placeholder="Conte sua dica em detalhes. Use exemplos e fontes se possível."
            />

            {erro && <Text style={estilos.erro}>{erro}</Text>}

            <Botao
              titulo="Publicar"
              onPress={aoPublicar}
              carregando={enviando}
              style={{ marginTop: espacos.sm }}
            />
          </View>
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
  titulo: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    marginTop: 2,
    marginBottom: espacos.lg,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.lg,
  },
  erro: {
    color: cores.erro,
    fontSize: fontes.base,
    textAlign: "center",
    marginTop: espacos.sm,
  },
});
