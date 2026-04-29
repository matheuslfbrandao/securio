export type ResultadoPontos = {
  pontosBase: number;
  multiplicador: number;
  pontosFinais: number;
};

const HORAS_JANELA_BONUS = 12;

export function calcularPontos(
  tentativa: 1 | 2,
  acertou: boolean,
  dataLiberacao: Date,
  agora: Date = new Date()
): ResultadoPontos {
  if (!acertou) {
    return { pontosBase: 0, multiplicador: 1, pontosFinais: 0 };
  }

  const pontosBase = tentativa === 1 ? 2 : 1;

  const horasDecorridas =
    (agora.getTime() - dataLiberacao.getTime()) / (1000 * 60 * 60);

  const fracaoRestante = Math.max(
    0,
    (HORAS_JANELA_BONUS - horasDecorridas) / HORAS_JANELA_BONUS
  );
  const multiplicador = 1 + fracaoRestante;

  const pontosFinais = Math.round(pontosBase * multiplicador);

  return { pontosBase, multiplicador, pontosFinais };
}

export function tempoAteProximaPergunta(agora: Date = new Date()): {
  horas: number;
  minutos: number;
  segundos: number;
} {
  const proxima = new Date(agora);
  proxima.setHours(12, 0, 0, 0);
  if (proxima.getTime() <= agora.getTime()) {
    proxima.setDate(proxima.getDate() + 1);
  }
  const diff = proxima.getTime() - agora.getTime();
  const horas = Math.floor(diff / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diff % (1000 * 60)) / 1000);
  return { horas, minutos, segundos };
}
