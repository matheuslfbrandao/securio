export function limparCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

export function formatarCpf(cpf: string): string {
  const limpo = limparCpf(cpf).slice(0, 11);
  if (limpo.length <= 3) return limpo;
  if (limpo.length <= 6) return `${limpo.slice(0, 3)}.${limpo.slice(3)}`;
  if (limpo.length <= 9) return `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6)}`;
  return `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6, 9)}-${limpo.slice(9)}`;
}

export function validarCpf(cpf: string): boolean {
  const limpo = limparCpf(cpf);
  if (limpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(limpo)) return false;

  const digitos = limpo.split("").map(Number);

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += digitos[i] * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== digitos[9]) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += digitos[i] * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== digitos[10]) return false;

  return true;
}
