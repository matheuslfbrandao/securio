export type PerguntaSeed = {
  enunciado: string;
  alternativas: string[];
  indiceCorreto: number;
  explicacao: string;
  categoria: string;
};

export const PERGUNTAS_SEED: PerguntaSeed[] = [
  {
    categoria: "Senhas",
    enunciado: "Qual a melhor prática para criar uma senha forte?",
    alternativas: [
      "Usar o nome do seu pet ou data de nascimento",
      "Usar 123456 — é fácil de lembrar",
      "Combinar 12+ caracteres com letras, números e símbolos",
      "Usar a mesma senha em todos os sites",
    ],
    indiceCorreto: 2,
    explicacao:
      "Senhas fortes têm pelo menos 12 caracteres misturando letras maiúsculas, minúsculas, números e símbolos. Use um gerenciador de senhas para criá-las e armazená-las.",
  },
  {
    categoria: "Senhas",
    enunciado: "Você deve trocar suas senhas periodicamente sem motivo?",
    alternativas: [
      "Sim, todo mês — é a melhor prática",
      "Não — recomendações modernas (NIST) dizem para trocar apenas se houver suspeita de vazamento",
      "Sim, todo dia",
      "Não importa, pode usar a mesma para sempre",
    ],
    indiceCorreto: 1,
    explicacao:
      "Forçar troca frequente faz usuários criarem senhas fracas e variações previsíveis. O NIST hoje recomenda senhas longas, únicas, e troca apenas em caso de suspeita de comprometimento.",
  },
  {
    categoria: "Senhas",
    enunciado: "Por que usar um gerenciador de senhas (1Password, Bitwarden)?",
    alternativas: [
      "Para escrever senhas iguais em vários sites",
      "Para gerar e guardar senhas únicas e fortes para cada serviço",
      "Para deixar a internet mais lenta",
      "Para enviar senhas por e-mail",
    ],
    indiceCorreto: 1,
    explicacao:
      "Gerenciadores criam senhas únicas e fortes para cada site, e você só precisa lembrar de uma master password. Reduz drasticamente o risco de vazamento em cadeia.",
  },
  {
    categoria: "Senhas",
    enunciado: "O que é uma 'passphrase'?",
    alternativas: [
      "Uma frase secreta longa que serve como senha (ex: 'cavaloAzulCorre42!')",
      "Uma senha sem espaços",
      "Uma senha gravada num arquivo .txt",
      "Sinônimo de PIN de 4 dígitos",
    ],
    indiceCorreto: 0,
    explicacao:
      "Passphrases são longas, fáceis de lembrar e difíceis de quebrar. Combinar 4-5 palavras aleatórias com símbolos é mais seguro que senhas curtas e complexas.",
  },
  {
    categoria: "Senhas",
    enunciado: "Você descobriu que sua senha vazou em um site. Qual a primeira ação?",
    alternativas: [
      "Ignorar — todo mundo tem dados vazados mesmo",
      "Trocar imediatamente em todos os lugares onde a usou e ativar 2FA",
      "Postar no Twitter alertando geral",
      "Esperar a empresa entrar em contato",
    ],
    indiceCorreto: 1,
    explicacao:
      "Use sites como Have I Been Pwned para ver onde sua senha vazou. Troque em todas as contas que a usavam e ative 2FA imediatamente.",
  },
  {
    categoria: "Phishing",
    enunciado:
      "Você recebe um e-mail do 'banco' pedindo para confirmar dados clicando num link. O que fazer?",
    alternativas: [
      "Clicar e digitar os dados — o banco precisa atualizar",
      "Ignorar e acessar o site oficial digitando a URL no navegador",
      "Responder o e-mail com os dados",
      "Encaminhar para outras pessoas confirmarem",
    ],
    indiceCorreto: 1,
    explicacao:
      "Bancos NUNCA pedem dados por e-mail. Sempre acesse digitando a URL oficial no navegador ou pelo app. Esse é um ataque clássico de phishing.",
  },
  {
    categoria: "Phishing",
    enunciado: "Qual desses sinais indica um e-mail de phishing?",
    alternativas: [
      "Domínio do remetente parecido mas diferente do oficial (ex: bradesc0.com)",
      "Urgência extrema ('Aja agora ou sua conta será bloqueada!')",
      "Link cujo endereço real (visto ao passar o mouse) não bate com o texto exibido",
      "Todas as alternativas acima",
    ],
    indiceCorreto: 3,
    explicacao:
      "Phishing combina vários sinais: domínios falsificados, urgência manipuladora, links enganosos, erros de português. Sempre verifique antes de clicar.",
  },
  {
    categoria: "Phishing",
    enunciado: "O que é 'spear phishing'?",
    alternativas: [
      "Phishing genérico enviado em massa",
      "Phishing direcionado a uma pessoa ou empresa específica, com informações personalizadas",
      "Phishing por SMS",
      "Phishing por ligação",
    ],
    indiceCorreto: 1,
    explicacao:
      "Spear phishing é altamente personalizado — o atacante pesquisa a vítima (LinkedIn, redes sociais) para criar uma armadilha convincente. Mais perigoso que phishing comum.",
  },
  {
    categoria: "Phishing",
    enunciado: "O que é 'smishing'?",
    alternativas: [
      "Phishing via SMS ou apps de mensagem",
      "Phishing via ligação telefônica",
      "Phishing via redes sociais",
      "Phishing automatizado por bots",
    ],
    indiceCorreto: 0,
    explicacao:
      "Smishing combina SMS + Phishing. Mensagens com links suspeitos prometendo prêmios, alertando sobre 'entregas' ou 'bloqueios'. Nunca clique em links de SMS desconhecidos.",
  },
  {
    categoria: "Phishing",
    enunciado: "Recebeu uma ligação de alguém se passando por banco pedindo o código do SMS. O que fazer?",
    alternativas: [
      "Passar o código — eles precisam para 'verificar'",
      "Desligar imediatamente — bancos nunca pedem códigos por telefone",
      "Anotar o código antes de passar",
      "Pedir para repetir o número",
    ],
    indiceCorreto: 1,
    explicacao:
      "Códigos de SMS de bancos JAMAIS devem ser compartilhados. Atacantes ligam fingindo ser do banco para pegar o segundo fator e completar fraudes.",
  },
  {
    categoria: "2FA",
    enunciado: "O que é autenticação em dois fatores (2FA)?",
    alternativas: [
      "Ter duas senhas diferentes na mesma conta",
      "Confirmar identidade com algo que você sabe (senha) e algo que tem (código no celular)",
      "Trocar de senha duas vezes por mês",
      "Usar caracteres especiais na senha",
    ],
    indiceCorreto: 1,
    explicacao:
      "2FA adiciona uma segunda camada — geralmente um código gerado por app (Google Authenticator) ou enviado por SMS. Mesmo que roubem sua senha, sem o segundo fator não conseguem entrar.",
  },
  {
    categoria: "2FA",
    enunciado: "Qual método de 2FA é considerado mais seguro?",
    alternativas: [
      "SMS",
      "App autenticador (Authy, Google Authenticator)",
      "E-mail",
      "Pergunta de segurança",
    ],
    indiceCorreto: 1,
    explicacao:
      "Apps autenticadores geram códigos offline e não dependem da operadora. SMS pode ser interceptado via SIM swap. Chaves físicas (FIDO2/YubiKey) são ainda mais seguras.",
  },
  {
    categoria: "2FA",
    enunciado: "O que são códigos de backup do 2FA?",
    alternativas: [
      "Senhas de emergência geradas durante o setup do 2FA, para usar se você perder o celular",
      "Senhas usadas no fim de semana",
      "Códigos enviados por SMS",
      "Códigos do banco",
    ],
    indiceCorreto: 0,
    explicacao:
      "Ao ativar 2FA, salve os códigos de backup em local seguro (gerenciador de senhas ou impresso). Você os usará se perder o acesso ao app autenticador.",
  },
  {
    categoria: "2FA",
    enunciado: "O que é um SIM swap?",
    alternativas: [
      "Trocar de operadora de celular",
      "Ataque onde fraudadores convencem a operadora a transferir seu número para um chip deles",
      "Configurar dual SIM",
      "Trocar o chip do iPhone",
    ],
    indiceCorreto: 1,
    explicacao:
      "No SIM swap, fraudadores recebem seus SMS — incluindo códigos 2FA. Por isso apps autenticadores são mais seguros que SMS para 2FA.",
  },
  {
    categoria: "Wi-Fi público",
    enunciado: "Qual o principal risco de usar Wi-Fi público?",
    alternativas: [
      "A internet é mais lenta",
      "Atacantes podem interceptar dados que você envia (man-in-the-middle)",
      "Você gasta mais bateria",
      "Não há risco se a senha for forte",
    ],
    indiceCorreto: 1,
    explicacao:
      "Em redes públicas, terceiros podem capturar tráfego não criptografado. Use VPN ou evite acessar bancos/contas sensíveis nessas redes.",
  },
  {
    categoria: "Wi-Fi público",
    enunciado: "O que é uma 'rede Wi-Fi gêmea maliciosa' (evil twin)?",
    alternativas: [
      "Duas redes com a mesma senha",
      "Uma rede falsa criada com o mesmo nome de uma legítima para enganar usuários",
      "Uma rede sem senha",
      "Uma rede com sinal duplicado",
    ],
    indiceCorreto: 1,
    explicacao:
      "Atacantes criam APs com nomes idênticos a Wi-Fis confiáveis (ex: 'Aeroporto-Free'). Quem se conecta tem todo o tráfego monitorado.",
  },
  {
    categoria: "Wi-Fi público",
    enunciado: "Sua VPN está mais segura?",
    alternativas: [
      "Sim, ela criptografa todo seu tráfego e protege em redes públicas",
      "Não, VPN só serve para acessar Netflix",
      "Talvez, depende do dia",
      "VPN deixa tudo mais lento e inseguro",
    ],
    indiceCorreto: 0,
    explicacao:
      "Uma VPN confiável criptografa o tráfego entre você e o servidor VPN, protegendo contra interceptação em Wi-Fi público. Escolha provedores reputados.",
  },
  {
    categoria: "Wi-Fi público",
    enunciado: "Em Wi-Fi público, qual atividade é segura?",
    alternativas: [
      "Acessar internet banking sem VPN",
      "Logar em redes sociais via HTTP",
      "Navegar em sites HTTPS (cadeado fechado) com cuidado",
      "Inserir CPF em qualquer site",
    ],
    indiceCorreto: 2,
    explicacao:
      "HTTPS protege a criptografia mesmo em rede pública. Mas evite operações sensíveis (banking, dados de cartão) sem VPN, mesmo em HTTPS.",
  },
  {
    categoria: "Engenharia Social",
    enunciado:
      "Um 'suporte técnico' liga dizendo que seu computador está infectado e pede acesso remoto. O que fazer?",
    alternativas: [
      "Dar acesso — eles devem saber o que fazem",
      "Desligar a ligação imediatamente — é golpe",
      "Pagar a taxa que eles pedem",
      "Deixar o computador ligado e sair",
    ],
    indiceCorreto: 1,
    explicacao:
      "Empresas legítimas NUNCA ligam pedindo acesso remoto sem você ter solicitado. É engenharia social — golpistas se passam por suporte para instalar malware ou roubar dados.",
  },
  {
    categoria: "Engenharia Social",
    enunciado: "O que é 'pretexting'?",
    alternativas: [
      "Mandar mensagens com erros de português",
      "Inventar uma situação fictícia (pretexto) para extrair informações",
      "Texto de marketing legítimo",
      "Tipo de antivírus",
    ],
    indiceCorreto: 1,
    explicacao:
      "Pretexting é a base da engenharia social: criar uma história crível ('sou do RH', 'sou do banco') para conseguir dados sensíveis ou acesso.",
  },
  {
    categoria: "Engenharia Social",
    enunciado: "Sua 'amiga' no WhatsApp pede um Pix urgente alegando emergência. O número é diferente. O que fazer?",
    alternativas: [
      "Mandar imediatamente — ela precisa de ajuda",
      "Confirmar por outro meio (ligar para o número antigo conhecido)",
      "Pedir os dados bancários e mandar",
      "Mandar metade",
    ],
    indiceCorreto: 1,
    explicacao:
      "Golpe clássico do WhatsApp: clonam contatos e pedem Pix urgente. Sempre confirme por ligação ou outro canal antes de transferir.",
  },
  {
    categoria: "Engenharia Social",
    enunciado: "Recebeu boleto inesperado por e-mail dizendo que é uma compra sua. O que fazer?",
    alternativas: [
      "Pagar logo — boleto é coisa séria",
      "Não pagar e verificar a origem (e-mail oficial, contato direto com a empresa)",
      "Encaminhar para um amigo pagar",
      "Ligar para o número do boleto",
    ],
    indiceCorreto: 1,
    explicacao:
      "Boleto frio é golpe comum. Sempre verifique se realmente fez a compra. Pague apenas via app oficial do banco usando o código completo.",
  },
  {
    categoria: "Atualizações",
    enunciado: "Por que é importante manter sistema operacional e apps atualizados?",
    alternativas: [
      "Para ter a interface mais bonita",
      "Para corrigir falhas de segurança descobertas (vulnerabilidades)",
      "Apenas para ter novas funcionalidades",
      "Atualizações não importam para segurança",
    ],
    indiceCorreto: 1,
    explicacao:
      "Atualizações trazem patches que corrigem brechas exploradas por atacantes. Sistemas desatualizados são alvo fácil de malware e ransomware.",
  },
  {
    categoria: "Atualizações",
    enunciado: "O que é um 'zero-day'?",
    alternativas: [
      "Uma falha conhecida há mais de um ano",
      "Uma vulnerabilidade descoberta sem patch disponível ainda",
      "Um vírus que age na meia-noite",
      "Um sistema operacional novo",
    ],
    indiceCorreto: 1,
    explicacao:
      "Zero-day é uma vulnerabilidade ainda não corrigida pelo fabricante. Extremamente perigosa — atualizações de emergência são a principal defesa.",
  },
  {
    categoria: "Atualizações",
    enunciado: "Devo aceitar atualizar quando o app pede?",
    alternativas: [
      "Não, atualizações sempre quebram coisas",
      "Sim, especialmente quando vêm da loja oficial e têm correções de segurança",
      "Só se o app for pago",
      "Apenas no Wi-Fi de casa",
    ],
    indiceCorreto: 1,
    explicacao:
      "Atualizações da loja oficial corrigem brechas críticas. Adie só se a versão é instável conhecida — e mesmo assim, atualize logo que estabilizar.",
  },
  {
    categoria: "Backup",
    enunciado: "Qual a regra '3-2-1' de backup recomendada?",
    alternativas: [
      "3 senhas diferentes, 2 dispositivos, 1 antivírus",
      "3 cópias dos dados, em 2 mídias diferentes, com 1 cópia fora do local",
      "3 minutos de backup, 2 vezes por semana, 1 vez por mês",
      "Backup automático único na nuvem é suficiente",
    ],
    indiceCorreto: 1,
    explicacao:
      "Mantenha 3 cópias (original + 2 backups), em 2 mídias diferentes (HD + nuvem) e 1 cópia em local físico distante (proteção contra incêndio, ransomware, roubo).",
  },
  {
    categoria: "Backup",
    enunciado: "Backup na mesma máquina é suficiente?",
    alternativas: [
      "Sim, é tudo que precisa",
      "Não — se a máquina for criptografada por ransomware, o backup vai junto",
      "Sim, se for em outra pasta",
      "Sim, se for em outro disco da mesma máquina",
    ],
    indiceCorreto: 1,
    explicacao:
      "Backup precisa estar isolado. Disco externo conectado também é vulnerável a ransomware. Use nuvem com versionamento ou disco que só conecta no momento do backup.",
  },
  {
    categoria: "Backup",
    enunciado: "Você testou seu backup recentemente?",
    alternativas: [
      "Não preciso testar — backup sempre funciona",
      "Sim — backup que não foi testado é suposição, não garantia",
      "Só testo quando perco dados",
      "Backup nunca falha",
    ],
    indiceCorreto: 1,
    explicacao:
      "Faça testes periódicos de restauração. Muita gente descobre que o backup estava corrompido só no momento crítico — quando precisa restaurar.",
  },
  {
    categoria: "Privacidade",
    enunciado: "Sobre informações pessoais em redes sociais, qual prática é mais segura?",
    alternativas: [
      "Postar localização em tempo real de viagens",
      "Compartilhar foto de cartão de embarque com QR code visível",
      "Limitar visibilidade de posts a amigos e revisar configurações de privacidade",
      "Aceitar todas as solicitações de amizade",
    ],
    indiceCorreto: 2,
    explicacao:
      "Atacantes coletam dados públicos para engenharia social. Limite quem vê suas postagens, evite expor localização em tempo real e nunca compartilhe documentos com QR code visível.",
  },
  {
    categoria: "Privacidade",
    enunciado: "O que pode ser extraído de uma foto comum tirada com celular?",
    alternativas: [
      "Apenas a imagem",
      "Metadados EXIF: localização GPS, modelo do celular, data/hora",
      "Apenas a data",
      "Nada — foto é só foto",
    ],
    indiceCorreto: 1,
    explicacao:
      "Metadados EXIF revelam onde, quando e com qual câmera a foto foi tirada. Apps modernos costumam remover ao postar, mas verifique antes de compartilhar arquivos.",
  },
  {
    categoria: "Privacidade",
    enunciado: "É seguro usar 'Login com Facebook/Google' em todos os sites?",
    alternativas: [
      "Sim, sempre — é mais prático",
      "Tem trade-offs: prático mas centraliza riscos. Avalie o site antes",
      "Sim, é mais seguro que senha",
      "Nunca use",
    ],
    indiceCorreto: 1,
    explicacao:
      "Login social reduz proliferação de senhas, mas se a conta principal for comprometida, todos os sites caem juntos. Use apenas em sites confiáveis.",
  },
  {
    categoria: "Privacidade",
    enunciado: "O modo anônimo do navegador esconde sua atividade?",
    alternativas: [
      "Sim, ninguém consegue ver nada",
      "Não — apenas evita salvar histórico local. Provedor, sites e empresa ainda podem ver",
      "Sim, mas só em sites HTTPS",
      "Sim, só seu provedor não vê",
    ],
    indiceCorreto: 1,
    explicacao:
      "Modo anônimo só apaga histórico local. Para anonimato real é preciso VPN + Tor + cuidados adicionais. Útil só para evitar histórico em compartilhada.",
  },
  {
    categoria: "Malware",
    enunciado: "O que é ransomware?",
    alternativas: [
      "Um tipo de antivírus gratuito",
      "Malware que criptografa seus arquivos e exige resgate para devolver",
      "Programa para gerenciar senhas",
      "Sistema operacional alternativo",
    ],
    indiceCorreto: 1,
    explicacao:
      "Ransomware sequestra seus dados criptografando-os. Pagar o resgate não garante recuperação. A melhor defesa: backups frequentes e não abrir anexos suspeitos.",
  },
  {
    categoria: "Malware",
    enunciado: "Qual desses é um sinal de máquina infectada?",
    alternativas: [
      "Lentidão extrema, popups, aba do navegador abrindo sozinha",
      "Bateria durando mais que o normal",
      "Velocidade de internet aumentando",
      "Apps fechando rapidamente",
    ],
    indiceCorreto: 0,
    explicacao:
      "Lentidão sem motivo, popups inesperados, abas suspeitas e processos consumindo CPU sem razão são sinais clássicos. Faça uma varredura com antivírus atualizado.",
  },
  {
    categoria: "Malware",
    enunciado: "Antivírus gratuito é suficiente?",
    alternativas: [
      "Não, é tudo enganação",
      "Para uso doméstico básico, geralmente sim — desde que mantido atualizado e combinado com cuidados (não clicar em qualquer link)",
      "Só pago oferece proteção",
      "Antivírus é desnecessário no Linux/Mac",
    ],
    indiceCorreto: 1,
    explicacao:
      "Defender, Avast Free e similares oferecem boa proteção doméstica. O fator humano (cliques) ainda é o elo mais fraco. Linux/Mac também têm malwares.",
  },
  {
    categoria: "Malware",
    enunciado: "O que é um trojan (cavalo de Troia)?",
    alternativas: [
      "Vírus disfarçado de programa legítimo",
      "Antivírus pago",
      "Backup automático",
      "Tipo de criptografia",
    ],
    indiceCorreto: 0,
    explicacao:
      "Trojans se passam por software útil (jogo crackeado, app falso) mas instalam código malicioso por baixo dos panos. Baixar de fontes oficiais é a defesa básica.",
  },
  {
    categoria: "LGPD",
    enunciado: "Conforme a LGPD, quando uma empresa pode tratar seus dados pessoais?",
    alternativas: [
      "Sempre que quiser, sem precisar avisar",
      "Apenas com base legal específica (consentimento, contrato, obrigação legal, etc.)",
      "Só se você for cliente",
      "Apenas dentro do horário comercial",
    ],
    indiceCorreto: 1,
    explicacao:
      "A LGPD exige base legal para qualquer tratamento de dados. Você tem direito de saber quais dados são coletados, exigir correção e até a exclusão (direito ao esquecimento).",
  },
  {
    categoria: "LGPD",
    enunciado: "Quais direitos a LGPD garante ao titular dos dados?",
    alternativas: [
      "Acesso, correção, exclusão, portabilidade e revogação do consentimento",
      "Apenas acesso aos dados",
      "Apenas exclusão",
      "Nenhum direito específico",
    ],
    indiceCorreto: 0,
    explicacao:
      "LGPD garante direitos amplos: ver, corrigir, apagar, portar dados e revogar consentimento. Empresas devem responder em até 15 dias.",
  },
  {
    categoria: "LGPD",
    enunciado: "Quem é o DPO/Encarregado em uma empresa?",
    alternativas: [
      "Quem cuida dos contratos comerciais",
      "Pessoa responsável pela proteção de dados, ponto focal entre empresa, ANPD e titulares",
      "Diretor de Tecnologia",
      "Apenas um cargo decorativo",
    ],
    indiceCorreto: 1,
    explicacao:
      "O Encarregado (DPO) é obrigatório para empresas que tratam dados em larga escala. Recebe demandas dos titulares e da ANPD, orienta a empresa.",
  },
  {
    categoria: "LGPD",
    enunciado: "O que é a ANPD?",
    alternativas: [
      "Autoridade Nacional de Proteção de Dados — órgão fiscalizador da LGPD",
      "Agência Nacional de Privacidade Digital",
      "Associação Nacional de Provedores",
      "Não existe",
    ],
    indiceCorreto: 0,
    explicacao:
      "A ANPD é o órgão público que fiscaliza, regulamenta e aplica sanções pela LGPD. Multas podem chegar a 2% do faturamento, limitadas a R$ 50 milhões por infração.",
  },
  {
    categoria: "Criptografia",
    enunciado: "O que faz o cadeado verde (HTTPS) garantir?",
    alternativas: [
      "Que o site é confiável e não é golpe",
      "Que a comunicação entre você e o site está criptografada",
      "Que o site nunca cai",
      "Que o conteúdo é verdadeiro",
    ],
    indiceCorreto: 1,
    explicacao:
      "HTTPS criptografa o canal — terceiros não veem o que você envia. Mas NÃO garante que o site é legítimo. Phishing também usa HTTPS hoje em dia.",
  },
  {
    categoria: "Criptografia",
    enunciado: "End-to-end encryption (E2EE) significa que:",
    alternativas: [
      "Apenas remetente e destinatário conseguem ler a mensagem",
      "A empresa que opera o serviço também consegue ler",
      "O governo sempre consegue ler",
      "É a mesma coisa que HTTPS",
    ],
    indiceCorreto: 0,
    explicacao:
      "Em E2EE (Signal, WhatsApp), só os participantes da conversa têm as chaves. Nem o servidor consegue decifrar. Diferente de só HTTPS, onde o servidor lê o conteúdo.",
  },
  {
    categoria: "Criptografia",
    enunciado: "É seguro inventar seu próprio algoritmo de criptografia?",
    alternativas: [
      "Sim, segurança por obscuridade funciona",
      "Não — use padrões testados (AES, RSA). Algoritmos caseiros têm furos invisíveis",
      "Sim, se ninguém souber",
      "Apenas se for em Python",
    ],
    indiceCorreto: 1,
    explicacao:
      "Criptografia caseira quase sempre tem brechas. Use bibliotecas e padrões revisados pela comunidade (libsodium, OpenSSL). Don't roll your own crypto.",
  },
  {
    categoria: "USB e dispositivos",
    enunciado: "Encontrou um pendrive no chão. O que fazer?",
    alternativas: [
      "Conectar para descobrir de quem é",
      "Não conectar — pode conter malware (USB drop attack)",
      "Conectar em modo seguro",
      "Enviar para o porteiro",
    ],
    indiceCorreto: 1,
    explicacao:
      "USB drop é técnica clássica de invasão. Pendrives 'esquecidos' em estacionamentos podem auto-executar malware. Nunca conecte um USB de origem desconhecida.",
  },
  {
    categoria: "USB e dispositivos",
    enunciado: "É seguro carregar o celular em totens USB públicos (aeroporto, shopping)?",
    alternativas: [
      "Sim, sempre — é só energia",
      "Cuidado: 'juice jacking' pode roubar dados via cabo USB. Use carregador próprio",
      "Sim, se for rápido",
      "Sim, se o totem for novo",
    ],
    indiceCorreto: 1,
    explicacao:
      "Cabos USB transportam dados, não só energia. Atacantes podem instalar malware ou copiar dados. Use seu próprio carregador na tomada ou cabos 'só energia'.",
  },
  {
    categoria: "Browser",
    enunciado: "Extensões de navegador podem ser perigosas?",
    alternativas: [
      "Não, todas são revisadas e seguras",
      "Sim — algumas pedem permissões amplas e podem ler/modificar tudo que você faz online",
      "Apenas extensões pagas",
      "Apenas no Chrome",
    ],
    indiceCorreto: 1,
    explicacao:
      "Extensões muitas vezes têm permissão de ler todo o tráfego do navegador. Instale apenas de desenvolvedores conhecidos e revise periodicamente as permissões.",
  },
  {
    categoria: "Browser",
    enunciado: "O que é um cookie de terceiros (third-party cookie)?",
    alternativas: [
      "Cookie de site visitado em outra aba",
      "Cookie definido por domínio diferente do site visitado, geralmente para rastreamento",
      "Cookie sem data de validade",
      "Cookie que expira em 3 dias",
    ],
    indiceCorreto: 1,
    explicacao:
      "Third-party cookies seguem você entre sites, montando perfis para anúncios. Browsers modernos os bloqueiam por padrão (Safari, Firefox, Chrome em transição).",
  },
  {
    categoria: "IoT",
    enunciado: "Qual o risco principal de dispositivos IoT (câmera Wi-Fi, lâmpada smart)?",
    alternativas: [
      "Gastam mais energia",
      "Senhas padrão e firmware desatualizado fazem deles porta de entrada na sua rede",
      "Brilho excessivo",
      "Não há risco",
    ],
    indiceCorreto: 1,
    explicacao:
      "IoT mal configurado é alvo fácil. Troque senhas padrão, mantenha firmware atualizado e isole em rede separada (Wi-Fi guest) sempre que possível.",
  },
  {
    categoria: "Cloud",
    enunciado: "O que significa o 'modelo de responsabilidade compartilhada' em cloud?",
    alternativas: [
      "Provedor cuida de tudo, você não tem responsabilidade",
      "Provedor cuida da infra, você cuida da configuração e dos dados (acessos, backups, criptografia)",
      "Você cuida de tudo, provedor não",
      "É uma metáfora sem aplicação prática",
    ],
    indiceCorreto: 1,
    explicacao:
      "AWS, GCP, Azure protegem o data center e a virtualização. Você é responsável por permissões, dados, configurações de segurança. A maioria dos vazamentos são culpa do cliente.",
  },
];
