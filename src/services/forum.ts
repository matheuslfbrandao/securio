import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type ForumPost = {
  id: string;
  userId: string;
  autorNickname: string;
  autorAvatarUrl?: string;
  titulo: string;
  conteudo: string;
  qtdComentarios: number;
  criadoEm?: Timestamp;
};

export type ForumComentario = {
  id: string;
  userId: string;
  autorNickname: string;
  autorAvatarUrl?: string;
  conteudo: string;
  criadoEm?: Timestamp;
};

const TAMANHO_PAGINA = 15;

export async function listarPosts(
  cursor: DocumentSnapshot | null
): Promise<{ posts: ForumPost[]; cursor: DocumentSnapshot | null; fim: boolean }> {
  const ref = collection(db, "forumPosts");
  const q = cursor
    ? query(ref, orderBy("criadoEm", "desc"), startAfter(cursor), limit(TAMANHO_PAGINA))
    : query(ref, orderBy("criadoEm", "desc"), limit(TAMANHO_PAGINA));

  const snap = await getDocs(q);
  const posts = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ForumPost, "id">),
  }));
  return {
    posts,
    cursor: snap.docs[snap.docs.length - 1] ?? null,
    fim: snap.docs.length < TAMANHO_PAGINA,
  };
}

export async function buscarPost(id: string): Promise<ForumPost | null> {
  const snap = await getDoc(doc(db, "forumPosts", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<ForumPost, "id">) };
}

export async function criarPost(args: {
  userId: string;
  autorNickname: string;
  autorAvatarUrl?: string;
  titulo: string;
  conteudo: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, "forumPosts"), {
    userId: args.userId,
    autorNickname: args.autorNickname,
    autorAvatarUrl: args.autorAvatarUrl ?? "",
    titulo: args.titulo.trim(),
    conteudo: args.conteudo.trim(),
    qtdComentarios: 0,
    criadoEm: serverTimestamp(),
  });
  return ref.id;
}

export async function deletarPost(id: string): Promise<void> {
  const subSnap = await getDocs(collection(db, "forumPosts", id, "comentarios"));
  for (const c of subSnap.docs) {
    await deleteDoc(c.ref);
  }
  await deleteDoc(doc(db, "forumPosts", id));
}

export async function listarComentarios(
  postId: string
): Promise<ForumComentario[]> {
  const snap = await getDocs(
    query(
      collection(db, "forumPosts", postId, "comentarios"),
      orderBy("criadoEm", "asc")
    )
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ForumComentario, "id">),
  }));
}

export async function comentar(args: {
  postId: string;
  userId: string;
  autorNickname: string;
  autorAvatarUrl?: string;
  conteudo: string;
}): Promise<string> {
  const ref = await addDoc(
    collection(db, "forumPosts", args.postId, "comentarios"),
    {
      userId: args.userId,
      autorNickname: args.autorNickname,
      autorAvatarUrl: args.autorAvatarUrl ?? "",
      conteudo: args.conteudo.trim(),
      criadoEm: serverTimestamp(),
    }
  );
  await updateDoc(doc(db, "forumPosts", args.postId), {
    qtdComentarios: increment(1),
  });
  return ref.id;
}

export async function deletarComentario(
  postId: string,
  comentarioId: string
): Promise<void> {
  await deleteDoc(doc(db, "forumPosts", postId, "comentarios", comentarioId));
  await updateDoc(doc(db, "forumPosts", postId), {
    qtdComentarios: increment(-1),
  });
}

export async function listarPostsDoUsuario(
  userId: string
): Promise<ForumPost[]> {
  const snap = await getDocs(
    query(
      collection(db, "forumPosts"),
      where("userId", "==", userId),
      orderBy("criadoEm", "desc")
    )
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ForumPost, "id">),
  }));
}
