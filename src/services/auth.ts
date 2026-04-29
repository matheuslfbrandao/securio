import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { hashCpf } from "../utils/hashCpf";

export type DadosCadastro = {
  email: string;
  senha: string;
  nomeCompleto: string;
  nickname: string;
  cpf: string;
};

export async function cadastrar(dados: DadosCadastro): Promise<User> {
  const cpfHashed = await hashCpf(dados.cpf);

  const cpfExiste = await getDocs(
    query(collection(db, "users"), where("cpfHash", "==", cpfHashed))
  );
  if (!cpfExiste.empty) {
    throw new Error("Este CPF já está cadastrado.");
  }

  const nickExiste = await getDocs(
    query(collection(db, "users"), where("nickname", "==", dados.nickname))
  );
  if (!nickExiste.empty) {
    throw new Error("Este nickname já está em uso.");
  }

  const credential = await createUserWithEmailAndPassword(
    auth,
    dados.email,
    dados.senha
  );

  await updateProfile(credential.user, { displayName: dados.nickname });

  await setDoc(doc(db, "users", credential.user.uid), {
    uid: credential.user.uid,
    email: dados.email,
    nomeCompleto: dados.nomeCompleto,
    nickname: dados.nickname,
    cpfHash: cpfHashed,
    pontosTotais: 0,
    papel: "usuario",
    criadoEm: serverTimestamp(),
  });

  return credential.user;
}

export type DadosAtualizacao = {
  nomeCompleto: string;
  nickname: string;
  bio?: string;
  universidade?: string;
  cidade?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
};

export async function atualizarAvatar(uid: string, avatarUrl: string): Promise<void> {
  await updateDoc(doc(db, "users", uid), { avatarUrl });
}

function limparHandle(s: string | undefined): string {
  if (!s) return "";
  return s.trim().replace(/^@+/, "");
}

export async function atualizarPerfil(
  uid: string,
  dados: DadosAtualizacao,
  nicknameAnterior: string
): Promise<void> {
  const u = auth.currentUser;
  if (!u) throw new Error("Sessão expirada. Entre novamente.");

  if (dados.nickname !== nicknameAnterior) {
    const conflito = await getDocs(
      query(collection(db, "users"), where("nickname", "==", dados.nickname))
    );
    if (!conflito.empty) {
      throw new Error("Este nickname já está em uso.");
    }
  }

  await updateDoc(doc(db, "users", uid), {
    nomeCompleto: dados.nomeCompleto,
    nickname: dados.nickname,
    bio: (dados.bio ?? "").trim(),
    universidade: (dados.universidade ?? "").trim(),
    cidade: (dados.cidade ?? "").trim(),
    instagram: limparHandle(dados.instagram),
    linkedin: limparHandle(dados.linkedin),
    github: limparHandle(dados.github),
  });

  await updateProfile(u, { displayName: dados.nickname });
}

export async function buscarPerfil(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as {
    uid: string;
    email: string;
    nomeCompleto: string;
    nickname: string;
    cpfHash: string;
    pontosTotais: number;
    criadoEm: any;
  };
}

export async function entrar(email: string, senha: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, senha);
  return credential.user;
}

export async function sair(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function recuperarSenha(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export function traduzirErroFirebase(codigo: string): string {
  const mapa: Record<string, string> = {
    "auth/invalid-email": "E-mail inválido.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/weak-password": "A senha deve ter ao menos 6 caracteres.",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente em alguns minutos.",
    "auth/network-request-failed": "Sem conexão com a internet.",
  };
  return mapa[codigo] ?? "Ocorreu um erro inesperado. Tente novamente.";
}
