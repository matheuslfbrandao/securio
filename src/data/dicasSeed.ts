export type DicaSeed = {
  titulo: string;
  conteudo: string;
};

export const DICAS_SEED: DicaSeed[] = [
  {
    titulo: "Use frases-senha em vez de senhas curtas",
    conteudo:
      "Trocar 'P@ss123!' por 'CavaloAzulCorre42!' aumenta drasticamente a entropia. Frases longas (5+ palavras) são mais fáceis de lembrar e muito mais difíceis de quebrar por força bruta. Combine com números e símbolos para piorar ainda mais a vida do atacante.",
  },
  {
    titulo: "Ative 2FA em TODAS suas contas importantes",
    conteudo:
      "Banco, e-mail, redes sociais, gerenciador de senhas, GitHub. Prefira app autenticador (Authy, Google Authenticator) a SMS — SMS pode ser interceptado via SIM swap. E guarde os códigos de backup em local seguro!",
  },
  {
    titulo: "Have I Been Pwned: descubra se sua senha vazou",
    conteudo:
      "https://haveibeenpwned.com te diz se seu e-mail apareceu em vazamentos públicos. Se vazou, troque a senha em todos os lugares onde a usou e ative 2FA. Faça isso agora — leva 30 segundos.",
  },
  {
    titulo: "Cuidado com QR codes em locais públicos",
    conteudo:
      "Atacantes colam QR codes falsos sobre os legítimos em estacionamentos, restaurantes e cartazes. Sempre verifique a URL após escanear. Se levou a um site pedindo dados sensíveis, suspeite.",
  },
  {
    titulo: "Wi-Fi público sem VPN é roleta-russa",
    conteudo:
      "Em aeroporto, café, shopping — assuma que alguém está farejando a rede. Use VPN sempre, e jamais acesse banking ou contas críticas sem ela. Sites HTTPS protegem, mas não 100% (DNS, metadados ainda vazam).",
  },
  {
    titulo: "Dica de ouro contra phishing: 'pause and verify'",
    conteudo:
      "Recebeu mensagem urgente do banco/empresa pedindo ação imediata? Pare. Não clique. Acesse pelo app oficial ou digite a URL no navegador. A pressa é a ferramenta favorita do atacante.",
  },
  {
    titulo: "Configure backup automático na nuvem",
    conteudo:
      "Google Drive, iCloud, OneDrive oferecem backup gratuito de fotos e arquivos importantes. Para ainda mais segurança, mantenha uma cópia local em HD externo desconectado. Regra 3-2-1: 3 cópias, 2 mídias, 1 fora do local.",
  },
  {
    titulo: "Revise as permissões dos apps no celular",
    conteudo:
      "App de calculadora pedindo acesso a contatos? Vermelho. Vá em Ajustes > Privacidade e revise tudo. Negue o que não faz sentido. Faça isso a cada 3 meses.",
  },
  {
    titulo: "Atualize seus dispositivos hoje",
    conteudo:
      "Aquela notificação de 'atualizar mais tarde' que você ignora há 2 semanas? Atualize agora. A maioria das atualizações corrige falhas de segurança críticas. Hackers exploram exatamente quem deixa pra depois.",
  },
  {
    titulo: "Cuidado com pendrives encontrados",
    conteudo:
      "Pendrive 'esquecido' no estacionamento da empresa é uma técnica clássica de invasão (USB drop attack). Auto-executáveis podem instalar malware sem você perceber. Nunca conecte USB de origem desconhecida.",
  },
  {
    titulo: "Privacidade no Instagram: dicas práticas",
    conteudo:
      "Conta privada, desativar localização nas postagens, não publicar fotos de cartões/documentos/embarques. Cuidado com 'desafios' que pedem dados pessoais (nome do primeiro pet, primeira escola — são respostas de perguntas de segurança!).",
  },
  {
    titulo: "Como criar uma cultura de segurança em equipe",
    conteudo:
      "Treinamentos curtos e frequentes funcionam melhor que palestras anuais. Faça simulações de phishing, premie quem reporta tentativas. Lembre: o elo mais fraco é sempre humano. Empatia > culpa quando alguém cair em algo.",
  },
];
