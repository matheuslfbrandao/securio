# Documentação Técnica · Securio

> Documento escrito por **Matheus Brandão**. A prova de conceito funcional descrita aqui foi implementada com auxílio do **Claude (Opus 4.7)** da Anthropic, através do **Claude Code** (plano Max 5x), com a concepção, as decisões de conteúdo e a revisão final feitas pelo autor. A intenção desta documentação é servir como **guia técnico e estratégico** para pesquisadores que queiram dar continuidade ao projeto, registrando o que foi feito, por que foi feito e o que ainda precisa ser feito.

## ⚠️ Status do projeto e escopo do TCC

O escopo formal do meu Trabalho de Conclusão de Curso era entregar um **protótipo de média fidelidade no Figma** — um conjunto de telas navegáveis demonstrando a proposta visual e a experiência de uso planejada. O cronograma original (Aug-Oct/2025) cobriu exatamente isso: pesquisa, planejamento, desenho das telas no Figma e integração entre elas como protótipo clicável.

Decidi ir além do que o TCC exigia. Usei o **Claude** da Anthropic (plano Max 5x) com a ferramenta **Claude Code** em sessões intensivas de pair programming, transformando o protótipo estático em uma **prova de conceito funcional navegável**. O resultado é o código deste repositório.

**Por que essa entrega extra:**

1. **Para a banca:** demonstra a proposta com um app real funcionando, não apenas mockups.
2. **Para trabalhos futuros:** quem pegar este projeto para desenvolvê-lo oficialmente em pesquisa ou produto não recebe apenas Figma — recebe arquitetura definida, fluxos navegáveis e código de referência. Isso reduz drasticamente a barreira de entrada.
3. **Para mim:** aprendizado prático profundo de uma stack que eu não conhecia (React Native, Expo, Firebase, deploy moderno).

