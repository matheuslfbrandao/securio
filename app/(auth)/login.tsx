import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Botao } from "../../src/components/Botao";
import { CampoTexto } from "../../src/components/CampoTexto";
import { Logo } from "../../src/components/Logo";
import { Tela } from "../../src/components/Tela";
import { entrar, traduzirErroFirebase } from "../../src/services/auth";
import { cores, espacos, fontes, raios } from "../../src/theme";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function aoEntrar() {
    setErro(null);
    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }
    setCarregando(true);
    try {
      await entrar(email.trim(), senha);
      router.replace("/(app)/home");
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
            <Logo tamanho="grande" />
          </View>

          <View style={estilos.cartao}>
            <Text style={estilos.titulo}>Bem-vindo</Text>

            <CampoTexto
              rotulo="E-mail"
              valor={email}
              aoMudar={setEmail}
              tipoTeclado="email-address"
            />

            <CampoTexto
              rotulo="Senha"
              valor={senha}
              aoMudar={setSenha}
              senha
            />

            {erro && <Text style={estilos.erro}>{erro}</Text>}

            <Botao
              titulo="Entrar"
              onPress={aoEntrar}
              carregando={carregando}
              style={estilos.botao}
            />

            <View style={estilos.links}>
              <Link href="/(auth)/recuperar-senha" style={estilos.link}>
                Esqueci minha senha
              </Link>
              <Link href="/(auth)/cadastro" style={estilos.link}>
                Criar conta
              </Link>
            </View>
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
    paddingTop: espacos.xl,
  },
  titulo: {
    fontSize: fontes.titulo,
    fontWeight: "700",
    color: cores.texto,
    textAlign: "center",
    marginBottom: espacos.lg,
  },
  erro: {
    color: cores.erro,
    fontSize: fontes.base,
    textAlign: "center",
    marginBottom: espacos.sm,
  },
  botao: {
    marginTop: espacos.sm,
  },
  links: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: espacos.lg,
  },
  link: {
    color: cores.texto,
    fontSize: fontes.base,
    fontWeight: "700",
  },
});
