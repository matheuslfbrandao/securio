import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { urlAvatarPadrao } from "../data/avatares";
import { DICAS_SEED } from "../data/dicasSeed";
import { PERGUNTAS_SEED } from "../data/perguntasSeed";
import { USUARIOS_SEED } from "../data/usuariosSeed";
import { db } from "./firebase";
import { limparPremiacoesSeed, popularPremiacoes } from "./premiacoes";

const TAMANHO_BATCH = 400;

async function emBatches<T>(
  itens: T[],
  fn: (batch: ReturnType<typeof writeBatch>, item: T) => void
): Promise<number> {
  let processados = 0;
  for (let i = 0; i < itens.length; i += TAMANHO_BATCH) {
    const fatia = itens.slice(i, i + TAMANHO_BATCH);
    const batch = writeBatch(db);
    fatia.forEach((item) => fn(batch, item));
    await batch.commit();
    processados += fatia.length;
  }
  return processados;
}

export async function popularPerguntas(): Promise<number> {
  const agora = Date.now();
  const espacamentoMs = 60 * 60 * 1000;

  return emBatches(PERGUNTAS_SEED, (batch, p) => {
    const i = PERGUNTAS_SEED.indexOf(p);
    const offset = (PERGUNTAS_SEED.length - 1 - i) * espacamentoMs;
    const dataLiberacao = Timestamp.fromMillis(agora - offset);
    const ref = doc(collection(db, "perguntas"));
    batch.set(ref, {
      enunciado: p.enunciado,
      alternativas: p.alternativas,
      indiceCorreto: p.indiceCorreto,
      explicacao: p.explicacao,
      categoria: p.categoria,
      dataLiberacao,
      ehSeed: true,
    });
  });
}

export async function popularUsuarios(): Promise<number> {
  return emBatches(USUARIOS_SEED, (batch, u) => {
    const dados: any = {
      uid: u.uid,
      email: u.email,
      nomeCompleto: u.nickname,
      nickname: u.nickname,
      cpfHash: `seed-${u.uid}`,
      pontosTotais: u.pontosTotais,
      avatarUrl: urlAvatarPadrao(u.nickname),
      papel: "usuario",
      ehDemo: true,
      criadoEm: serverTimestamp(),
    };
    if (u.bio) dados.bio = u.bio;
    if (u.universidade) dados.universidade = u.universidade;
    if (u.cidade) dados.cidade = u.cidade;
    if (u.instagram) dados.instagram = u.instagram;
    if (u.linkedin) dados.linkedin = u.linkedin;
    if (u.github) dados.github = u.github;

    batch.set(doc(db, "users", u.uid), dados);
  });
}

export async function popularDicas(): Promise<number> {
  if (USUARIOS_SEED.length === 0) {
    throw new Error(
      "Antes de popular dicas, popule os usuários demo (eles serão os autores)."
    );
  }
  return emBatches(DICAS_SEED, (batch, dica) => {
    const i = DICAS_SEED.indexOf(dica);
    const autor = USUARIOS_SEED[i % USUARIOS_SEED.length];
    const ref = doc(collection(db, "forumPosts"));
    batch.set(ref, {
      userId: autor.uid,
      autorNickname: autor.nickname,
      autorAvatarUrl: urlAvatarPadrao(autor.nickname),
      titulo: dica.titulo,
      conteudo: dica.conteudo,
      qtdComentarios: 0,
      ehSeed: true,
      criadoEm: serverTimestamp(),
    });
  });
}

async function deletarEmBatches(refs: any[]): Promise<number> {
  let processados = 0;
  for (let i = 0; i < refs.length; i += TAMANHO_BATCH) {
    const fatia = refs.slice(i, i + TAMANHO_BATCH);
    const batch = writeBatch(db);
    fatia.forEach((r) => batch.delete(r));
    await batch.commit();
    processados += fatia.length;
  }
  return processados;
}

export async function limparPerguntasSeed(): Promise<number> {
  const snap = await getDocs(
    query(collection(db, "perguntas"), where("ehSeed", "==", true))
  );
  return deletarEmBatches(snap.docs.map((d) => d.ref));
}

export async function limparTodasPerguntas(): Promise<number> {
  const snap = await getDocs(collection(db, "perguntas"));
  return deletarEmBatches(snap.docs.map((d) => d.ref));
}

export async function limparUsuariosFake(): Promise<number> {
  const idsParaRemover = new Set<string>();
  USUARIOS_SEED.forEach((u) => idsParaRemover.add(u.uid));

  const snap = await getDocs(
    query(collection(db, "users"), where("ehDemo", "==", true))
  );
  snap.docs.forEach((d) => idsParaRemover.add(d.id));

  const refs = Array.from(idsParaRemover).map((id) => doc(db, "users", id));
  return deletarEmBatches(refs);
}

export async function limparDicasSeed(): Promise<number> {
  const snap = await getDocs(
    query(collection(db, "forumPosts"), where("ehSeed", "==", true))
  );

  for (const d of snap.docs) {
    const sub = await getDocs(
      collection(db, "forumPosts", d.id, "comentarios")
    );
    if (sub.docs.length > 0) {
      await deletarEmBatches(sub.docs.map((c) => c.ref));
    }
  }
  return deletarEmBatches(snap.docs.map((d) => d.ref));
}

export async function limparTodosDemos(): Promise<{
  perguntas: number;
  usuarios: number;
  dicas: number;
  premiacoes: number;
}> {
  const [perguntas, usuarios, dicas, premiacoes] = await Promise.all([
    limparPerguntasSeed(),
    limparUsuariosFake(),
    limparDicasSeed(),
    limparPremiacoesSeed(),
  ]);
  return { perguntas, usuarios, dicas, premiacoes };
}

export async function popularTodosDemos(): Promise<{
  usuarios: number;
  perguntas: number;
  dicas: number;
  premiacoes: number;
}> {
  const usuarios = await popularUsuarios();
  const [perguntas, dicas, premiacoes] = await Promise.all([
    popularPerguntas(),
    popularDicas(),
    popularPremiacoes(),
  ]);
  return { usuarios, perguntas, dicas, premiacoes };
}
