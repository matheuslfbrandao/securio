const ESTILO = "bottts";
const TAMANHO = 256;

function url(seed: string): string {
  return `https://api.dicebear.com/7.x/${ESTILO}/png?seed=${encodeURIComponent(seed)}&size=${TAMANHO}`;
}

export const AVATARES_DISPONIVEIS: { id: string; url: string }[] = [
  { id: "phantom", url: url("Phantom") },
  { id: "quantum", url: url("Quantum") },
  { id: "neon", url: url("Neon") },
  { id: "cipher", url: url("Cipher") },
  { id: "pixel", url: url("Pixel") },
  { id: "binary", url: url("Binary") },
  { id: "echo", url: url("Echo") },
  { id: "zero", url: url("Zero") },
  { id: "shadow", url: url("Shadow") },
  { id: "nova", url: url("Nova") },
  { id: "void", url: url("Void") },
  { id: "circuit", url: url("Circuit") },
];

export function urlAvatarPadrao(seed: string): string {
  return url(seed);
}
