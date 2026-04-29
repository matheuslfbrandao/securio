import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Avatar } from "../../src/components/Avatar";
import { Botao } from "../../src/components/Botao";
import { Cabecalho } from "../../src/components/Cabecalho";
import { CampoTexto } from "../../src/components/CampoTexto";
import { Tela } from "../../src/components/Tela";
import { usePerfil } from "../../src/contexts/PerfilContext";
import { urlAvatarPadrao } from "../../src/data/avatares";
import {
  AdminItem,
  definirPapelPorNickname,
  listarAdmins,
} from "../../src/services/admins";
import { db } from "../../src/services/firebase";
import {
  deletarPost,
  ForumPost,
  listarPosts,
} from "../../src/services/forum";
import {
  atualizarStatusParceria,
  deletarParceria,
  listarParcerias,
  Parceria,
} from "../../src/services/parcerias";
import {
  concluirPremiacao,
  criarPremiacao,
  deletarPremiacao,
  limparPremiacoesSeed,
  listarPremiacoes,
  popularPremiacoes,
  Premiacao,
} from "../../src/services/premiacoes";
import {
  limparDicasSeed,
  limparPerguntasSeed,
  limparTodasPerguntas,
  limparTodosDemos,
  limparUsuariosFake,
  popularDicas,
  popularPerguntas,
  popularTodosDemos,
  popularUsuarios,
} from "../../src/services/seed";
import { cores, espacos, fontes, raios } from "../../src/theme";
import { entradaNativa } from "../../src/utils/anim";

type AbaId = "seeds" | "admins" | "parcerias" | "premiacoes" | "perguntas" | "forum";

const ABAS: Array<{ id: AbaId; label: string; icone: keyof typeof Ionicons.glyphMap }> = [
  { id: "seeds", label: "Dados demo", icone: "flask" },
  { id: "admins", label: "Admins", icone: "key" },
  { id: "parcerias", label: "Parcerias", icone: "briefcase" },
  { id: "premiacoes", label: "Premiações", icone: "ribbon" },
  { id: "perguntas", label: "Perguntas", icone: "help-circle" },
  { id: "forum", label: "Fórum", icone: "chatbubbles" },
];

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

