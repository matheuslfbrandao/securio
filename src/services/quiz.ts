import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { calcularPontos } from "../utils/calcularPontos";
import { db } from "./firebase";

export type Pergunta = {
  id: string;
  enunciado: string;
  alternativas: string[];
  indiceCorreto: number;
  explicacao: string;
  categoria: string;
  dataLiberacao: Timestamp;
};

export type RespostaSalva = {
  perguntaId: string;
  tentativas: number;
  acertou: boolean;
  pontosGanhos: number;
  tempoRespostaMs: number;
  respondidoEm: Timestamp;
};

export type ItemPergunta = {
  pergunta: Pergunta;
  resposta: RespostaSalva | null;
  concluida: boolean;
  ehDoDia: boolean;
};

export async function listarPerguntasComRespostas(
  uid: string
): Promise<ItemPergunta[]> {
  const [perguntasSnap, respostasSnap] = await Promise.all([
    getDocs(
      query(
        collection(db, "perguntas"),
        where("dataLiberacao", "<=", Timestamp.now()),
        orderBy("dataLiberacao", "desc")
      )
    ),
    getDocs(collection(db, "users", uid, "respostas")),
  ]);

  const respostasMap = new Map<string, RespostaSalva>();
  respostasSnap.docs.forEach((d) =>
    respostasMap.set(d.id, d.data() as RespostaSalva)
  );

  return perguntasSnap.docs.map((d, i) => {
    const pergunta = { id: d.id, ...(d.data() as Omit<Pergunta, "id">) };
    const resposta = respostasMap.get(d.id) ?? null;
    const concluida = !!(resposta && (resposta.acertou || resposta.tentativas >= 2));
    return {
      pergunta,
      resposta,
      concluida,
      ehDoDia: i === 0,
    };
  });
}

export async function buscarRespostaDoUsuario(
  uid: string,
  perguntaId: string
): Promise<RespostaSalva | null> {
  const ref = doc(db, "users", uid, "respostas", perguntaId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as RespostaSalva;
}

export type ResultadoEnvio = {
  acertou: boolean;
  pontosGanhos: number;
  multiplicador: number;
  tentativaAtual: 1 | 2;
  podeTentarNovamente: boolean;
  explicacao: string;
};

export async function registrarResposta(args: {
  uid: string;
  pergunta: Pergunta;
  alternativaEscolhida: number;
  tempoRespostaMs: number;
  respostaAnterior: RespostaSalva | null;
}): Promise<ResultadoEnvio> {
  const { uid, pergunta, alternativaEscolhida, tempoRespostaMs, respostaAnterior } = args;

  const acertou = alternativaEscolhida === pergunta.indiceCorreto;
  const tentativaAtual: 1 | 2 = respostaAnterior ? 2 : 1;

  const { pontosFinais, multiplicador } = calcularPontos(
    tentativaAtual,
    acertou,
    pergunta.dataLiberacao.toDate()
  );

  const ref = doc(db, "users", uid, "respostas", pergunta.id);
  await setDoc(ref, {
    perguntaId: pergunta.id,
    tentativas: tentativaAtual,
    acertou,
    pontosGanhos: pontosFinais,
    tempoRespostaMs,
    respondidoEm: serverTimestamp(),
  });

  if (pontosFinais > 0) {
    await updateDoc(doc(db, "users", uid), {
      pontosTotais: increment(pontosFinais),
    });
  }

  const podeTentarNovamente = !acertou && tentativaAtual === 1;

  return {
    acertou,
    pontosGanhos: pontosFinais,
    multiplicador,
    tentativaAtual,
    podeTentarNovamente,
    explicacao: pergunta.explicacao,
  };
}
