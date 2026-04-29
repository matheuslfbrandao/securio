import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type StatusParceria = "pendente" | "aprovada" | "rejeitada";

export type Parceria = {
  id: string;
  empresa: string;
  cnpj: string;
  contatoNome: string;
  contatoEmail: string;
  contatoTelefone?: string;
  proposta: string;
  status: StatusParceria;
  criadoEm?: Timestamp;
};

export type DadosParceria = {
  empresa: string;
  cnpj: string;
  contatoNome: string;
  contatoEmail: string;
  contatoTelefone?: string;
  proposta: string;
};

export async function enviarParceria(dados: DadosParceria): Promise<string> {
  const ref = await addDoc(collection(db, "parcerias"), {
    empresa: dados.empresa.trim(),
    cnpj: dados.cnpj.replace(/\D/g, ""),
    contatoNome: dados.contatoNome.trim(),
    contatoEmail: dados.contatoEmail.trim().toLowerCase(),
    contatoTelefone: dados.contatoTelefone?.trim() ?? "",
    proposta: dados.proposta.trim(),
    status: "pendente",
    criadoEm: serverTimestamp(),
  });
  return ref.id;
}

export async function listarParcerias(): Promise<Parceria[]> {
  const snap = await getDocs(
    query(collection(db, "parcerias"), orderBy("criadoEm", "desc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Parceria, "id">),
  }));
}

export async function atualizarStatusParceria(
  id: string,
  status: StatusParceria
): Promise<void> {
  await updateDoc(doc(db, "parcerias", id), { status });
}

export async function deletarParceria(id: string): Promise<void> {
  await deleteDoc(doc(db, "parcerias", id));
}
