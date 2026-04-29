export type UsuarioSeed = {
  uid: string;
  nickname: string;
  email: string;
  pontosTotais: number;
  bio?: string;
  universidade?: string;
  cidade?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
};

const PREFIXOS = [
  "Cyber", "Neon", "Quantum", "Pixel", "Binary", "Echo", "Zero", "Shadow",
  "Nova", "Void", "Ghost", "Phantom", "Cipher", "Hex", "Null", "Root",
  "Crypto", "Stack", "Logic", "Data", "Net", "Bit", "Byte", "Glitch",
  "Vector", "Matrix", "Pulse", "Quark", "Photon", "Helix", "Forge", "Spark",
];

const SUFIXOS = [
  "Knight", "Hacker", "Wolf", "Storm", "Hunter", "Mancer", "Proxy", "Link",
  "Rider", "Forge", "Dust", "Sec", "Rose", "Code", "Wave", "Drift",
  "Lord", "Mage", "Pulse", "Spark", "Flux", "Shade", "Rune", "Flame",
  "Bolt", "Edge", "Core", "Trail", "Beam", "Frost",
];

const UNIVERSIDADES = [
  "USP", "UNICAMP", "UFMG", "UFRJ", "UFSC", "PUC-SP", "PUC-Rio", "UNESP",
  "UFRGS", "UFPE", "UFBA", "UFC", "UnB", "UFSCar", "Mackenzie", "ESPM",
  "Insper", "Sem universidade",
];

const CIDADES = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre",
  "Salvador", "Fortaleza", "Brasília", "Campinas", "Florianópolis", "Recife",
  "Manaus", "Belém", "Goiânia", "Vitória", "Natal", "São Luís", "Maceió",
  "João Pessoa", "Teresina",
];

const BIOS = [
  "Aprendendo cibersegurança no Securio diariamente.",
  "Dev e entusiasta de privacidade digital.",
  "Estudando para ser pentester.",
  "Quem disse que segurança não é divertida?",
  "CTF lover. Caçando flags pelos cantos.",
  "Tech enthusiast. Coffee addict.",
  "Aqui pra aprender e dividir conhecimento.",
  "Defesa em profundidade > segurança por obscuridade.",
  "Trust no one. Verify everything.",
  "Curioso por nature, paranoico por escolha.",
  "Aprendiz eterno do mundo cyber.",
  "Securing the future, one packet at a time.",
];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function pick<T>(arr: T[], r: () => number): T {
  return arr[Math.floor(r() * arr.length)];
}

function gerarUsuarios(): UsuarioSeed[] {
  const TOTAL = 300;
  const usuarios: UsuarioSeed[] = [];
  const usados = new Set<string>();
  const r = rng(42);

  let i = 0;
  while (usuarios.length < TOTAL && i < 5000) {
    const prefixo = pick(PREFIXOS, r);
    const sufixo = pick(SUFIXOS, r);
    const numero = Math.floor(r() * 900) + 100;
    const nickname = `${prefixo}${sufixo}${numero}`;
    if (usados.has(nickname)) {
      i++;
      continue;
    }
    usados.add(nickname);

    const idx = usuarios.length;
    const uid = `seed_${String(idx + 1).padStart(3, "0")}`;
    const pontos = Math.max(
      0,
      Math.round(450 - idx * 1.4 + (r() - 0.5) * 25)
    );
    const handle = `${prefixo.toLowerCase()}.${sufixo.toLowerCase()}${numero}`;

    const u: UsuarioSeed = {
      uid,
      nickname,
      email: `${nickname.toLowerCase()}@securio.demo`,
      pontosTotais: pontos,
    };

    if (r() < 0.75) {
      const univ = pick(UNIVERSIDADES, r);
      if (univ !== "Sem universidade") u.universidade = univ;
    }
    if (r() < 0.85) u.cidade = pick(CIDADES, r);
    if (r() < 0.6) u.instagram = handle;
    if (r() < 0.5) u.linkedin = handle.replace(".", "-");
    if (r() < 0.45) u.github = handle.replace(".", "");
    if (r() < 0.4) u.bio = pick(BIOS, r);

    usuarios.push(u);
    i++;
  }

  return usuarios;
}

export const USUARIOS_SEED: UsuarioSeed[] = gerarUsuarios();
