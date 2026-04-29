import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Avatar } from "../../src/components/Avatar";
import { Botao } from "../../src/components/Botao";
import { Cabecalho } from "../../src/components/Cabecalho";
import { CampoTexto } from "../../src/components/CampoTexto";
import { Tela } from "../../src/components/Tela";
import { useAuth } from "../../src/contexts/AuthContext";
import { usePerfil } from "../../src/contexts/PerfilContext";
import { AVATARES_DISPONIVEIS } from "../../src/data/avatares";
import { atualizarAvatar, atualizarPerfil, sair } from "../../src/services/auth";
import {
  agendarLembreteDiario,
  cancelarLembrete,
  lembreteEstaAgendado,
  pedirPermissaoENotificar,
} from "../../src/services/notificacoes";
import { cores, espacos, fontes, raios } from "../../src/theme";

function alerta(titulo: string, mensagem: string) {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

export default function Perfil() {
  const router = useRouter();
  const { perfil, carregando, ehAdmin } = usePerfil();
  const { usuario } = useAuth();

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [universidade, setUniversidade] = useState("");
  const [cidade, setCidade] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAvatar, setModalAvatar] = useState(false);
  const [trocandoAvatar, setTrocandoAvatar] = useState(false);

  const [notifAtivada, setNotifAtivada] = useState(false);
  const [salvandoNotif, setSalvandoNotif] = useState(false);

  useEffect(() => {
    lembreteEstaAgendado()
      .then(setNotifAtivada)
      .catch(() => setNotifAtivada(false));
  }, []);

  async function aoAlternarNotif() {
    setSalvandoNotif(true);
    try {
      if (notifAtivada) {
        await cancelarLembrete();
        setNotifAtivada(false);
        alerta("Pronto", "Lembretes diários desativados.");
      } else {
        const r = await pedirPermissaoENotificar();
        if (!r.ok) {
          alerta("Não foi possível ativar", r.motivo ?? "Erro desconhecido.");
          return;
        }
        await agendarLembreteDiario();
        setNotifAtivada(true);
        alerta(
          "Lembrete ativado!",
          "Você receberá uma notificação todo dia às 12h quando uma nova pergunta for liberada."
        );
      }
    } catch (e: any) {
      alerta("Erro", e?.message ?? "Falha ao alterar notificações.");
    } finally {
      setSalvandoNotif(false);
    }
  }

  useEffect(() => {
    if (perfil) {
      setNomeCompleto(perfil.nomeCompleto ?? "");
      setNickname(perfil.nickname);
      setBio(perfil.bio ?? "");
      setUniversidade(perfil.universidade ?? "");
      setCidade(perfil.cidade ?? "");
      setInstagram(perfil.instagram ?? "");
      setLinkedin(perfil.linkedin ?? "");
      setGithub(perfil.github ?? "");
    }
  }, [perfil]);

  function aoCancelar() {
    if (perfil) {
      setNomeCompleto(perfil.nomeCompleto ?? "");
      setNickname(perfil.nickname);
      setBio(perfil.bio ?? "");
      setUniversidade(perfil.universidade ?? "");
      setCidade(perfil.cidade ?? "");
      setInstagram(perfil.instagram ?? "");
      setLinkedin(perfil.linkedin ?? "");
      setGithub(perfil.github ?? "");
    }
    setErro(null);
    setEditando(false);
  }

  async function aoSalvar() {
    if (!perfil || !usuario) return;
    setErro(null);

    if (!nomeCompleto.trim() || !nickname.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (nomeCompleto.trim().split(" ").length < 2) {
      setErro("Informe seu nome completo (nome e sobrenome).");
      return;
    }
    if (nickname.trim().length < 3) {
      setErro("Nickname deve ter ao menos 3 caracteres.");
      return;
    }

    setSalvando(true);
    try {
      await atualizarPerfil(
        usuario.uid,
        {
          nomeCompleto: nomeCompleto.trim(),
          nickname: nickname.trim(),
          bio,
          universidade,
          cidade,
          instagram,
          linkedin,
          github,
        },
        perfil.nickname
      );
      setEditando(false);
      alerta("Pronto!", "Perfil atualizado com sucesso.");
    } catch (e: any) {
      setErro(e?.message ?? "Erro ao atualizar perfil.");
    } finally {
      setSalvando(false);
    }
  }

  async function aoTrocarAvatar(url: string) {
    if (!usuario) return;
    setTrocandoAvatar(true);
    try {
      await atualizarAvatar(usuario.uid, url);
      setModalAvatar(false);
    } catch (e: any) {
      alerta("Erro", e?.message ?? "Erro ao trocar avatar.");
    } finally {
      setTrocandoAvatar(false);
    }
  }

  async function aoSair() {
    if (Platform.OS === "web") {
      const ok = window.confirm("Deseja realmente sair?");
      if (ok) await sair();
      return;
    }
    Alert.alert("Sair", "Deseja realmente sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => sair() },
    ]);
  }

  if (carregando || !perfil) {
    return (
      <Tela>
        <View style={estilos.centro}>
          <ActivityIndicator size="large" color={cores.primaria} />
        </View>
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
            onPress={() => setModalAvatar(true)}
            style={estilos.avatarWrap}
          >
            <Avatar url={perfil.avatarUrl} tamanho={120} comBorda={false} />
            <View style={estilos.editarAvatarBadge}>
              <Ionicons name="camera" size={18} color={cores.fundo} />
            </View>
          </Pressable>

          <View style={estilos.cartao}>
            <Text style={estilos.titulo}>Meu perfil</Text>

            {ehAdmin && (
              <View style={estilos.tagAdmin}>
                <Ionicons name="key" size={14} color={cores.fundo} />
                <Text style={estilos.tagAdminTexto}>ADMIN</Text>
              </View>
            )}

            <CampoTexto
              rotulo="Nome Completo"
              valor={nomeCompleto}
              aoMudar={setNomeCompleto}
              autoCapitalize="words"
              editavel={editando}
            />
            <CampoTexto
              rotulo="Nickname"
              valor={nickname}
              aoMudar={setNickname}
              maxLength={20}
              editavel={editando}
            />
            <CampoTexto
              rotulo="E-mail"
              valor={perfil.email}
              aoMudar={() => {}}
              editavel={false}
            />

            <Text style={estilos.secao}>Sobre você</Text>

            <CampoTexto
              rotulo="Bio (opcional)"
              valor={bio}
              aoMudar={setBio}
              editavel={editando}
              multiline
              autoCapitalize="sentences"
              placeholder="Algo curto sobre você"
              maxLength={140}
            />
            <CampoTexto
              rotulo="Universidade (opcional)"
              valor={universidade}
              aoMudar={setUniversidade}
              editavel={editando}
              autoCapitalize="words"
              placeholder="Ex: USP, UFMG, PUC-SP"
            />
            <CampoTexto
              rotulo="Cidade (opcional)"
              valor={cidade}
              aoMudar={setCidade}
              editavel={editando}
              autoCapitalize="words"
              placeholder="Ex: São Paulo, Belo Horizonte"
            />
            <CampoTexto
              rotulo="Instagram (opcional)"
              valor={instagram}
              aoMudar={setInstagram}
              editavel={editando}
              placeholder="seu_usuario (sem @)"
            />
            <CampoTexto
              rotulo="LinkedIn (opcional)"
              valor={linkedin}
              aoMudar={setLinkedin}
              editavel={editando}
              placeholder="seu-perfil"
            />
            <CampoTexto
              rotulo="GitHub (opcional)"
              valor={github}
              aoMudar={setGithub}
              editavel={editando}
              placeholder="seu-usuario"
            />

            <View style={estilos.estatisticas}>
              <View style={estilos.estatItem}>
                <Ionicons name="trophy" size={28} color={cores.primaria} />
                <Text style={estilos.estatValor}>{perfil.pontosTotais}</Text>
                <Text style={estilos.estatRotulo}>Pontos totais</Text>
              </View>
            </View>

            {erro && <Text style={estilos.erro}>{erro}</Text>}

            {editando ? (
              <View style={estilos.botoes}>
                <Botao
                  titulo="Cancelar"
                  variante="secundario"
                  onPress={aoCancelar}
                  desabilitado={salvando}
                  style={{ flex: 1 }}
                />
                <Botao
                  titulo="Salvar"
                  onPress={aoSalvar}
                  carregando={salvando}
                  style={{ flex: 1 }}
                />
              </View>
            ) : (
              <Botao
                titulo="Atualizar Perfil"
                onPress={() => setEditando(true)}
                style={{ marginTop: espacos.md }}
              />
            )}

            <View style={estilos.notifBox}>
              <View style={estilos.notifLinha}>
                <Ionicons
                  name={notifAtivada ? "notifications" : "notifications-off"}
                  size={22}
                  color={notifAtivada ? cores.primaria : cores.textoSecundario}
                />
                <View style={{ flex: 1 }}>
                  <Text style={estilos.notifTitulo}>Lembrete do quiz diário</Text>
                  <Text style={estilos.notifDesc}>
                    {notifAtivada
                      ? "Você receberá um aviso todo dia às 12h."
                      : "Receba um aviso quando uma pergunta nova for liberada."}
                  </Text>
                </View>
              </View>
              <Botao
                titulo={notifAtivada ? "Desativar" : "Ativar"}
                variante="secundario"
                onPress={aoAlternarNotif}
                carregando={salvandoNotif}
                style={{ marginTop: espacos.sm }}
              />
            </View>

            <Botao
              titulo="Sair da conta"
              variante="fantasma"
              onPress={aoSair}
              style={{ marginTop: espacos.sm }}
            />
          </View>

          <Pressable
            onPress={() => router.push("/(app)/admin")}
            style={estilos.linkAdmin}
            hitSlop={10}
          >
            <Ionicons name="key-outline" size={14} color={cores.textoSecundario} />
            <Text style={estilos.linkAdminTexto}>Painel admin</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={modalAvatar}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAvatar(false)}
      >
        <Pressable
          style={estilos.modalFundo}
          onPress={() => !trocandoAvatar && setModalAvatar(false)}
        >
          <Pressable style={estilos.modalCartao} onPress={(e) => e.stopPropagation()}>
            <Text style={estilos.modalTitulo}>Escolha um avatar</Text>
            <Text style={estilos.modalDesc}>
              Toque em um avatar para definir como o seu.
            </Text>

            <View style={estilos.grade}>
              {AVATARES_DISPONIVEIS.map((a) => {
                const ativo = perfil.avatarUrl === a.url;
                return (
                  <Pressable
                    key={a.id}
                    onPress={() => !trocandoAvatar && aoTrocarAvatar(a.url)}
                    style={[estilos.opcaoAvatar, ativo && estilos.opcaoAvatarAtiva]}
                  >
                    <Avatar url={a.url} tamanho={64} comBorda={false} />
                  </Pressable>
                );
              })}
            </View>

            <Botao
              titulo="Fechar"
              variante="secundario"
              onPress={() => setModalAvatar(false)}
              desabilitado={trocandoAvatar}
              style={{ marginTop: espacos.md }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    padding: espacos.lg,
    paddingBottom: espacos.xxl,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: cores.primaria,
    alignSelf: "center",
    marginBottom: -50,
    zIndex: 2,
    borderWidth: 4,
    borderColor: cores.fundoEscuro,
    overflow: "visible",
  },
  editarAvatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: cores.primaria,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: cores.fundoEscuro,
    zIndex: 3,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.lg,
    paddingTop: 70,
  },
  titulo: {
    fontSize: fontes.titulo,
    fontWeight: "700",
    color: cores.texto,
    textAlign: "center",
    marginBottom: espacos.xs,
  },
  tagAdmin: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: cores.primaria,
    paddingHorizontal: espacos.sm,
    paddingVertical: 4,
    borderRadius: raios.pill,
    alignSelf: "center",
    marginBottom: espacos.lg,
  },
  tagAdminTexto: {
    color: cores.fundo,
    fontSize: fontes.pequena,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  secao: {
    color: cores.primaria,
    fontSize: fontes.pequena,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: espacos.md,
    marginBottom: espacos.sm,
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
    gap: 4,
  },
  estatValor: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
  },
  estatRotulo: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
  },
  erro: {
    color: cores.erro,
    fontSize: fontes.base,
    textAlign: "center",
    marginBottom: espacos.sm,
  },
  botoes: {
    flexDirection: "row",
    gap: espacos.sm,
    marginTop: espacos.md,
  },
  notifBox: {
    backgroundColor: cores.superficieSolida,
    borderRadius: raios.medio,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacos.md,
    marginTop: espacos.md,
  },
  notifLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
  },
  notifTitulo: {
    color: cores.texto,
    fontSize: fontes.base,
    fontWeight: "700",
  },
  notifDesc: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    marginTop: 2,
    lineHeight: 16,
  },
  linkAdmin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: espacos.lg,
    opacity: 0.6,
  },
  linkAdminTexto: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(6, 24, 38, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    padding: espacos.lg,
  },
  modalCartao: {
    backgroundColor: cores.fundoEscuro,
    borderRadius: raios.grande,
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    padding: espacos.lg,
    width: "100%",
    maxWidth: 480,
  },
  modalTitulo: {
    color: cores.texto,
    fontSize: fontes.titulo,
    fontWeight: "700",
    textAlign: "center",
  },
  modalDesc: {
    color: cores.textoSecundario,
    fontSize: fontes.base,
    textAlign: "center",
    marginTop: espacos.xs,
    marginBottom: espacos.lg,
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacos.sm,
    justifyContent: "center",
  },
  opcaoAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.superficie,
    overflow: "hidden",
  },
  opcaoAvatarAtiva: {
    borderColor: cores.primaria,
    shadowColor: cores.primaria,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
});