Esta prova de conceito **não é um produto pronto para produção**. Ela é uma camada extra sobre o protótipo Figma, com o propósito de demonstrar viabilidade técnica. Existem várias áreas em que conscientemente parei antes do nível de qualidade exigido por um produto comercial — testes, segurança server-side, performance otimizada, fidelidade visual pixel-perfeita, etc. Tudo isso está catalogado em **[Para quem for continuar este projeto](#para-quem-for-continuar-este-projeto)**.

**Links de referência:**
- 🎨 [Protótipo Figma original](https://www.figma.com/design/31mshRyEJ3thfybxoS4uLh/Securio---O-CyberQuiz?node-id=0-1) — fonte da verdade visual e entrega formal do TCC
- 🌐 [Demo da prova de conceito](https://securio-woad.vercel.app)
- 💻 [Código no GitHub](https://github.com/matheuslfbrandao/securio)

## Sumário

1. [Visão geral e motivação](#visão-geral-e-motivação)
2. [Decisões de stack](#decisões-de-stack)
3. [Arquitetura](#arquitetura)
4. [Modelo de dados](#modelo-de-dados-firestore)
5. [Decisões de implementação importantes](#decisões-de-implementação-importantes)
6. [Processo de desenvolvimento com IA assistente](#processo-de-desenvolvimento-com-ia-assistente)
7. [Deploy e operação](#deploy-e-operação)
8. [Para quem for continuar este projeto](#para-quem-for-continuar-este-projeto) ⭐
9. [Considerações sobre LGPD e Comitê de Ética da UFVJM](#considerações-sobre-lgpd-e-comitê-de-ética-da-ufvjm) ⭐
10. [Trabalhos futuros sugeridos para pesquisa](#trabalhos-futuros-sugeridos-para-pesquisa)

---

## Visão geral e motivação

A escolha do tema veio da percepção de que segurança digital é frequentemente tratada como um assunto técnico distante do usuário comum. Vazamentos de dados, golpes do Pix, phishing por SMS, engenharia social via WhatsApp clonado — tudo isso afeta pessoas que não necessariamente têm conhecimento de TI. Eu queria atacar esse problema com uma ferramenta acessível, que ensinasse pouco a pouco e mantivesse o usuário engajado.

A inspiração foi o sucesso de jogos diários como **Pokédle** e **Valorantes Quiz**, que viralizaram exatamente porque oferecem um pequeno desafio de baixo custo cognitivo todo dia. Apliquei o mesmo modelo a um conteúdo de impacto social: cada dia, uma pergunta nova sobre cibersegurança às 12h, com pontuação que recompensa quem responde rápido e acerta de primeira.

Os pilares da experiência são:

1. **Aprendizado leve** — pergunta curta + 4 alternativas + explicação após resposta.
2. **Gamificação** — pontos, multiplicador de velocidade, ranking, medalhas.
3. **Dimensão social** — perfil público, ranking por universidade/cidade, fórum colaborativo.
4. **Sustentação** — premiações oferecidas por empresas parceiras como recompensa real.

## Decisões de stack

A maior restrição do projeto foi **custo zero**: desenvolvimento, hospedagem e operação até a defesa precisavam ser totalmente gratuitos. Isso filtrou drasticamente as opções.

### Frontend: Expo + React Native + TypeScript

Eu não tinha experiência prévia com desenvolvimento mobile nativo. Considerei três caminhos:

| Opção | Pró | Contra |
|---|---|---|
| **Android nativo (Kotlin)** | Mais profundidade técnica para defender | Curva alta, só Android, exige Android Studio |
| **Flutter** | Cross-platform, performático | Linguagem Dart menos comum, comunidade menor em PT-BR |
| **React Native + Expo** | Cross-platform, JavaScript/TypeScript familiar, Expo abstrai complexidade nativa | Performance levemente abaixo de nativo |

Escolhi **React Native + Expo** por três motivos práticos:

1. **Cross-platform com 1 codebase** — eu só tenho iPhone, mas o app precisava também rodar no web (deploy Vercel) e potencialmente em Android no futuro. Expo entrega os três sem mudanças significativas.
2. **JavaScript/TypeScript** — linguagem mais difundida, com material em português abundante. Importante para a defesa: cada peça do código consigo explicar.
3. **Expo simplifica o setup** — sem precisar de Android Studio, Xcode ou configuração nativa. `npx expo start` e o app já roda.

**TypeScript** veio quase por padrão — tipagem estática me deu muita segurança em refactors grandes (como quando refatorei o painel admin de scroll único para 6 abas), e os contratos de tipo nos services (ex: `DadosCadastro`, `Pergunta`, `ItemRanking`) tornaram o código auto-documentado.

**Expo Router 6** com roteamento file-based foi uma escolha defensável para a banca: cada arquivo em `app/` é uma rota, hierarquia visual clara, e os grupos `(auth)` / `(app)` permitem proteção de rotas com `<Redirect>` no layout — nada mais elegante.

### Backend: Firebase (Auth + Firestore)

Estudei três caminhos para o backend:

1. **Backend próprio** (Node.js + Express + PostgreSQL) — máximo controle, mas precisa de servidor (custo) e de toda a infra de auth, hash de senha, JWT, etc.
2. **Supabase** — alternativa open-source ao Firebase, com PostgreSQL.
3. **Firebase** — BaaS do Google, gratuito no plano Spark.

Escolhi **Firebase** por:

- **Plano Spark é grátis para sempre** — 50k usuários ativos no Auth, 50k leituras/dia no Firestore, 1GB de storage. Para uma prova de conceito de escala pequena, sobra muito.
- **Auth pronto** — email/senha, recuperação de senha, persistência de sessão (com `getReactNativePersistence` em RN), tudo encapsulado.
- **Firestore em tempo real** — a leitura via `onSnapshot` no `PerfilContext` mantém os pontos do usuário sempre atualizados na UI sem precisar de polling.
- **Comunidade grande** — qualquer dúvida tinha resposta no Stack Overflow.

A decisão tem uma desvantagem que eu reconheço: lock-in. Migrar fora do Firebase no futuro exigiria reescrever a camada de dados. Para uma prova de conceito isso é aceitável, mas em um produto comercial de longo prazo eu reconsideraria.

**Cloud Functions** foram inicialmente cogitadas para liberar a pergunta diária às 12h via cron. Decidi não usar porque: (1) Functions exigem o plano Blaze (cartão de crédito), e (2) consegui resolver o mesmo problema **sem servidor**, fazendo uma query no cliente que filtra `where("dataLiberacao", "<=", Timestamp.now())` ordenada decrescente. Cada pergunta nasce com seu `dataLiberacao` definido, e o app vê automaticamente a mais recente já liberada. Isso é defensável: "evitei custo desnecessário e uma dependência de infraestrutura, demonstrando que a lógica pode ser cliente quando o problema permite".

### Deploy: Vercel (web) + Expo Go (mobile)

Por restrição de orçamento, **Apple Developer Program** ($99/ano) ficou fora. Isso eliminou builds nativos iOS via TestFlight ou App Store.

A solução foi tripla:

1. **Vercel para web** — hospedagem estática gratuita ilimitada para projetos pessoais. Deploy via `vercel deploy --prod`. URL pública: `securio-woad.vercel.app`.
2. **PWA instalável no iPhone** — o site no Vercel pode ser adicionado à tela inicial pelo Safari (Compartilhar → Adicionar à Tela de Início), virando um "app" sem App Store, sem Apple Developer.
3. **Expo Go para demo nativo** — para mostrar a experiência mobile pura na banca, o app roda dentro do Expo Go (gratuito na App Store), sem build próprio.

Os três caminhos coexistem. Para o usuário final, recomendo PWA. Para a banca, posso mostrar Expo Go no meu iPhone para demonstrar fluidez nativa.

## Arquitetura

### Camadas

```
┌──────────────────────────────────────────────┐
│              Telas (app/*.tsx)               │
│  Cada arquivo é uma rota (Expo Router)       │
└──────────────┬───────────────────────────────┘
               │ usa
┌──────────────▼───────────────────────────────┐
│       Componentes (src/components/*)         │
│  Botão, CampoTexto, Avatar, Logo, Tela...    │
└──────────────┬───────────────────────────────┘
               │ usa
┌──────────────▼───────────────────────────────┐
│         Contextos (src/contexts/*)           │
│  AuthContext (sessão), PerfilContext (dados) │
└──────────────┬───────────────────────────────┘
               │ usa
┌──────────────▼───────────────────────────────┐
│         Services (src/services/*)            │
│  auth, quiz, ranking, forum, premiacoes,     │
│  parcerias, admins, usuarios, seed,          │
│  notificacoes — toda a lógica Firebase       │
└──────────────┬───────────────────────────────┘
               │ chama
┌──────────────▼───────────────────────────────┐
│    Firebase (Auth + Firestore)               │
└──────────────────────────────────────────────┘
```

A separação **telas → componentes → contextos → services → Firebase** é deliberada: nenhuma tela importa diretamente de `firebase/*`. Toda interação com o backend passa por um service específico do domínio. Isso facilita testes unitários e troca de backend no futuro.

### Roteamento

Usei a estrutura de **grupos** do Expo Router para separar telas autenticadas das públicas:

- `app/(auth)/` — login, cadastro, recuperação de senha. O layout do grupo redireciona usuários já logados para `/(app)/home`.
- `app/(app)/` — telas autenticadas (tab bar, hub, quiz, etc). O layout redireciona usuários não autenticados para `/(auth)/login`.

A proteção é declarativa, simples e segura:

```tsx
// app/(app)/_layout.tsx
const { usuario, carregando } = useAuth();
if (carregando) return null;
if (!usuario) return <Redirect href="/(auth)/login" />;
return <Tabs>...</Tabs>;
```

Rotas que **não fazem parte da tab bar** mas precisam ser acessíveis (perfil de outro usuário, painel admin, formulário de parceria, fórum) são marcadas com `href: null`:

```tsx
<Tabs.Screen name="usuario" options={{ href: null }} />
<Tabs.Screen name="admin" options={{ href: null }} />
```

### Estado global

Usei **React Context** em vez de Redux/Zustand. A decisão veio do princípio de simplicidade — só preciso de dois tipos de estado global:

1. **`AuthContext`** — usuário Firebase autenticado (ou `null`). Atualizado via `onAuthStateChanged`.
2. **`PerfilContext`** — perfil do usuário no Firestore (pontos, nickname, papel, etc). Atualizado em tempo real via `onSnapshot` — assim, quando o usuário ganha pontos no quiz, o cabeçalho atualiza automaticamente.

Redux seria overkill para isso. Context é suficiente, com a vantagem de ser API nativa do React (uma dependência a menos para defender).

## Modelo de dados (Firestore)

Sete coleções top-level:

### `users`
Documento por usuário. ID = `uid` do Firebase Auth.
```ts
{
  uid: string;
  email: string;
  nomeCompleto: string;
  nickname: string;        // único
  pontosTotais: number;
  avatarUrl?: string;
  papel: "admin" | "usuario";
  bio?: string;
  universidade?: string;
  cidade?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  criadoEm: Timestamp;
}
```

Subcoleção `users/{uid}/respostas/{perguntaId}` registra o histórico do usuário no quiz. Sub-coleção em vez de coleção top-level porque (1) a maioria das queries é "minhas respostas", e (2) ao deletar um usuário, suas respostas vão junto naturalmente.

### `perguntas`
```ts
{
  id: string;
  enunciado: string;
  alternativas: string[];   // sempre 4
  indiceCorreto: number;    // 0..3
  explicacao: string;
  categoria: string;
  dataLiberacao: Timestamp;
  ehSeed?: boolean;         // marca perguntas inseridas via seed
}
```

### `forumPosts` (com subcoleção `comentarios`)
```ts
// posts
{ userId, autorNickname, autorAvatarUrl?, titulo, conteudo, qtdComentarios, criadoEm, ehSeed? }
// posts/{id}/comentarios
{ userId, autorNickname, autorAvatarUrl?, conteudo, criadoEm }
```

`qtdComentarios` é um contador desnormalizado mantido com `increment(1)` / `increment(-1)` ao adicionar/remover comentário. Evita ter que fazer `count()` toda vez que listo posts (que custa 1 leitura/post na visualização).

### `premiacoes`, `parcerias`
Estruturas mais simples — o documento mostra o estado atual (em andamento / concluída, pendente / aprovada / rejeitada) e o admin opera nelas via painel.

## Decisões de implementação importantes

### Multiplicador de velocidade

O sistema de pontuação tem três regras combinadas:

1. **Pontos base:** 2 pts na 1ª tentativa, 1 pt na 2ª, 0 em caso de erro nas duas.
2. **Multiplicador:** `1 + max(0, (12 - horas_decorridas) / 12)`, indo de 2x logo após a liberação até 1x após 12 horas.
3. **Pontos finais:** `round(pontos_base * multiplicador)`.

A função está isolada em `src/utils/calcularPontos.ts` como **função pura** — recebe inputs, retorna outputs, sem efeitos colaterais. Isso facilita o teste e a explicação na banca: "o multiplicador é uma função pura, determinística, fácil de auditar".

Como a fórmula naturalmente cai a 1x após 12 horas, **perguntas anteriores** (acessadas dias depois) ganham apenas pontos base, sem bônus. Isso é justo: quem responde no dia certo é recompensado.

### Liberação da pergunta diária sem servidor

Em vez de uma Cloud Function agendada (paga), a "liberação" das 12h é uma **propriedade implícita da query**:

```ts
query(
  collection(db, "perguntas"),
  where("dataLiberacao", "<=", Timestamp.now()),
  orderBy("dataLiberacao", "desc"),
  limit(1)
)
```

Cada pergunta nasce com seu `dataLiberacao` definido. Às 11h59 de um dia, a pergunta de amanhã (com `dataLiberacao` = amanhã 12h) ainda não passa do filtro `<= now`. Às 12h00 ela passa, e como é a mais recente (`desc`), aparece como "pergunta do dia".

Isso é elegante e gratuito. A defesa: "o sistema não precisa de cron porque o tempo é uma propriedade dos dados, não uma ação do servidor".

### Paginação infinite scroll com Firestore

Para o ranking e o fórum, usei **paginação por cursor** com `startAfter`:

```ts
const q = cursor
  ? query(ref, orderBy("pontosTotais", "desc"), startAfter(cursor), limit(20))
  : query(ref, orderBy("pontosTotais", "desc"), limit(20));
```

A FlatList do React Native dispara `onEndReached` quando o usuário se aproxima do fim, e a próxima página é carregada. Isso escala bem para milhares de usuários — em vez de carregar tudo de uma vez, carrega 20 por vez.

### Ranking regional (índices compostos)

O ranking tem três visualizações: global, por universidade, por cidade. As duas últimas usam queries do tipo:

```ts
where("universidade", "==", "USP") + orderBy("pontosTotais", "desc")
```

Combinar `where + orderBy` no Firestore exige um **índice composto**. O Firestore não cria automaticamente — na primeira execução, retorna um erro com URL para criar o índice no console. Documentei isso no README. Para a defesa: "índices compostos são uma característica do Firestore para queries com múltiplos critérios; criar manualmente é um processo padrão e seguro".

### Sistema de roles (admin/usuario)

Em vez de hardcoded de e-mails admin no código, optei por um campo `papel` no documento do usuário. O primeiro admin é definido manualmente no Firebase Console; daí em diante, qualquer admin pode promover outros via painel.

Isso é defensável e escalável: "adotei controle de acesso baseado em papéis (RBAC) com persistência no banco. O sistema é extensível — basta adicionar novos papéis (moderador, editor) sem alteração de schema".

### Seguranção via Firestore Rules

As `firestore.rules` validam todas as operações:

- `users/{uid}` — leitura por qualquer autenticado (necessário para ranking); escrita só pelo dono, exceto campos administrativos (`papel`, `uid`, `email`) que ninguém pode alterar via cliente; admin pode tudo.
- `perguntas` — leitura por autenticado, escrita só admin.
- `forumPosts` — criação só com `userId == request.auth.uid` (impede falsificação de autoria).
- `parcerias` — criação aberta (formulário público), leitura/edição só admin.

A defesa: "as Security Rules implementam o princípio do menor privilégio — o cliente nunca confia em si mesmo, e o servidor valida quem pode fazer o quê".

### Animações e o problema do web

Usei `react-native-reanimated` 4 para animações fluidas (FadeInUp, FadeIn em cards e listas). No iPhone funciona perfeitamente. Mas descobri um bug no Reanimated 4 com Layout Animations no navegador: às vezes a animação trava no meio, deixando o elemento com `transform translateY(-20px)` permanente.

**Solução:** criei um helper `entradaNativa()` que retorna a animação apenas em mobile e `undefined` no web. Assim, no mobile há a transição fluida; no web, o elemento aparece direto, sem trava.

```ts
export function entradaNativa<T>(animacao: T): T | undefined {
  return Platform.OS === "web" ? undefined : animacao;
}
```

```tsx
<Animated.View entering={entradaNativa(FadeInUp.duration(280))}>...</Animated.View>
```

Defesa: "preferi degradação graciosa em vez de tentar contornar o bug com complexidade extra. Em mobile, animação completa; em web, animação omitida — ambos os usuários têm a UX adequada à plataforma".

### Output web e SPA

Originalmente exportei o web com `output: "static"` (Expo Router gera um HTML por rota). Isso quebrava ao dar F5 em URLs dinâmicas (`/usuario/seed_001` retornava 404 no Vercel porque o arquivo não existia).

Troquei para `output: "single"` (SPA verdadeira: 1 HTML, JS toma controle do roteamento) + `rewrites` no Vercel mandando todas as URLs para `/`. Agora F5 funciona em qualquer rota.

Trade-off: SEO básico se perde (cada rota não é pré-renderizada). Para um app com login obrigatório em todas as telas relevantes, SEO não é prioridade.

### Seeds com `writeBatch`

Para popular 300 usuários, 50 perguntas, 12 dicas e 3 premiações de uma vez, usei `writeBatch` do Firestore (até 500 operações por batch). Isso reduz o tempo de execução de ~30 segundos (uma operação por vez) para ~2 segundos (batch único).

Os usuários são gerados de forma **determinística** com um RNG semeado, garantindo que o mesmo seed produz sempre os mesmos 300 usuários — facilita a limpeza posterior (sei exatamente quais UIDs criar/apagar).

## Processo de desenvolvimento com IA assistente

> Esta prova de conceito foi implementada em sessões intensivas de **pair programming com Claude (Opus 4.7)**, da Anthropic, através do **Claude Code** (CLI oficial), usando o **plano Max 5x**.

A entrega formal exigida pelo TCC era apenas o protótipo de média fidelidade no Figma. A implementação desta prova de conceito foi uma decisão minha de ir além do escopo — usei o Claude exatamente para viabilizar essa entrega extra em tempo hábil. Sem essa ferramenta, levantar uma stack que eu não dominava (React Native, Expo, Firebase, deploy moderno) e produzir um app navegável dentro da janela disponível seria muito mais difícil.

Considero que a integração responsável com IA é um diferencial profissional na engenharia atual, e por isso a transparência total:

### Como foi a colaboração

- **Decisões técnicas:** tomei eu, a partir das opções e tradeoffs apresentados pelo modelo. Por exemplo: ao escolher entre Cloud Functions e lógica cliente-side para a pergunta diária, foi minha decisão (motivada pela restrição de custo e pela elegância da solução proposta).
- **Código:** escrito colaborativamente. O modelo gerava propostas de implementação e eu validava, ajustava, ou pedia para refazer. Toda mudança passou pelo meu aval.
- **Arquitetura:** definida em conversa. Quando o painel admin ficou grande demais, eu pedi para refatorar em abas — o modelo propôs uma estrutura, eu aprovei, ele executou.
- **Bugs e troubleshooting:** o modelo me ajudou a diagnosticar problemas (cache do Metro com novo pacote, índices compostos do Firestore, animações travando no web). Eu validei cada hipótese em produção.

### O que eu aprendi no processo

- **Stack que eu não conhecia:** entrei sabendo o básico de React. Saio com domínio confortável de React Native, Expo Router, Firestore, Reanimated e deploy moderno.
- **Decisões de tradeoff:** o modelo foi excelente em listar prós e contras de cada caminho. Aprendi a sopesar custo, tempo, defensibilidade e qualidade.
- **Ler código gerado:** desenvolvi capacidade de revisar código que eu não escrevi, identificando o que estava bom e o que precisava de ajuste.
- **Validar tudo manualmente:** o modelo às vezes erra. Cada feature foi testada por mim no Expo Go e no Vercel antes de aprovar.

### O que eu fiz sozinho (sem IA)

- **Concepção do projeto e proposta de TCC:** documento de planejamento original, alinhamento com a orientadora.
- **Protótipo no Figma:** todas as telas desenhadas antes da implementação (a entrega formal do TCC).
- **Identidade visual:** logo do escudo de circuito, paleta de cores cyberpunk.
- **Conta e configurações dos serviços:** Firebase, Vercel, GitHub, e-mail de domínio acadêmico.
- **Decisões finais sobre o produto:** o que entra na prova de conceito, o que vai para roadmap, onde simplificar.

### Reconhecendo o crédito

Os commits do repositório registram explicitamente `Co-Authored-By: Claude`. Não é um detalhe estético — é a maneira correta e honesta de creditar a contribuição da ferramenta.

A leitura que faço dessa colaboração: **"usei Claude como ferramenta de produtividade, da mesma forma que um engenheiro usa Stack Overflow, GitHub Copilot ou um colega sênior em pair programming. A diferença é a velocidade e a profundidade de conhecimento técnico que a IA traz. Mas todas as decisões — o que construir, como construir, e por que — foram minhas. O que eu produzi com IA aqui é qualitativamente similar ao que produziria sem ela em muito mais tempo, mas com ganho expressivo de aprendizado por unidade de tempo investido."**

## Deploy e operação

### Vercel (web)

Deploy via CLI:
```bash
npx vercel deploy --prod
```

Configurado em `vercel.json`:
- `buildCommand`: `npx expo export --platform web` — gera `dist/`
- `outputDirectory`: `dist`
- `cleanUrls: true` — URLs sem `.html`
- `rewrites`: tudo para `/` (SPA)

Free tier do Vercel cobre indefinidamente: 100GB de bandwidth, deploys ilimitados, custom domain via DNS.

### Firebase

Plano **Spark (gratuito)**:
- Auth: 50k usuários ativos/mês
- Firestore: 50k leituras + 20k escritas + 1GB storage por dia
- Sem expiração

Único cuidado: as **Security Rules** começam em modo de teste com expiração de 30 dias. Para uso real, o arquivo `firestore.rules` do repositório deve ser publicado no console antes da expiração.

### Expo Go + EAS Update

Para distribuição mobile sem App Store/Apple Developer:

1. App fica publicado no Expo Update.
2. Usuário instala Expo Go (gratuito) e abre o link/QR do app.
3. Bundle baixa e fica em cache — funciona depois mesmo sem dev server.

### PWA no iPhone

Instalação como app via Safari:
1. Abrir o site no Safari.
2. Compartilhar → "Adicionar à Tela de Início".
3. App aparece como ícone na home screen, abre em tela cheia.

Configurado em `app.json` com `display: "standalone"`, theme color e splash screen.

## Para quem for continuar este projeto

Esta seção é a parte mais importante deste documento se você está pegando o Securio para evoluir até um produto real. Aqui catalogo tudo que conscientemente **deixei pendente** ou **simplifiquei** durante o desenvolvimento da prova de conceito, com motivação e sugestão de como abordar cada item.

A intenção não é uma checklist superficial — é um guia técnico honesto do que separa este protótipo de um produto bem testado e robusto.

### 🔐 Segurança técnica

Pendências por ordem de criticidade:

| # | Item | Por que falta | Como resolver |
|---|---|---|---|
| 1 | **Validação server-side de pontos** | Toda lógica de incremento de pontos roda no cliente. Em teoria, um usuário avançado pode editar `pontosTotais` direto via console do navegador (Firebase JS SDK exposto). Para uma prova de conceito foi aceitável, mas em produção é brecha crítica. | Migrar `registrarResposta` para uma **Cloud Function** que recebe a resposta, valida no servidor, calcula pontos, escreve no Firestore. Cliente só faz a chamada — não toca nos pontos diretamente. Plano Blaze necessário. |
| 2 | **Pen test e revisão OWASP** | Não foi feita auditoria de segurança formal. Apenas inspeção visual das Firestore Rules. | Contratar (ou pedir voluntário) um pentester para rodar OWASP Mobile Top 10 + revisar as `firestore.rules`. |
| 3 | **Rate limiting em endpoints** | Firestore tem quotas globais, mas não há proteção contra brute force específico (ex: tentar logar 1000 vezes em 1 minuto). | Cloud Functions com middleware de rate limiting + Cloudflare na frente do Vercel. |
| 4 | **2FA / MFA** | Não implementado. Firebase Auth suporta SMS-based MFA mas requer plano Identity Platform (pago). | Avaliar custo. Como alternativa: TOTP via app (Google Authenticator) implementado manualmente. |
| 5 | **Logs de auditoria** | Não há trilha de auditoria de ações sensíveis (admin promovendo outro admin, exclusões de posts, alterações de papel). | Cloud Function que escreve em coleção `auditoria` toda ação relevante, com `userId`, `acao`, `target`, `timestamp`. |
| 6 | **Backup automático Firestore** | Sem snapshots regulares. Se alguém com acesso ao Firebase apagar o banco, conteúdo é perdido. | Configurar export agendado para Cloud Storage via Cloud Functions ou cron externo. |
| 7 | **Política de senhas forte** | Firebase Auth aceita senha de 6 caracteres por padrão. Não há requisito de complexidade. | Validar no cliente (regex) E no Cloud Function de cadastro: mínimo 10 caracteres, mistura de tipos. |
| 8 | **Proteção contra DDoS** | Vercel free tier tem proteção básica, mas Firestore não. Atacante pode esgotar quota gratuita com leituras maliciosas. | Cloudflare em frente + Firebase App Check (verifica que requests vêm do app legítimo). |
| 9 | **Sanitização de inputs no fórum** | Posts e comentários são salvos como texto plano. Sem renderização de markdown ou HTML, mas sem proteção contra XSS futuro caso seja adicionado. | Se markdown for adicionado: usar biblioteca segura (e.g. `react-native-markdown-display`) e sanitizar com DOMPurify-equivalent antes de salvar. |

### 🧪 Qualidade e testes

| # | Item | Status atual | Sugestão |
|---|---|---|---|
| 1 | **Testes unitários** | 0% de cobertura | Começar pelas funções puras: `calcularPontos`, `formatarCnpj`, `tempoAteProximaPergunta`. **Jest + React Native Testing Library**. |
| 2 | **Testes de integração** | Não existem | Testar services com **Firebase Emulator** (cadastro completo, login, salvar resposta). |
| 3 | **Testes E2E** | Não existem | **Maestro** ou **Detox**. Cobrir os fluxos críticos: cadastro → login → responder quiz → ver pontos atualizados. |
| 4 | **CI/CD** | Apenas deploys manuais | GitHub Actions: rodar lint + tsc + tests em cada PR; deploy automático na main para Vercel; build EAS no schedule. |
| 5 | **Error tracking** | Erros ficam no console do navegador / Expo | **Sentry** (free tier generoso) ou **Firebase Crashlytics**. |
| 6 | **Analytics de produto** | Sem instrumentação | **Firebase Analytics** ou **PostHog** (open-source). Tracking de eventos: `quiz_responded`, `post_created`, `partnership_submitted`. |
| 7 | **Lint** | ESLint configurado mas não rodado em CI | Adicionar `npm run lint` ao CI obrigatório. |
| 8 | **Ofuscação de código** | `npx expo export` gera bundle não ofuscado | Em produção, configurar `metro.config.js` com ofuscação ou usar build EAS que já minifica. |
| 9 | **Performance budget** | Não medido | Lighthouse CI para web; React Profiler em telas críticas (Quiz, Ranking). |
| 10 | **Acessibilidade** | Sem auditoria | Auditoria com [Accessibility Inspector iOS](https://developer.apple.com/accessibility/) + lighthouse a11y score; adicionar `accessibilityLabel`, `accessibilityRole` em componentes interativos. |

### 🎨 Fidelidade visual ao Figma

Comparei o app ao [protótipo Figma](https://www.figma.com/design/31mshRyEJ3thfybxoS4uLh/Securio---O-CyberQuiz) durante o desenvolvimento, mas **não fiz revisão pixel-a-pixel**. Há divergências:

| # | Item | Divergência | Como ajustar |
|---|---|---|---|
| 1 | **Fonte tipográfica** | Figma usa fonte específica (provavelmente Poppins ou similar). App usa fonte de sistema. | Instalar `expo-font` + Google Fonts (`@expo-google-fonts/poppins`). Aplicar em `theme.ts` e referenciar nos estilos. |
| 2 | **Background com circuito digital** | Figma tem ilustração detalhada de circuitos. App usa SVG genérico (grid + pontos). | Exportar SVG do Figma e usar como `<SvgUri>` ou `<Image source={...}>` em `BackgroundCyber.tsx`. |
| 3 | **Animações específicas** | Figma tem prototyping com microinterações específicas. App tem animações genéricas (FadeInUp). | Catalogar animações do Figma e implementar com Reanimated. |
| 4 | **Cores exatas** | Hex codes podem divergir 1-2% do Figma. | Pegar cores exatas do Figma (Inspect mode → hex) e atualizar `theme.ts`. |
| 5 | **Espaçamentos pixel-perfect** | Padding/margin foram aproximados. | Auditoria tela por tela, comparando com Figma. Ajustar `espacos.{xs,sm,md,lg,xl,xxl}`. |
| 6 | **Ícones do tab bar** | Estou usando Ionicons. Figma pode ter ícones customizados. | Se Figma tem ícones próprios, exportar como SVG e usar `react-native-svg`. |
| 7 | **Estados de loading/error/empty** | Foi feito de forma genérica. Figma pode ter estados específicos. | Replicar exatamente os estados do Figma. |
| 8 | **Telas que não estão no app** | Figma pode ter telas de onboarding, tutorial, configurações detalhadas que não foram implementadas. | Auditar Figma vs `app/` e criar telas faltantes. |

### 💎 Produto e funcionalidades

Faltam recursos importantes para um produto real:

#### Autenticação
- Login com Google (configurar OAuth no Firebase + `expo-auth-session`)
- Login com Apple (obrigatório se publicar na App Store)
- Login com email mágico (link por email, sem senha)
- Recuperação de senha por SMS

#### Onboarding
- Tutorial inicial (3-5 telas explicando o app)
- Tour guiado em primeira sessão (highlights nas funcionalidades)
- Estado "novo usuário" com sugestões personalizadas

#### Engajamento
- Sistema de **badges/conquistas** (ex: "Primeira resposta", "10 dias seguidos", "Top 100 ranking")
- **Streaks** (sequência de dias respondendo) com recompensa
- **Notificações in-app** (não só push) para feedback de ações
- **Sons e haptics** ao acertar/errar (já tem `expo-haptics` instalado, falta usar)
- Animação de celebração ao subir no ranking
- Compartilhamento social do resultado diário (igual Wordle/Pokédle)

#### Conteúdo
- Banco de **500+ perguntas** (atualmente só 50)
- **Curadoria por especialista** em segurança da informação
- **Fontes/referências** em cada explicação
- **Multimídia** (imagens, vídeos curtos) em perguntas
- **Categorização visível** com filtros
- Perguntas com **casos reais** de notícias recentes
- **Dificuldade variável** (fácil / médio / difícil) com pontuação proporcional

#### Social
- **Seguir** outros usuários
- **Feed de atividade** (quem você segue respondeu, postou)
- **Chat privado** entre usuários
- **Grupos/turmas** (professores criam grupos para alunos)
- **Reportar conteúdo** inapropriado
- **Bloqueio de usuários**
- **Convidar amigos** (link de convite)

#### Moderação
- **Filtro de palavrões** automático nos comentários
- **Sistema de denúncias** com fila para admin
- **Suspensão temporária** de contas
- **Histórico de moderação** transparente

#### Premiações
- **Pix integrado** para pagamento automático de prêmios pequenos (API Pix)
- **Comprovante de envio** do prêmio anexado pela empresa
- **Avaliação do patrocinador** pelos vencedores
- **Status detalhado** (em análise → enviado → recebido pelo vencedor)

#### Admin
- **Dashboard analítico** (gráficos de engajamento, perguntas mais erradas, distribuição geográfica)
- **Filtros e busca** em todas as listagens
- **Exportar dados** (CSV de usuários, respostas, etc.)
- **Configurações globais** (qual horário libera pergunta, multiplicador, etc.)
- **Sistema de feature flags** para roll-out gradual

### ⚙️ Infraestrutura

| # | Item | Pendência |
|---|---|---|
| 1 | **Cloud Functions** | Zero usadas. Migrar lógica crítica para servidor. |
| 2 | **App Check** | Não configurado. Proteção contra requests fora do app. |
| 3 | **Custom domain** | Usando `securio-woad.vercel.app`. Migrar para `securio.com.br` ou similar. |
| 4 | **CDN para assets** | Imagens servidas pelo Vercel. Considerar Cloudinary para otimização. |
| 5 | **Versionamento de API** | Sem schema versioning no Firestore. Adicionar campo `versao` em docs. |
| 6 | **Migrations** | Mudanças no schema feitas manualmente. Implementar processo formal. |
| 7 | **Monitoring de uptime** | Sem alertas se app cair. UptimeRobot (free) + Discord/Email. |
| 8 | **Disaster recovery plan** | Sem documentação. RPO/RTO não definidos. |

### 📱 Mobile específico

- **Build iOS nativo** via TestFlight (precisa Apple Developer Program — $99/ano)
- **Build Android nativo** via EAS Build (gratuito) — APK assinado para distribuição
- **App Store / Play Store listing** (capturas de tela, descrição, palavras-chave)
- **Push notifications via servidor** (atualmente é local-only — em produção precisa servidor de envio com FCM tokens armazenados)
- **Deep linking** universal (abrir perfil pelo link `securio.app/usuario/X`)
- **Modo offline** para o quiz (cache da pergunta do dia)

### 🌍 Internacionalização

- Apenas português atualmente. Para escalar:
  - **`react-i18next`** ou **`expo-localization`** + **i18n-js**
  - Traduzir todas as strings da UI para inglês e espanhol (público latino)
  - Traduzir as 500+ perguntas (desafio de curadoria, não só técnica)
  - Suporte a RTL caso queira árabe/hebraico no futuro

### 🚦 Roadmap sugerido para evoluir até produção

Se outro desenvolvedor fosse pegar este protótipo e levar até produto real, sugiro essa ordem de prioridades:

**Fase 1 — Segurança crítica (4-6 semanas):**
1. Migrar pontos para Cloud Function (validação server-side)
2. Pen test e revisão OWASP Mobile Top 10
3. Configurar Firebase App Check
4. Rate limiting e proteção contra brute force
5. Logs de auditoria

**Fase 2 — Qualidade (6-8 semanas):**
1. Testes unitários (cobertura > 70% nas funções core)
2. Testes E2E com Maestro ou Detox
3. CI/CD com GitHub Actions
4. Sentry / Crashlytics
5. Lint obrigatório no CI

**Fase 3 — Conteúdo e engajamento (8-12 semanas):**
1. Banco de 500+ perguntas com curadoria por especialista
2. Sistema de badges e conquistas
3. Streaks (sequência de dias)
4. Compartilhamento social
5. Onboarding inicial

**Fase 4 — Distribuição (4-6 semanas):**
1. Apple Developer + build iOS + TestFlight
2. Google Play Console + APK assinado
3. App Store Optimization (ASO)
4. Beta com 50-100 usuários reais
5. Lançamento público

**Total estimado:** 5 a 7 meses de trabalho de uma pessoa em tempo integral, ou 2-3 meses com equipe pequena (2-3 devs + designer + curador de conteúdo).

## Considerações sobre LGPD e Comitê de Ética da UFVJM

Esta seção é especialmente importante para pesquisadores que queiram continuar este projeto **com usuários reais** — seja em estudo acadêmico, validação de hipóteses, coleta de dados de aprendizado ou pesquisa de retenção.

### Posicionamento atual neste protótipo

No estágio atual do projeto, **conscientemente não se tratou da conformidade com a LGPD nem se submeteu o projeto ao Comitê de Ética em Pesquisa (CEP) da UFVJM**, e isso é uma decisão fundamentada nos seguintes pontos:

1. **O escopo deste TCC é uma revisão bibliográfica + protótipo demonstrativo.** Não há pesquisa empírica com usuários reais, não há coleta de dados de pesquisa, e não há sujeitos humanos sendo estudados.
2. **A prova de conceito funcional não está aberta ao público em campanha de captação de usuários.** Os cadastros existentes durante o desenvolvimento foram do próprio autor e de algumas pessoas próximas, exclusivamente para teste de funcionamento.
3. **Não há análise estatística, comportamental ou inferencial** sendo feita sobre os dados de uso.
4. **A defesa do TCC** apresenta a proposta e o protótipo, não resultados de uso real.

Por essas razões, o projeto neste estágio se enquadra como **prova de conceito técnico**, e não como pesquisa que envolva sujeitos humanos sob a ótica das Resoluções CNS 466/2012 e 510/2016.

### O que precisa ser feito em trabalhos futuros

A partir do momento em que um pesquisador queira **abrir o app para captação de usuários reais e usar o uso deles como objeto de estudo**, o quadro muda completamente. Aí passam a ser obrigatórios:

#### Submissão ao Comitê de Ética em Pesquisa da UFVJM (CEP-UFVJM)

- **Quando submeter:** antes de qualquer divulgação pública do app com objetivo de pesquisa, ou antes de qualquer coleta de dados que envolva sujeitos humanos.
- **Plataforma:** [Plataforma Brasil](https://plataformabrasil.saude.gov.br/) — sistema oficial do governo para registro de pesquisas com seres humanos. O pesquisador entra com o projeto e é direcionado ao CEP-UFVJM.
- **Documentos esperados:**
  - Projeto detalhado da pesquisa (objetivos, metodologia, riscos, benefícios)
  - **Termo de Consentimento Livre e Esclarecido (TCLE)** — documento que cada participante assina ciente da natureza, riscos e seu direito de sair a qualquer momento
  - Cronograma e orçamento
  - Currículo do pesquisador responsável (Lattes)
  - Anuência da UFVJM
- **Tempo médio de análise:** 30 a 90 dias.
- **Riscos avaliados:** mesmo em pesquisas online de baixo risco como esta seria, o CEP avalia possíveis impactos psicológicos, de privacidade e de exposição.

#### Adequação à LGPD (Lei 13.709/2018)

- **Política de Privacidade publicada e acessível** antes do cadastro, descrevendo: dados coletados, finalidades, base legal, retenção e direitos do titular.
- **Termos de Uso** definindo regras de uso da plataforma.
- **Base legal** para o tratamento — provavelmente "consentimento" (Art. 7º, I) ou "execução de contrato" (Art. 7º, V), a depender do enquadramento.
- **Registro de consentimento** persistente (timestamp, IP, versão dos termos aceitos).
- **Direitos do titular operacionalizados** — exclusão de conta, portabilidade dos dados, correção, revogação do consentimento.
- **Encarregado pelo Tratamento de Dados (Art. 41)** — pessoa nomeada com canal de contato público.
- **Relatório de Impacto à Proteção de Dados Pessoais (RIPD)** quando aplicável.
- **Adequação do tratamento de dados de menores** caso o público-alvo inclua adolescentes (Art. 14).

#### Práticas de privacidade by design ao continuar o desenvolvimento

- Minimização de coleta — coletar apenas o estritamente necessário para a finalidade declarada.
- Anonimização ou pseudonimização sempre que possível na análise de dados de pesquisa.
- Criptografia em trânsito e em repouso.
- Plano de retenção e descarte de dados ao final do estudo.
- Auditoria periódica do uso dos dados.

#### Sugestão de fluxo para o próximo pesquisador

1. **Antes de qualquer divulgação pública do app:**
   - Submeter projeto à Plataforma Brasil → CEP-UFVJM
   - Aguardar parecer favorável
   - Redigir Política de Privacidade e Termos de Uso com apoio de assessoria jurídica
   - Implementar fluxos técnicos de adequação à LGPD (exclusão, portabilidade, registro de consentimento)
   - Designar um Encarregado pelos Dados Pessoais
2. **Durante a pesquisa:**
   - Coletar TCLE de cada participante
   - Manter logs de auditoria
   - Garantir que dados sejam acessíveis apenas a equipe autorizada
3. **Após a pesquisa:**
   - Anonimizar ou descartar dados conforme cronograma aprovado pelo CEP
   - Publicar resultados sem expor identidades
   - Manter relatórios de conformidade

> **Importante:** o autor deste protótipo não é especialista em direito digital nem em ética em pesquisa. Esta seção é orientativa — pesquisadores que continuarem o projeto **devem buscar apoio formal junto ao CEP-UFVJM, à PROCAD/UFVJM e a um(a) profissional de direito digital** antes de qualquer ação que envolva sujeitos humanos ou tratamento de dados pessoais reais.

## Trabalhos futuros sugeridos para pesquisa

Para alunos de Sistemas de Informação que queiram continuar o trabalho:

1. **Estudo de eficácia educacional** — A/B testing comparando aprendizado tradicional vs gamificado.
2. **Curadoria automatizada de perguntas** — usando LLMs para gerar e validar perguntas a partir de fontes confiáveis (cartilhas CERT.br, MITRE ATT&CK, etc.).
3. **Análise de comportamento** — quais categorias de cibersegurança têm mais erros? Onde está a maior vulnerabilidade educacional?
4. **Integração com instituições de ensino** — API para que universidades possam usar o app como ferramenta complementar.
5. **Modelo de premiação tokenizado** — explorar uso de tokens não-fungíveis para certificações de aprendizado.
6. **Estudo de retenção** — quais features mais aumentam o retorno diário (streaks, ranking, fórum)?
7. **Acessibilidade para PCD** — adaptação para usuários com deficiência visual ou cognitiva.
8. **Versão para crianças** — adaptação pedagógica e de UI para faixas etárias mais jovens.
9. **Comparativo com plataformas existentes** — Securio vs PortSwigger Academy vs TryHackMe (foco em conscientização vs hands-on).
10. **Estudo de modelo de negócio** — viabilidade de sustentação via patrocínios, freemium ou parcerias institucionais.

---

Documento mantido por **Matheus Brandão**.
Última revisão: 2026-04-29.
Para sugestões de melhoria desta documentação, abrir issue no [GitHub](https://github.com/matheuslfbrandao/securio/issues).
