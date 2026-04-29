import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Papel } from "../types";

export type PerfilPublico = {
  uid: string;
  nickname: string;
  nomeCompleto?: string;
  avatarUrl?: string;
  pontosTotais: number;
  papel: Papel;
  bio?: string;
  universidade?: string;
  cidade?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
};

export async function buscarPerfilPublico(uid: string): Promise<PerfilPublico | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    uid: d.uid ?? snap.id,
    nickname: d.nickname ?? "Anônimo",
    nomeCompleto: d.nomeCompleto,
    avatarUrl: d.avatarUrl,
    pontosTotais: d.pontosTotais ?? 0,
    papel: (d.papel as Papel) ?? "usuario",
    bio: d.bio,
    universidade: d.universidade,
    cidade: d.cidade,
    instagram: d.instagram,
    linkedin: d.linkedin,
    github: d.github,
  };
}

export async function calcularPosicaoNoRanking(uid: string, pontos: number): Promise<number> {
  const acima = await getCountFromServer(
    query(collection(db, "users"), where("pontosTotais", ">", pontos))
  );
  return acima.data().count + 1;
}

export async function definirPapel(uid: string, papel: Papel): Promise<void> {
  await updateDoc(doc(db, "users", uid), { papel });
}

export async function listarUniversidades(): Promise<string[]> {
  const snap = await getDocs(
    query(collection(db, "users"), orderBy("universidade"))
  );
  const set = new Set<string>();
  snap.docs.forEach((d) => {
    const u = d.data().universidade;
    if (u && typeof u === "string" && u.trim()) set.add(u.trim());
  });
  return Array.from(set).sort();
}