export default function Admin() {
  const router = useRouter();
  const { perfil, ehAdmin, carregando: perfilCarregando } = usePerfil();

  const [aba, setAba] = useState<AbaId>("seeds");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  function feedback(tipo: "sucesso" | "erro", msg: string) {
    if (tipo === "sucesso") {
      setAviso(msg);
      setErro(null);
    } else {
      setErro(msg);
      setAviso(null);
    }
  }

  if (perfilCarregando) {
    return (
      <Tela>
        <Cabecalho />
      </Tela>
    );
  }

  if (!ehAdmin) {
    return (
      <Tela>
        <Cabecalho />
        <View style={estilos.acessoNegado}>
          <Ionicons name="lock-closed" size={64} color={cores.erro} />
          <Text style={estilos.tituloNegado}>Acesso restrito</Text>
          <Text style={estilos.descNegado}>
            O Painel Admin é exclusivo para administradores. Peça a um admin
            existente que promova sua conta usando seu nickname.
          </Text>
          <Text style={estilos.dicaSetup}>
            Primeiro setup: o primeiro admin é definido manualmente no Firebase
            Console (campo{" "}
            <Text style={{ color: cores.primaria }}>papel: "admin"</Text> no
            documento do usuário em{" "}
            <Text style={{ color: cores.primaria }}>users/</Text>).
          </Text>
          <Botao
            titulo="Voltar"
            variante="secundario"
            onPress={() => router.back()}
            style={{ marginTop: espacos.lg }}
          />
        </View>
      </Tela>
    );
  }

  return (
    <Tela>
      <Cabecalho />

      <View style={estilos.cabecalhoTela}>
        <Pressable
          onPress={() => router.back()}
          style={estilos.voltar}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={24} color={cores.texto} />
          <Text style={estilos.voltarTexto}>Voltar</Text>
        </Pressable>

        <View style={estilos.tituloLinha}>
          <Ionicons name="key" size={26} color={cores.primaria} />
          <Text style={estilos.titulo}>Painel Admin</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.tabsScroll}
        style={estilos.tabsContainer}
      >
        {ABAS.map((a) => {
          const ativa = a.id === aba;
          return (
            <Pressable
              key={a.id}
              onPress={() => setAba(a.id)}
              style={[estilos.tab, ativa && estilos.tabAtiva]}
            >
              <Ionicons
                name={a.icone}
                size={16}
                color={ativa ? cores.fundo : cores.textoSecundario}
              />
              <Text style={[estilos.tabTexto, ativa && estilos.tabTextoAtiva]}>
                {a.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {erro && (
        <View style={[estilos.feedback, estilos.feedbackErro]}>
          <Ionicons name="alert-circle" size={18} color={cores.erro} />
          <Text style={estilos.feedbackTexto}>{erro}</Text>
        </View>
      )}
      {aviso && (
        <View style={[estilos.feedback, estilos.feedbackSucesso]}>
          <Ionicons name="checkmark-circle" size={18} color={cores.sucesso} />
          <Text style={estilos.feedbackTexto}>{aviso}</Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <Animated.View key={aba} entering={entradaNativa(FadeIn.duration(200))}>
            {aba === "seeds" && <AbaSeeds feedback={feedback} />}
            {aba === "admins" && (
              <AbaAdmins feedback={feedback} perfilUid={perfil?.uid} />
            )}
            {aba === "parcerias" && <AbaParcerias feedback={feedback} />}
            {aba === "premiacoes" && <AbaPremiacoes feedback={feedback} />}
            {aba === "perguntas" && <AbaPerguntas feedback={feedback} />}
            {aba === "forum" && <AbaForum feedback={feedback} />}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Tela>
  );
}

// ===================== Aba: Seeds =====================
function AbaSeeds({
  feedback,
}: {
  feedback: (t: "sucesso" | "erro", m: string) => void;
}) {
  const [populandoTudo, setPopulandoTudo] = useState(false);
  const [populandoP, setPopulandoP] = useState(false);
  const [populandoU, setPopulandoU] = useState(false);
  const [populandoD, setPopulandoD] = useState(false);
  const [populandoPrem, setPopulandoPrem] = useState(false);

  const [limpandoTudo, setLimpandoTudo] = useState(false);
  const [limpandoPS, setLimpandoPS] = useState(false);
  const [limpandoPT, setLimpandoPT] = useState(false);
  const [limpandoU, setLimpandoU] = useState(false);
  const [limpandoD, setLimpandoD] = useState(false);
  const [limpandoPrem, setLimpandoPrem] = useState(false);

  async function rodar(
    setter: (b: boolean) => void,
    fn: () => Promise<number>,
    okMsg: (n: number) => string,
    errMsg: string
  ) {
    setter(true);
    try {
      const n = await fn();
      feedback("sucesso", okMsg(n));
    } catch (e: any) {
      feedback("erro", e?.message ?? errMsg);
    } finally {
      setter(false);
    }
  }

  async function rodarComConfirma(
    setter: (b: boolean) => void,
    fn: () => Promise<number>,
    okMsg: (n: number) => string,
    errMsg: string,
    titulo: string,
    msg: string
  ) {
    const ok = await confirmar(titulo, msg);
    if (!ok) return;
    return rodar(setter, fn, okMsg, errMsg);
  }

  async function popularTudo() {
    setPopulandoTudo(true);
    try {
      const r = await popularTodosDemos();
      feedback(
        "sucesso",
        `${r.usuarios} usuários, ${r.perguntas} perguntas, ${r.dicas} dicas e ${r.premiacoes} premiações inseridas!`
      );
    } catch (e: any) {
      feedback("erro", e?.message ?? "Erro ao popular.");
    } finally {
      setPopulandoTudo(false);
    }
  }

  async function limparTudo() {
    const ok = await confirmar(
      "Limpar TODOS os dados demo",
      "Remove usuários, perguntas, dicas e premiações inseridos pelos botões 'Popular'. Dados criados manualmente (perguntas/premiações suas e usuários reais cadastrados) ficam intactos."
    );
    if (!ok) return;
    setLimpandoTudo(true);
    try {
      const r = await limparTodosDemos();
      feedback(
        "sucesso",
        `Removidos: ${r.usuarios} usuários, ${r.perguntas} perguntas, ${r.dicas} dicas, ${r.premiacoes} premiações.`
      );
    } catch (e: any) {
      feedback("erro", e?.message ?? "Erro ao limpar.");
    } finally {
      setLimpandoTudo(false);
    }
  }

  return (
    <>
      <View style={estilos.cartao}>
        <Text style={estilos.secaoTitulo}>Popular tudo de uma vez</Text>
        <Text style={estilos.secaoDesc}>
          Atalho: insere 300 usuários (com cidade, universidade, redes sociais),
          50 perguntas, 12 dicas no fórum e 3 premiações de uma única ação.
        </Text>
        <Botao
          titulo="Popular TODOS dados demo"
          onPress={popularTudo}
          carregando={populandoTudo}
        />
      </View>

      <View style={estilos.cartao}>
        <Text style={estilos.secaoTitulo}>Popular individual</Text>

        <Botao
          titulo="Popular 300 usuários"
          variante="secundario"
          onPress={() =>
            rodar(
              setPopulandoU,
              popularUsuarios,
              (n) => `${n} usuários demo inseridos!`,
              "Erro ao popular usuários."
            )
          }
          carregando={populandoU}
          style={{ marginBottom: espacos.sm }}
        />
        <Botao
          titulo="Popular 50 perguntas"
          variante="secundario"
          onPress={() =>
            rodar(
              setPopulandoP,
              popularPerguntas,
              (n) => `${n} perguntas inseridas!`,
              "Erro ao popular perguntas."
            )
          }
          carregando={populandoP}
          style={{ marginBottom: espacos.sm }}
        />
        <Botao
          titulo="Popular 12 dicas no fórum"
          variante="secundario"
          onPress={() =>
            rodar(
              setPopulandoD,
              popularDicas,
              (n) => `${n} dicas inseridas no fórum!`,
              "Erro ao popular dicas."
            )
          }
          carregando={populandoD}
          style={{ marginBottom: espacos.sm }}
        />
        <Botao
          titulo="Popular 3 premiações"
          variante="secundario"
          onPress={() =>
            rodar(
              setPopulandoPrem,
              popularPremiacoes,
              (n) => `${n} premiações inseridas!`,
              "Erro ao popular premiações."
            )
          }
          carregando={populandoPrem}
        />
      </View>

      <View style={[estilos.cartao, estilos.cartaoPerigo]}>
        <View style={estilos.secaoCabecalho}>
          <Ionicons name="trash" size={18} color={cores.erro} />
          <Text style={[estilos.secaoTitulo, { color: cores.erro }]}>
            Zona de perigo
          </Text>
        </View>
        <Text style={estilos.secaoDesc}>
          Remove dados. Ações não podem ser desfeitas.
        </Text>

        <Botao
          titulo="Limpar TODOS dados demo"
          onPress={limparTudo}
          carregando={limpandoTudo}
          style={{ marginBottom: espacos.md }}
        />

        <Botao
          titulo="Limpar usuários demo"
          variante="secundario"
          onPress={() =>
            rodarComConfirma(
              setLimpandoU,
              limparUsuariosFake,
              (n) => `${n} usuários demo removidos.`,
              "Erro ao limpar.",
              "Limpar usuários demo",
              "Remove os usuários fake. Não afeta cadastros reais."
            )
          }
          carregando={limpandoU}
          style={{ marginBottom: espacos.sm }}
        />
        <Botao
          titulo="Limpar perguntas demo"
          variante="secundario"
          onPress={() =>
            rodarComConfirma(
              setLimpandoPS,
              limparPerguntasSeed,
              (n) => `${n} perguntas demo removidas.`,
              "Erro ao limpar.",
              "Limpar perguntas demo",
              "Remove apenas perguntas inseridas via 'Popular'. Suas perguntas manuais ficam."
            )
          }
          carregando={limpandoPS}
          style={{ marginBottom: espacos.sm }}
        />
        <Botao
          titulo="Limpar dicas demo"
          variante="secundario"
          onPress={() =>
            rodarComConfirma(
              setLimpandoD,
              limparDicasSeed,
              (n) => `${n} dicas demo removidas.`,
              "Erro ao limpar.",
              "Limpar dicas demo",
              "Remove apenas dicas inseridas via 'Popular'. Posts manuais ficam."
            )
          }
          carregando={limpandoD}
          style={{ marginBottom: espacos.sm }}
        />
        <Botao
          titulo="Limpar premiações demo"
          variante="secundario"
          onPress={() =>
            rodarComConfirma(
              setLimpandoPrem,
              limparPremiacoesSeed,
              (n) => `${n} premiações demo removidas.`,
              "Erro ao limpar.",
              "Limpar premiações demo",
              "Remove apenas premiações inseridas via 'Popular'. Premiações manuais ficam."
            )
          }
          carregando={limpandoPrem}
          style={{ marginBottom: espacos.sm }}
        />
        <Botao
          titulo="Limpar TODAS perguntas (zerar)"
          variante="secundario"
          onPress={() =>
            rodarComConfirma(
              setLimpandoPT,
              limparTodasPerguntas,
              (n) => `${n} perguntas removidas.`,
              "Erro ao limpar.",
              "Limpar TODAS perguntas",
              "Remove todas as perguntas, incluindo as criadas manualmente."
            )
          }
          carregando={limpandoPT}
        />
      </View>
    </>
  );
}

// ===================== Aba: Admins =====================
function AbaAdmins({
  feedback,
  perfilUid,
}: {
  feedback: (t: "sucesso" | "erro", m: string) => void;
  perfilUid?: string;
}) {
  const [admins, setAdmins] = useState<AdminItem[] | null>(null);
  const [novoNick, setNovoNick] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    try {
      setAdmins(await listarAdmins());
    } catch {
      setAdmins([]);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function aoPromover() {
    if (!novoNick.trim()) {
      feedback("erro", "Digite o nickname do usuário.");
      return;
    }
    setSalvando(true);
    try {
      const r = await definirPapelPorNickname(novoNick, "admin");
      feedback("sucesso", `${r.nickname} agora é admin.`);
      setNovoNick("");
      carregar();
    } catch (e: any) {
      feedback("erro", e?.message ?? "Erro ao promover.");
    } finally {
      setSalvando(false);
    }
  }

  async function aoDemover(item: AdminItem) {
    if (item.uid === perfilUid) {
      feedback("erro", "Você não pode remover seu próprio acesso.");
      return;
    }
    const ok = await confirmar(
      "Remover admin",
      `Remover privilégios de admin de ${item.nickname}?`
    );
    if (!ok) return;
    try {
      await definirPapelPorNickname(item.nickname, "usuario");
      feedback("sucesso", `${item.nickname} agora é usuário comum.`);
      carregar();
    } catch (e: any) {
      feedback("erro", e?.message ?? "Erro ao remover.");
    }
  }

  return (
    <View style={estilos.cartao}>
      <Text style={estilos.secaoTitulo}>Administradores ({admins?.length ?? 0})</Text>
      <Text style={estilos.secaoDesc}>
        Admins têm acesso a este painel e podem moderar todo o conteúdo.
      </Text>

      {admins === null ? (
        <Text style={estilos.dica}>Carregando...</Text>
      ) : admins.length === 0 ? (
        <Text style={estilos.dica}>Nenhum admin além de você.</Text>
      ) : (
        <View style={{ gap: espacos.xs, marginBottom: espacos.md }}>
          {admins.map((a) => (
            <View key={a.uid} style={estilos.itemPrem}>
              <View style={{ flex: 1 }}>
                <Text style={estilos.itemPremTitulo}>
                  {a.nickname}
                  {a.uid === perfilUid && (
                    <Text style={estilos.tagVoce}> • você</Text>
                  )}
                </Text>
                <Text style={estilos.itemPremMeta}>{a.email}</Text>
              </View>
              {a.uid !== perfilUid && (
                <Pressable
                  onPress={() => aoDemover(a)}
                  hitSlop={10}
                  style={estilos.btnAcao}
                >
                  <Ionicons name="remove-circle" size={22} color={cores.erro} />
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}

      <CampoTexto
        rotulo="Nickname para promover"
        valor={novoNick}
        aoMudar={setNovoNick}
        placeholder="Ex: NomeDaProfessora"
      />
      <Botao
        titulo="Promover a admin"
        onPress={aoPromover}
        carregando={salvando}
        style={{ marginTop: espacos.sm }}
      />
    </View>
  );
}

// ===================== Aba: Parcerias =====================
function AbaParcerias({
  feedback,
}: {
  feedback: (t: "sucesso" | "erro", m: string) => void;
}) {
  const [parcerias, setParcerias] = useState<Parceria[]>([]);

  async function carregar() {
    try {
      setParcerias(await listarParcerias());
    } catch {
      setParcerias([]);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function mudarStatus(p: Parceria, status: "aprovada" | "rejeitada") {
    try {
      await atualizarStatusParceria(p.id, status);
      feedback(
        "sucesso",
        status === "aprovada"
          ? `Parceria com ${p.empresa} aprovada.`
          : `Parceria com ${p.empresa} rejeitada.`
      );
      carregar();
    } catch (e: any) {
      feedback("erro", e?.message ?? "Erro.");
    }
  }

  async function excluir(p: Parceria) {
    const ok = await confirmar(
      "Excluir parceria",
      `Excluir proposta de ${p.empresa}?`
    );
    if (!ok) return;
    try {
      await deletarParceria(p.id);
      feedback("sucesso", "Parceria excluída.");
      carregar();
    } catch (e: any) {
      feedback("erro", e?.message ?? "Erro.");
    }
  }

  return (
    <View style={estilos.cartao}>
      <Text style={estilos.secaoTitulo}>
        Propostas de parceria ({parcerias.length})
      </Text>
      <Text style={estilos.secaoDesc}>
        Empresas que enviaram proposta via formulário "Seja um Parceiro".
      </Text>

      {parcerias.length === 0 ? (
        <Text style={estilos.dica}>Nenhuma proposta recebida.</Text>
      ) : (
        <View style={{ gap: espacos.sm }}>
          {parcerias.map((p) => (
            <View key={p.id} style={estilos.itemPrem}>
              <View style={{ flex: 1 }}>
                <View style={estilos.itemPremCabec}>
                  <View
                    style={[
                      estilos.statusDot,
                      p.status === "aprovada"
                        ? { backgroundColor: cores.sucesso }
                        : p.status === "rejeitada"
                        ? { backgroundColor: cores.erro }
                        : { backgroundColor: cores.aviso },
                    ]}
                  />
                  <Text style={estilos.itemPremTitulo} numberOfLines={1}>
                    {p.empresa}
                  </Text>
                </View>
                <Text style={estilos.itemPremMeta}>
                  {p.contatoNome} • {p.contatoEmail}
                </Text>
                <Text style={estilos.itemPremMeta}>Status: {p.status}</Text>
                <Text
                  style={[estilos.itemPremMeta, { marginTop: 4 }]}
                  numberOfLines={3}
                >
                  "{p.proposta}"
                </Text>
              </View>
              <View style={estilos.itemPremAcoes}>
                {p.status === "pendente" && (
                  <>
                    <Pressable
                      onPress={() => mudarStatus(p, "aprovada")}
                      hitSlop={8}
                      style={estilos.btnAcao}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={cores.sucesso}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => mudarStatus(p, "rejeitada")}
                      hitSlop={8}
                      style={estilos.btnAcao}
                    >
                      <Ionicons name="close-circle" size={22} color={cores.erro} />
                    </Pressable>
                  </>
                )}
                <Pressable
                  onPress={() => excluir(p)}
                  hitSlop={8}
                  style={estilos.btnAcao}
                >
                  <Ionicons name="trash" size={20} color={cores.erro} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ===================== Aba: Premiações =====================
function AbaPremiacoes({
  feedback,
}: {
  feedback: (t: "sucesso" | "erro", m: string) => void;
}) {
  const [premiacoes, setPremiacoes] = useState<Premiacao[]>([]);
  const [titulo, setTitulo] = useState("");
  const [patrocinador, setPatrocinador] = useState("");
  const [premio, setPremio] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dias, setDias] = useState("7");
  const [criando, setCriando] = useState(false);

  async function carregar() {
    try {
      const r = await listarPremiacoes();
      setPremiacoes([...r.andamento, ...r.concluidas]);
    } catch {
      setPremiacoes([]);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criar() {
    const d = parseInt(dias, 10);
    if (!titulo.trim() || !patrocinador.trim() || !premio.trim()) {
      feedback("erro", "Preencha título, patrocinador e prêmio.");
      return;
    }
    if (isNaN(d) || d <= 0) {
      feedback("erro", "Dias até encerrar inválido.");
      return;
    }
    setCriando(true);
    try {
      const prazo = new Date();
      prazo.setDate(prazo.getDate() + d);
      await criarPremiacao({ titulo, patrocinador, premio, descricao, prazo });
      setTitulo("");
      setPatrocinador("");
      setPremio("");
      setDescricao("");
      setDias("7");
      feedback("sucesso", "Premiação criada!");
      carregar();
    } catch (e: any) {
      feedback("erro", e?.message ?? "Erro.");
    } finally {
      setCriando(false);
    }
  }

  async function concluir(p: Premiacao) {
    if (Platform.OS === "web") {
      const entrada = window.prompt(
        `Concluir "${p.titulo}"\n\nDigite os nicknames dos vencedores separados por vírgula:`
      );
      if (!entrada) return;
      const v = entrada
        .split(",")
        .map((n) => ({ nickname: n.trim(), uid: "" }))
        .filter((x) => x.nickname);
      if (v.length === 0) return;
      try {
        await concluirPremiacao(p.id, v);
        feedback("sucesso", "Premiação concluída!");
        carregar();
      } catch (e: any) {
        feedback("erro", e?.message ?? "Erro.");
      }
    } else {
      Alert.alert(
        "Concluir premiação",
        "Use a versão web para adicionar vencedores."
      );
    }
  }

  async function excluir(p: Premiacao) {
    const ok = await confirmar("Excluir premiação", `Excluir "${p.titulo}"?`);
    if (!ok) return;
    try {
      await deletarPremiacao(p.id);
      feedback("sucesso", "Premiação excluída.");
      carregar();
    } catch (e: any) {
      feedback("erro", e?.message ?? "Erro.");
    }
  }

  return (
    <>
      <View style={estilos.cartao}>
        <Text style={estilos.secaoTitulo}>Criar premiação</Text>
        <CampoTexto rotulo="Título" valor={titulo} aoMudar={setTitulo} autoCapitalize="sentences" />
        <CampoTexto rotulo="Patrocinador" valor={patrocinador} aoMudar={setPatrocinador} autoCapitalize="words" />
        <CampoTexto rotulo="Prêmio" valor={premio} aoMudar={setPremio} autoCapitalize="sentences" />
        <CampoTexto rotulo="Descrição (opcional)" valor={descricao} aoMudar={setDescricao} autoCapitalize="sentences" multiline />
        <CampoTexto rotulo="Dias até encerrar" valor={dias} aoMudar={(t) => setDias(t.replace(/\D/g, ""))} tipoTeclado="numeric" maxLength={3} />
        <Botao titulo="Criar" onPress={criar} carregando={criando} style={{ marginTop: espacos.sm }} />
      </View>

      {premiacoes.length > 0 && (
        <View style={estilos.cartao}>
          <Text style={estilos.secaoTitulo}>Existentes ({premiacoes.length})</Text>
          <View style={{ gap: espacos.xs }}>
            {premiacoes.map((p) => (
              <View key={p.id} style={estilos.itemPrem}>
                <View style={{ flex: 1 }}>
                  <View style={estilos.itemPremCabec}>
                    <View
                      style={[
                        estilos.statusDot,
                        p.status === "andamento"
                          ? { backgroundColor: cores.primaria }
                          : { backgroundColor: cores.textoSecundario },
                      ]}
                    />
                    <Text style={estilos.itemPremTitulo} numberOfLines={1}>{p.titulo}</Text>
                  </View>
                  <Text style={estilos.itemPremMeta}>
                    {p.patrocinador} • {p.status === "andamento" ? "em andamento" : "concluída"}
                  </Text>
                </View>
                <View style={estilos.itemPremAcoes}>
                  {p.status === "andamento" && (
                    <Pressable onPress={() => concluir(p)} hitSlop={8} style={estilos.btnAcao}>
                      <Ionicons name="checkmark-circle" size={22} color={cores.sucesso} />
                    </Pressable>
                  )}
                  <Pressable onPress={() => excluir(p)} hitSlop={8} style={estilos.btnAcao}>
                    <Ionicons name="trash" size={20} color={cores.erro} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  );
}

// ===================== Aba: Perguntas =====================
function AbaPerguntas({
  feedback,
}: {
  feedback: (t: "sucesso" | "erro", m: string) => void;
}) {
  const [enunciado, setEnunciado] = useState("");
  const [categoria, setCategoria] = useState("");
  const [explicacao, setExplicacao] = useState("");
  const [alternativas, setAlternativas] = useState(["", "", "", ""]);
  const [indiceCorreto, setIndiceCorreto] = useState(0);
  const [liberarAgora, setLiberarAgora] = useState(true);
  const [salvando, setSalvando] = useState(false);

  function atualizarAlt(i: number, v: string) {
    setAlternativas((p) => p.map((a, idx) => (idx === i ? v : a)));
  }

  function limpar() {
    setEnunciado("");
    setCategoria("");
    setExplicacao("");
    setAlternativas(["", "", "", ""]);
    setIndiceCorreto(0);
    setLiberarAgora(true);
  }

  async function salvar() {
    if (!enunciado.trim() || !categoria.trim() || !explicacao.trim()) {
      feedback("erro", "Preencha enunciado, categoria e explicação.");
      return;
    }
    if (alternativas.some((a) => !a.trim())) {
      feedback("erro", "Preencha todas as 4 alternativas.");
      return;
    }
    setSalvando(true);
    try {
      const dataLiberacao = liberarAgora
        ? Timestamp.now()
        : Timestamp.fromDate((() => {
            const d = new Date();
            d.setHours(12, 0, 0, 0);
            if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
            return d;
          })());
      await addDoc(collection(db, "perguntas"), {
        enunciado: enunciado.trim(),
        categoria: categoria.trim(),
        explicacao: explicacao.trim(),
        alternativas: alternativas.map((a) => a.trim()),
        indiceCorreto,
        dataLiberacao,
      });
      feedback("sucesso", "Pergunta criada!");
      limpar();
    } catch (e: any) {
      feedback("erro", e?.message ?? "Erro.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={estilos.cartao}>
      <Text style={estilos.secaoTitulo}>Criar pergunta manual</Text>
      <CampoTexto rotulo="Enunciado" valor={enunciado} aoMudar={setEnunciado} autoCapitalize="sentences" multiline />
      <CampoTexto rotulo="Categoria" valor={categoria} aoMudar={setCategoria} placeholder="Ex: phishing, senhas, LGPD" />

      <Text style={estilos.subSecao}>Alternativas</Text>
      <Text style={estilos.dica}>Marque a bolinha da alternativa correta.</Text>

      {alternativas.map((alt, i) => (
        <View key={i} style={estilos.linhaAlt}>
          <Pressable
            onPress={() => setIndiceCorreto(i)}
            style={[estilos.bolinha, indiceCorreto === i && estilos.bolinhaAtiva]}
            hitSlop={10}
          >
            {indiceCorreto === i && <View style={estilos.bolinhaInner} />}
          </Pressable>
          <View style={{ flex: 1 }}>
            <CampoTexto
              rotulo={`Alternativa ${String.fromCharCode(65 + i)}`}
              valor={alt}
              aoMudar={(t) => atualizarAlt(i, t)}
              autoCapitalize="sentences"
            />
          </View>
        </View>
      ))}

      <CampoTexto rotulo="Explicação" valor={explicacao} aoMudar={setExplicacao} autoCapitalize="sentences" multiline />

      <Pressable onPress={() => setLiberarAgora(!liberarAgora)} style={estilos.toggleLinha}>
        <View style={[estilos.caixa, liberarAgora && estilos.caixaMarcada]}>
          {liberarAgora && <Ionicons name="checkmark" size={16} color={cores.textoEscuro} />}
        </View>
        <Text style={estilos.toggleTexto}>Liberar imediatamente</Text>
      </Pressable>
      <Text style={estilos.toggleDesc}>Desmarque para liberar no próximo meio-dia.</Text>

      <Botao titulo="Salvar pergunta" onPress={salvar} carregando={salvando} style={{ marginTop: espacos.md }} />
    </View>
  );
}

// ===================== Aba: Fórum =====================
function AbaForum({
  feedback,
}: {
  feedback: (t: "sucesso" | "erro", m: string) => void;
}) {
  const router = useRouter();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    setCarregando(true);
    try {
      const r = await listarPosts(null);
      setPosts(r.posts);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function excluirPost(p: ForumPost) {
    const ok = await confirmar(
      "Excluir publicação",
      `Excluir "${p.titulo}" e todos seus comentários? Esta ação é irreversível.`
    );
    if (!ok) return;
    try {
      await deletarPost(p.id);
      feedback("sucesso", "Publicação excluída.");
      carregar();
    } catch (e: any) {
      feedback("erro", e?.message ?? "Erro.");
    }
  }

  return (
    <View style={estilos.cartao}>
      <View style={estilos.secaoCabecalho}>
        <Ionicons name="shield-checkmark" size={18} color={cores.primaria} />
        <Text style={estilos.secaoTitulo}>Moderação do fórum</Text>
      </View>
      <Text style={estilos.secaoDesc}>
        Lista todos os posts. Clique para abrir, ou use o botão de lixeira para
        moderar. Comentários são moderados pela tela do post.
      </Text>

      {carregando ? (
        <Text style={estilos.dica}>Carregando...</Text>
      ) : posts.length === 0 ? (
        <Text style={estilos.dica}>Nenhuma publicação no fórum ainda.</Text>
      ) : (
        <View style={{ gap: espacos.xs }}>
          {posts.map((p) => (
            <View key={p.id} style={estilos.itemPrem}>
              <Avatar
                url={p.autorAvatarUrl || urlAvatarPadrao(p.autorNickname)}
                tamanho={32}
                comBorda={false}
              />
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(app)/dicas/[id]",
                    params: { id: p.id },
                  })
                }
                style={{ flex: 1 }}
              >
                <Text style={estilos.itemPremTitulo} numberOfLines={1}>
                  {p.titulo}
                </Text>
                <Text style={estilos.itemPremMeta}>
                  {p.autorNickname} • {p.qtdComentarios}{" "}
                  {p.qtdComentarios === 1 ? "comentário" : "comentários"}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => excluirPost(p)}
                hitSlop={8}
                style={estilos.btnAcao}
              >
                <Ionicons name="trash" size={20} color={cores.erro} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ===================== Estilos =====================
const estilos = StyleSheet.create({
  flex: { flex: 1 },
  conteudo: {
    padding: espacos.lg,
    paddingTop: espacos.sm,
    paddingBottom: espacos.xxl,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  cabecalhoTela: {
    paddingHorizontal: espacos.lg,
    paddingTop: espacos.xs,
  },
  voltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: espacos.sm,
  },
  voltarTexto: {
    color: cores.texto,
    fontSize: fontes.base,
    fontWeight: "600",
  },
  tituloLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
    marginBottom: espacos.sm,
  },
  titulo: {
    fontSize: fontes.titulo,
    fontWeight: "700",
    color: cores.texto,
  },
  tabsContainer: {
    maxHeight: 50,
    flexGrow: 0,
  },
  tabsScroll: {
    paddingHorizontal: espacos.lg,
    gap: espacos.xs,
    paddingVertical: espacos.xs,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: espacos.md,
    paddingVertical: 8,
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
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.lg,
    marginBottom: espacos.md,
  },
  cartaoPerigo: {
    borderColor: cores.erro,
  },
  secaoCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.xs,
    marginBottom: espacos.xs,
  },
  secaoTitulo: {
    color: cores.primaria,
    fontSize: fontes.media,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: espacos.sm,
  },
  secaoDesc: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    lineHeight: 20,
    marginBottom: espacos.md,
  },
  subSecao: {
    color: cores.texto,
    fontSize: fontes.base,
    fontWeight: "700",
    marginTop: espacos.sm,
  },
  dica: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    marginBottom: espacos.sm,
  },
  linhaAlt: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: espacos.sm,
  },
  bolinha: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: cores.borda,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  bolinhaAtiva: {
    borderColor: cores.primaria,
  },
  bolinhaInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: cores.primaria,
  },
  toggleLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
    marginTop: espacos.md,
  },
  caixa: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: cores.primaria,
    alignItems: "center",
    justifyContent: "center",
  },
  caixaMarcada: {
    backgroundColor: cores.primaria,
  },
  toggleTexto: {
    color: cores.texto,
    fontSize: fontes.base,
    fontWeight: "600",
  },
  toggleDesc: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    marginLeft: 30,
    marginTop: 2,
  },
  feedback: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
    paddingHorizontal: espacos.md,
    paddingVertical: espacos.sm,
    borderRadius: raios.medio,
    marginHorizontal: espacos.lg,
    marginVertical: espacos.xs,
  },
  feedbackErro: {
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderWidth: 1,
    borderColor: cores.erro,
  },
  feedbackSucesso: {
    backgroundColor: "rgba(39, 174, 96, 0.15)",
    borderWidth: 1,
    borderColor: cores.sucesso,
  },
  feedbackTexto: {
    flex: 1,
    color: cores.texto,
    fontSize: fontes.base,
    fontWeight: "600",
  },
  acessoNegado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: espacos.xl,
    gap: espacos.sm,
  },
  tituloNegado: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
    marginTop: espacos.md,
  },
  descNegado: {
    color: cores.textoSecundario,
    fontSize: fontes.media,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 360,
  },
  dicaSetup: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 360,
    marginTop: espacos.md,
    fontStyle: "italic",
  },
  itemPrem: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
    backgroundColor: cores.superficieSolida,
    borderRadius: raios.medio,
    padding: espacos.md,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  itemPremCabec: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemPremTitulo: {
    color: cores.texto,
    fontSize: fontes.media,
    fontWeight: "700",
    flex: 1,
  },
  itemPremMeta: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    marginTop: 2,
  },
  itemPremAcoes: {
    flexDirection: "row",
    gap: espacos.xs,
  },
  btnAcao: {
    padding: espacos.xs,
  },
  tagVoce: {
    color: cores.primaria,
    fontSize: fontes.pequena,
    fontWeight: "700",
  },
});
