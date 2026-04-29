import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
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
import { Caixa } from "../../src/components/Caixa";
import { CampoTexto } from "../../src/components/CampoTexto";
import { Logo } from "../../src/components/Logo";
import { Tela } from "../../src/components/Tela";
import { cadastrar, traduzirErroFirebase } from "../../src/services/auth";
import { cores, espacos, fontes, raios } from "../../src/theme";
import { formatarCpf, validarCpf } from "../../src/utils/validarCpf";

export default function Cadastro() {
  const router = useRouter();
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nickname, setNickname] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  function validar(): string | null {
    if (
      !nomeCompleto.trim() ||
      !nickname.trim() ||
      !email.trim() ||
      !cpf ||
      !senha
    ) {
      return "Preencha todos os campos.";
    }
    if (nomeCompleto.trim().split(" ").length < 2) {
      return "Informe seu nome completo (nome e sobrenome).";
    }
    if (nickname.trim().length < 3) {
      return "Nickname deve ter ao menos 3 caracteres.";
    }
    if (!validarCpf(cpf)) {
      return "CPF inválido.";
    }
    if (senha.length < 6) {
      return "A senha deve ter ao menos 6 caracteres.";
    }
    if (senha !== confirmaSenha) {
      return "As senhas não coincidem.";
    }
    if (!aceitouTermos) {
      return "Você precisa concordar com os termos para prosseguir.";
    }
    return null;
  }

  async function aoCadastrar() {
    setErro(null);
    const erroValidacao = validar();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }
    setCarregando(true);
    try {
      await cadastrar({
        email: email.trim().toLowerCase(),
        senha,
        nomeCompleto: nomeCompleto.trim(),
        nickname: nickname.trim(),
        cpf,
      });
      router.replace("/(app)/home");
    } catch (e: any) {
      setErro(
        e?.code ? traduzirErroFirebase(e.code) : e?.message ?? "Erro ao cadastrar."
      );
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
              <Text style={estilos.titulo}>Cadastro</Text>
            </View>

            <CampoTexto
              rotulo="Nome Completo"
              valor={nomeCompleto}
              aoMudar={setNomeCompleto}
              autoCapitalize="words"
            />

            <CampoTexto
              rotulo="Nickname"
              valor={nickname}
              aoMudar={setNickname}
              maxLength={20}
            />

            <CampoTexto
              rotulo="CPF"
              valor={cpf}
              aoMudar={(t) => setCpf(formatarCpf(t))}
              tipoTeclado="numeric"
              maxLength={14}
            />

            <CampoTexto
              rotulo="E-mail"
              valor={email}
              aoMudar={setEmail}
              tipoTeclado="email-address"
            />

            <CampoTexto rotulo="Senha" valor={senha} aoMudar={setSenha} senha />

            <CampoTexto
              rotulo="Confirmar senha"
              valor={confirmaSenha}
              aoMudar={setConfirmaSenha}
              senha
            />

            <View style={estilos.termos}>
              <Caixa
                marcado={aceitouTermos}
                aoMudar={setAceitouTermos}
                rotuloComponente={
                  <Text style={estilos.textoTermos}>
                    Concordo com os{" "}
                    <Text style={estilos.linkTermos}>termos e políticas</Text>.
                  </Text>
                }
              />
            </View>

            {erro && <Text style={estilos.erro}>{erro}</Text>}

            <Botao
              titulo="Cadastrar"
              onPress={aoCadastrar}
              carregando={carregando}
              style={estilos.botao}
            />

            <View style={estilos.rodape}>
              <Text style={estilos.textoRodape}>Já tem conta?</Text>
              <Link href="/(auth)/login" style={estilos.linkDestaque}>
                Entrar
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
    padding: espacos.lg,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
  },
  cabecalho: {
    alignItems: "center",
    marginVertical: espacos.lg,
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
    marginBottom: espacos.lg,
  },
  titulo: {
    fontSize: fontes.titulo,
    fontWeight: "700",
    color: cores.texto,
  },
  termos: {
    marginVertical: espacos.md,
  },
  textoTermos: {
    color: cores.texto,
    fontSize: fontes.base,
    flex: 1,
    fontWeight: "600",
  },
  linkTermos: {
    color: cores.primaria,
    fontWeight: "700",
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
  rodape: {
    marginTop: espacos.lg,
    flexDirection: "row",
    justifyContent: "center",
    gap: espacos.xs,
  },
  textoRodape: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
  },
  linkDestaque: {
    color: cores.primaria,
    fontSize: fontes.base,
    fontWeight: "700",
  },
});
