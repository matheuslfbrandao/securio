import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Papel } from "../types";

export type AdminItem = {
  uid: string;
  nickname: string;
  email: string;
};

export async function listarAdmins(): Promise<AdminItem[]> {
  const snap = await getDocs(
    query(collection(db, "users"), where("papel", "==", "admin"))
  );
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: data.uid ?? d.id,
      nickname: data.nickname ?? "—",
      email: data.email ?? "—",
    };
  });
}

export async function definirPapelPorNickname(
  nickname: string,
  papel: Papel
): Promise<{ uid: string; nickname: string }> {
  const snap = await getDocs(
    query(collection(db, "users"), where("nickname", "==", nickname.trim()))
  );
  if (snap.empty) {
    throw new Error(`Usuário com nickname "${nickname}" não encontrado.`);
  }
  const docRef = snap.docs[0];
  await updateDoc(doc(db, "users", docRef.id), { papel });
  const data = docRef.data();
  return { uid: docRef.id, nickname: data.nickname };
}
