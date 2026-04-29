import { doc, onSnapshot } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { db } from "../services/firebase";
import { Papel } from "../types";
import { urlAvatarPadrao } from "../data/avatares";
import { useAuth } from "./AuthContext";

type Perfil = {
  uid: string;
  email: string;
  nomeCompleto: string;
  nickname: string;
  pontosTotais: number;
  avatarUrl: string;
  papel: Papel;
  bio: string;
  universidade: string;
  cidade: string;
  instagram: string;
  linkedin: string;
  github: string;
};

type PerfilContextValor = {
  perfil: Perfil | null;
  carregando: boolean;
  ehAdmin: boolean;
};

const PerfilContext = createContext<PerfilContextValor>({
  perfil: null,
  carregando: true,
  ehAdmin: false,
});

export function PerfilProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!usuario) {
      setPerfil(null);
      setCarregando(false);
      return;
    }
    setCarregando(true);
    const desinscrever = onSnapshot(doc(db, "users", usuario.uid), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        const nickname = d.nickname ?? "";
        setPerfil({
          uid: d.uid,
          email: d.email,
          nomeCompleto: d.nomeCompleto ?? "",
          nickname,
          pontosTotais: d.pontosTotais ?? 0,
          avatarUrl: d.avatarUrl ?? urlAvatarPadrao(nickname || d.uid),
          papel: (d.papel as Papel) ?? "usuario",
          bio: d.bio ?? "",
          universidade: d.universidade ?? "",
          cidade: d.cidade ?? "",
          instagram: d.instagram ?? "",
          linkedin: d.linkedin ?? "",
          github: d.github ?? "",
        });
      } else {
        setPerfil(null);
      }
      setCarregando(false);
    });
    return desinscrever;
  }, [usuario]);

  const ehAdmin = perfil?.papel === "admin";

  return (
    <PerfilContext.Provider value={{ perfil, carregando, ehAdmin }}>
      {children}
    </PerfilContext.Provider>
  );
}

export function usePerfil() {
  return useContext(PerfilContext);
}
