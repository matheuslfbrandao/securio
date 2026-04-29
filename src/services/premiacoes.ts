import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type StatusPremiacao = "andamento" | "concluida";

export type Premiacao = {
  id: string;
  titulo: string;
  patrocinador: string;
  premio: string;
  descricao?: string;
  prazo: Timestamp;
  status: StatusPremiacao;
  vencedores?: string[];
  vencedoresUids?: string[];
  ehSeed?: boolean;
  criadoEm?: Timestamp;
};

export type DadosCriarPremiacao = {
  titulo: string;
  patrocinador: string;
  premio: string;
  descricao?: string;
  prazo: Date;
};

export async function listarPremiacoes(): Promise<{
  andamento: Premiacao[];
  concluidas: Premiacao[];
}> {
  const snap = await getDocs(
    query(collection(db, "premiacoes"), orderBy("criadoEm", "desc"))
  );
  const todas: Premiacao[] = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Premiacao, "id">),
  }));
  return {
    andamento: todas.filter((p) => p.status === "andamento"),
    concluidas: todas.filter((p) => p.status === "concluida"),
  };
}

export async function criarPremiacao(
  dados: DadosCriarPremiacao
): Promise<string> {
  const ref = await addDoc(collection(db, "premiacoes"), {
    titulo: dados.titulo.trim(),
    patrocinador: dados.patrocinador.trim(),
    premio: dados.premio.trim(),
    descricao: dados.descricao?.trim() ?? "",
    prazo: Timestamp.fromDate(dados.prazo),
    status: "andamento",
    criadoEm: serverTimestamp(),
  });
  return ref.id;
}

export async function concluirPremiacao(
  id: string,
  vencedores: { nickname: string; uid: string }[]
): Promise<void> {
  await updateDoc(doc(db, "premiacoes", id), {
    status: "concluida",
    vencedores: vencedores.map((v) => v.nickname),
    vencedoresUids: vencedores.map((v) => v.uid),
  });
}

export async function deletarPremiacao(id: string): Promise<void> {
  await deleteDoc(doc(db, "premiacoes", id));
}

export async function limparPremiacoesSeed(): Promise<number> {
  const snap = await getDocs(
    query(collection(db, "premiacoes"), where("ehSeed", "==", true))
  );
  let n = 0;
  for (const d of snap.docs) {
    await deleteDoc(d.ref);
    n++;
  }
  return n;
}

const PREMIACOES_DEMO: Array<
  Omit<Premiacao, "id" | "criadoEm"> & { offsetDias: number }
> = [
  {
    titulo: "Pix de R$ 100 — Top 1 mensal",
    patrocinador: "Securio",
    premio: "R$ 100,00 via Pix",
    descricao:
      "O usuário que terminar o mês com mais pontos no ranking leva. Empate decidido pelo menor tempo médio de resposta.",
    status: "andamento",
    prazo: Timestamp.fromMillis(Date.now() + 15 * 24 * 60 * 60 * 1000),
    offsetDias: 15,
    ehSeed: true,
  },
  {
    titulo: "Curso de Cibersegurança",
    patrocinador: "TechAcademy",
    premio: "Acesso anual à trilha de Segurança Ofensiva",
    descricao:
      "Sorteio entre os 50 primeiros do ranking que tiverem completado pelo menos 30 quizzes diários.",
    status: "andamento",
    prazo: Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000),
    offsetDias: 7,
    ehSeed: true,
  },
  {
    titulo: "Vale-Livro Cibersegurança",
    patrocinador: "Editora HackBook",
    premio: "Box com 3 livros sobre segurança digital",
    descricao:
      "Premiação simbólica para os 3 primeiros colocados da segunda semana de campanha.",
    status: "concluida",
    vencedores: ["CyberKnight", "0xPhantom", "NeonHacker"],
    vencedoresUids: ["seed_001", "seed_002", "seed_003"],
    prazo: Timestamp.fromMillis(Date.now() - 5 * 24 * 60 * 60 * 1000),
    offsetDias: -5,
    ehSeed: true,
  },
];

export async function popularPremiacoes(): Promise<number> {
  let n = 0;
  for (const p of PREMIACOES_DEMO) {
    const { offsetDias, ...resto } = p;
    void offsetDias;
    const docRef = doc(collection(db, "premiacoes"));
    await setDoc(docRef, {
      ...resto,
      criadoEm: serverTimestamp(),
    });
    n++;
  }
  return n;
}
