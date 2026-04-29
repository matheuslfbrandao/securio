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
import { Botao } from "../../src/components/Botao";
import { CampoTexto } from "../../src/components/CampoTexto";
import { Logo } from "../../src/components/Logo";
import { Tela } from "../../src/components/Tela";
import { recuperarSenha, traduzirErroFirebase } from "../../src/services/auth";
import { cores, espacos, fontes, raios } from "../../src/theme";

export default function RecuperarSenha() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function aoEnviar() {
    setErro(null);
    if (!email.trim()) {
      setErro("Informe seu e-mail.");
      return;
    }
    setCarregando(true);
    try {
      await recuperarSenha(email.trim().toLowerCase());
      setSucesso(true);
    } catch (e: any) {
      setErro(traduzirErroFirebase(e?.code ?? ""));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Tela>
      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={estilos.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={estilos.cabecalho}>
            <Logo tamanho="medio" />
          </View>

          <View style={estilos.cartao}>
            <View style={estilos.tituloLinha}>
              <Pressable onPress={() => router.back()} hitSlop={10}>
                <Ionicons name="arrow-back" size={24} color={cores.texto} />
              </Pressable>
              <Text style={estilos.titulo}>Recuperar senha</Text>
            </View>

            {sucesso ? (
              <View style={estilos.sucessoBox}>
                <Ionicons
                  name="checkmark-circle"
                  size={48}
                  color={cores.primaria}
                  style={{ alignSelf: "center", marginBottom: espacos.sm }}
                />
                <Text style={estilos.sucessoTitulo}>E-mail enviado!</Text>
                <Text style={estilos.sucessoTexto}>
                  Verifique sua caixa de entrada (e a pasta de spam) e clique no
                  link recebido para redefinir sua senha.
                </Text>
                <Botao
                  titulo="Voltar para o login"
                  onPress={() => router.replace("/(auth)/login")}
                  style={{ marginTop: espacos.lg }}
                />
              </View>
            ) : (
              <>
                <Text style={estilos.subtitulo}>
                  Digite seu e-mail cadastrado. Enviaremos um link com instruções
                  para redefinir sua senha.
                </Text>

                <CampoTexto
                  rotulo="E-mail"
                  valor={email}
                  aoMudar={setEmail}
                  tipoTeclado="email-address"
                />

                {erro && <Text style={estilos.erro}>{erro}</Text>}

                <Botao
                  titulo="Enviar"
                  onPress={aoEnviar}
                  carregando={carregando}
                  style={{ marginTop: espacos.sm }}
                />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: espacos.lg,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
  },
  cabecalho: {
    alignItems: "center",
    marginBottom: espacos.xl,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.lg,
  },
  tituloLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.md,
    marginBottom: espacos.md,
  },
  titulo: {
    fontSize: fontes.titulo,
    fontWeight: "700",
    color: cores.texto,
  },
  subtitulo: {
    fontSize: fontes.base,
    color: cores.textoSecundario,
    marginBottom: espacos.lg,
    lineHeight: 20,
  },
  erro: {
    color: cores.erro,
    fontSize: fontes.base,
    textAlign: "center",
    marginBottom: espacos.sm,
  },
  sucessoBox: {
    paddingVertical: espacos.md,
  },
  sucessoTitulo: {
    color: cores.primaria,
    fontSize: fontes.grande,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: espacos.sm,
  },
  sucessoTexto: {
    color: cores.texto,
    fontSize: fontes.base,
    lineHeight: 22,
    textAlign: "center",
  },
});
