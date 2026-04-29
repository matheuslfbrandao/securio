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
import Animated, { FadeInUp } from "react-native-reanimated";
import { Botao } from "../../src/components/Botao";
import { Cabecalho } from "../../src/components/Cabecalho";
import { CampoTexto } from "../../src/components/CampoTexto";
import { Tela } from "../../src/components/Tela";
import { enviarParceria } from "../../src/services/parcerias";
import { cores, espacos, fontes, raios } from "../../src/theme";
import { entradaNativa } from "../../src/utils/anim";

function formatarCnpj(s: string): string {
  const v = s.replace(/\D/g, "").slice(0, 14);
  if (v.length <= 2) return v;
  if (v.length <= 5) return `${v.slice(0, 2)}.${v.slice(2)}`;
  if (v.length <= 8) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5)}`;
  if (v.length <= 12)
    return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8)}`;
  return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8, 12)}-${v.slice(12)}`;
}

function formatarTelefone(s: string): string {
  const v = s.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 2) return v;
  if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length <= 10)
    return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
}

export default function Parceiro() {
  const router = useRouter();

  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [contatoNome, setContatoNome] = useState("");
  const [contatoEmail, setContatoEmail] = useState("");
  const [contatoTelefone, setContatoTelefone] = useState("");
  const [proposta, setProposta] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  function validar(): string | null {
    if (
      !empresa.trim() ||
      !cnpj ||
      !contatoNome.trim() ||
      !contatoEmail.trim() ||
      !proposta.trim()
    ) {
      return "Preencha todos os campos obrigatórios.";
    }
    if (cnpj.replace(/\D/g, "").length !== 14) {
      return "CNPJ inválido (14 dígitos).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contatoEmail.trim())) {
      return "E-mail inválido.";
    }
    if (proposta.trim().length < 30) {
      return "Conte-nos um pouco mais sobre sua proposta (mínimo 30 caracteres).";
    }
    return null;
  }

  async function aoEnviar() {
    setErro(null);
    const e = validar();
    if (e) {
      setErro(e);
      return;
    }
    setEnviando(true);
    try {
      await enviarParceria({
        empresa,
        cnpj,
        contatoNome,
        contatoEmail,
        contatoTelefone,
        proposta,
      });
      setEnviado(true);
    } catch (e: any) {
      setErro(e?.message ?? "Erro ao enviar.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <Tela>
        <Cabecalho />
        <ScrollView contentContainerStyle={estilos.scroll}>
          <Animated.View
            entering={entradaNativa(FadeInUp.duration(280))}
            style={estilos.cartaoSucesso}
          >
            <Ionicons name="checkmark-circle" size={72} color={cores.sucesso} />
            <Text style={estilos.tituloSucesso}>Proposta enviada!</Text>
            <Text style={estilos.textoSucesso}>
              Recebemos sua proposta e nossa equipe vai analisar em breve. Você
              receberá um retorno no e-mail{" "}
              <Text style={{ color: cores.primaria, fontWeight: "700" }}>
                {contatoEmail}
              </Text>
              .
            </Text>
            <Botao
              titulo="Voltar para o início"
              onPress={() => router.replace("/(app)/home")}
              style={{ marginTop: espacos.lg, alignSelf: "stretch" }}
            />
          </Animated.View>
        </ScrollView>
      </Tela>
    );
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

          <Animated.View entering={entradaNativa(FadeInUp.duration(280))}>
            <View style={estilos.headerWrap}>
              <Ionicons name="briefcase" size={56} color={cores.primaria} />
              <Text style={estilos.titulo}>Seja um Parceiro</Text>
              <Text style={estilos.subtitulo}>
                Patrocine uma premiação no Securio e tenha sua marca conectada à
                cultura de cibersegurança.
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            entering={entradaNativa(FadeInUp.duration(280).delay(100))}
            style={estilos.cartao}
          >
            <Text style={estilos.secaoTitulo}>Dados da empresa</Text>

            <CampoTexto
              rotulo="Nome da empresa *"
              valor={empresa}
              aoMudar={setEmpresa}
              autoCapitalize="words"
            />
            <CampoTexto
              rotulo="CNPJ *"
              valor={cnpj}
              aoMudar={(t) => setCnpj(formatarCnpj(t))}
              tipoTeclado="numeric"
              maxLength={18}
            />

            <Text style={estilos.secaoTitulo}>Contato</Text>

            <CampoTexto
              rotulo="Nome do responsável *"
              valor={contatoNome}
              aoMudar={setContatoNome}
              autoCapitalize="words"
            />
            <CampoTexto
              rotulo="E-mail *"
              valor={contatoEmail}
              aoMudar={setContatoEmail}
              tipoTeclado="email-address"
            />
            <CampoTexto
              rotulo="Telefone (opcional)"
              valor={contatoTelefone}
              aoMudar={(t) => setContatoTelefone(formatarTelefone(t))}
              tipoTeclado="phone-pad"
              maxLength={15}
            />

            <Text style={estilos.secaoTitulo}>Proposta</Text>

            <CampoTexto
              rotulo="Conte sua ideia de parceria *"
              valor={proposta}
              aoMudar={setProposta}
              autoCapitalize="sentences"
              multiline
              maxLength={1000}
              placeholder="Que tipo de premiação? Por quanto tempo? Qual o público-alvo?"
            />

            {erro && <Text style={estilos.erro}>{erro}</Text>}

            <Botao
              titulo="Enviar proposta"
              onPress={aoEnviar}
              carregando={enviando}
              style={{ marginTop: espacos.sm }}
            />

            <Text style={estilos.aviso}>
              Sua proposta será analisada por nossa equipe. Retornamos no e-mail
              informado em até 7 dias úteis.
            </Text>
          </Animated.View>
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
  headerWrap: {
    alignItems: "center",
    gap: espacos.xs,
    marginBottom: espacos.lg,
  },
  titulo: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
    marginTop: espacos.sm,
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 400,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.lg,
  },
  secaoTitulo: {
    color: cores.primaria,
    fontSize: fontes.pequena,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: espacos.sm,
    marginBottom: espacos.sm,
  },
  erro: {
    color: cores.erro,
    fontSize: fontes.base,
    textAlign: "center",
    marginTop: espacos.sm,
  },
  aviso: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    textAlign: "center",
    marginTop: espacos.md,
    fontStyle: "italic",
    lineHeight: 18,
  },
  cartaoSucesso: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 2,
    borderColor: cores.sucesso,
    padding: espacos.xl,
    alignItems: "center",
    gap: espacos.sm,
    marginTop: espacos.xl,
  },
  tituloSucesso: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
    marginTop: espacos.sm,
  },
  textoSucesso: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    textAlign: "center",
    lineHeight: 22,
  },
});
