import {
  collection,
  DocumentSnapshot,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type EscopoRanking =
  | { tipo: "global" }
  | { tipo: "universidade"; valor: string }
  | { tipo: "cidade"; valor: string };

export type ItemRanking = {
  uid: string;
  nickname: string;
  pontosTotais: number;
  avatarUrl?: string;
  universidade?: string;
  cidade?: string;
  posicao: number;
};

export type PaginaRanking = {
  itens: ItemRanking[];
  cursor: DocumentSnapshot | null;
  fim: boolean;
};

const TAMANHO_PAGINA = 20;

export async function carregarPaginaRanking(
  cursor: DocumentSnapshot | null,
  posicaoOffset: number,
  escopo: EscopoRanking = { tipo: "global" }
): Promise<PaginaRanking> {
  const ref = collection(db, "users");

  const restricoes: any[] = [orderBy("pontosTotais", "desc"), limit(TAMANHO_PAGINA)];
  if (escopo.tipo === "universidade") {
    restricoes.unshift(where("universidade", "==", escopo.valor));
  } else if (escopo.tipo === "cidade") {
    restricoes.unshift(where("cidade", "==", escopo.valor));
  }
  if (cursor) {
    restricoes.splice(restricoes.length - 1, 0, startAfter(cursor));
  }

  const q = query(ref, ...restricoes);
  const snap = await getDocs(q);
  const itens: ItemRanking[] = snap.docs.map((d, i) => {
    const data = d.data();
    return {
      uid: data.uid ?? d.id,
      nickname: data.nickname ?? "Anônimo",
      pontosTotais: data.pontosTotais ?? 0,
      avatarUrl: data.avatarUrl,
      universidade: data.universidade,
      cidade: data.cidade,
      posicao: posicaoOffset + i + 1,
    };
  });

  return {
    itens,
    cursor: snap.docs[snap.docs.length - 1] ?? null,
    fim: snap.docs.length < TAMANHO_PAGINA,
  };
}
