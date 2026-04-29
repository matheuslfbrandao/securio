# 🔔 Lembrete prioritário pra próxima sessão

> Claude: ao iniciar uma nova conversa neste projeto, **lembre o usuário Matheus** sobre as pendências abaixo logo na primeira resposta. Ele pediu explicitamente que essas coisas fossem resgatadas.

## ⚡ Pendência principal: EAS Update

Tentamos publicar o app no EAS Update (Expo) em **2026-04-29** mas o serviço estava aparentemente fora do ar. Não foi concluído.

**Como retomar quando o serviço voltar:**

```bash
cd "c:/Users/mathe/OneDrive/Desktop/Securio/securio"
npx eas-cli@latest login
npx eas-cli update --branch production --message "Versão TCC"
```

A primeira vez vai pedir login (mesmo email do Expo Go). Depois publica.

**Como verificar se o serviço voltou:**
- https://status.expo.dev — página oficial de status do Expo
- Se aparecer "All systems operational" → pode tentar
- Se aparecer incidente em "EAS Update" ou "API" → ainda em manutenção

**Por que isso importa pro TCC:**
Com EAS Update publicado, o app fica disponível no **Expo Go** independentemente do `npx expo start` rodando no PC. Ideal pra mostrar na banca via QR code estável.

## 📋 Outras pendências pré-defesa (opcionais)

- [ ] **PWA no iPhone** — pegar o iPhone, abrir Safari em https://securio-woad.vercel.app, Compartilhar ⬆️ → "Adicionar à Tela de Início". Tempo: 1 minuto.
- [ ] **Vídeo backup da apresentação** — gravação de tela do iPhone navegando pelas principais funcionalidades (cadastro → quiz → ranking → premiações → fórum → painel admin). Plano C caso o Wi-Fi falhe. Tempo: 15 min.

## 📅 Defesa do TCC

Final de junho/2026 (data exata a confirmar). Antes disso garantir:

- [x] App online no Vercel
- [x] Firestore Rules de produção aplicadas
- [x] Índices compostos criados (universidade + cidade)
- [x] Repo no GitHub limpo (1 commit)
- [ ] EAS Update publicado
- [ ] PWA no iPhone instalada
- [ ] Vídeo backup gravado

## 🔗 Links rápidos

- **Demo web:** https://securio-woad.vercel.app
- **GitHub:** https://github.com/matheuslfbrandao/securio
- **Figma:** https://www.figma.com/design/31mshRyEJ3thfybxoS4uLh/Securio---O-CyberQuiz
- **Firebase Console:** https://console.firebase.google.com (projeto Securio)
- **Vercel Dashboard:** https://vercel.com/matheusfonseca-3097s-projects/securio

---

*Arquivo criado em 2026-04-29 a pedido do Matheus para servir de memória entre sessões.*
