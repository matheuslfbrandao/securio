import { Timestamp } from "firebase/firestore";

export type Papel = "admin" | "usuario";

export type Usuario = {
  uid: string;
  email: string;
  nomeCompleto: string;
  nickname: string;
  cpfHash: string;
  pontosTotais: number;
  avatarUrl?: string;
  papel: Papel;
  bio?: string;
  universidade?: string;
  cidade?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  criadoEm: Timestamp;
};

export type Pergunta = {
  id: string;
  enunciado: string;
  alternativas: string[];
  indiceCorreto: number;
  explicacao: string;
  categoria: string;
  dataLiberacao: Timestamp;
};

export type Resposta = {
  userId: string;
  perguntaId: string;
  tentativas: number;
  acertou: boolean;
  pontosGanhos: number;
  tempoRespostaMs: number;
  respondidoEm: Timestamp;
};

export type Parceria = {
  empresa: string;
  cnpj: string;
  contatoNome: string;
  contatoEmail: string;
  proposta: string;
  status: "pendente" | "aprovada" | "rejeitada";
  criadoEm: Timestamp;
};

export type Premiacao = {
  titulo: string;
  patrocinador: string;
  premio: string;
  prazo: Timestamp;
  status: "andamento" | "concluida";
  vencedores?: string[];
};

export type ForumPost = {
  id: string;
  userId: string;
  autorNickname: string;
  titulo: string;
  conteudo: string;
  criadoEm: Timestamp;
  qtdComentarios: number;
};

export type ForumComentario = {
  userId: string;
  autorNickname: string;
  conteudo: string;
  criadoEm: Timestamp;
};
