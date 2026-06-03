<div align="center">

# Securio · O CyberQuiz

**Conscientização em cibersegurança através de quizzes diários gamificados.**

[![Status](https://img.shields.io/badge/Status-Prot%C3%B3tipo_+_Prova_de_Conceito-3DD9C7?style=flat)](#-status-do-projeto)
[![License: MIT](https://img.shields.io/badge/License-MIT-3DD9C7.svg)](https://opensource.org/licenses/MIT)

🌐 **Demo:** [securio-woad.vercel.app](https://securio-woad.vercel.app)
🎨 **Protótipo Figma:** [Securio · O CyberQuiz](https://www.figma.com/design/31mshRyEJ3thfybxoS4uLh/Securio---O-CyberQuiz?node-id=0-1)

</div>

---

## 🎓 Sobre a pesquisa

Este repositório faz parte do **Trabalho de Conclusão de Curso** do Bacharelado em **Sistemas de Informação** da **UFVJM**. O TCC é uma **revisão bibliográfica** sobre o uso de gamificação como ferramenta de conscientização em segurança da informação, com proposta concreta materializada em um **protótipo de média fidelidade**.

A entrega formal exigida pelo TCC é o **protótipo no Figma** (linkado acima). Este repositório vai além: contém uma **prova de conceito funcional** implementada em cima do protótipo, **com o objetivo explícito de facilitar o trabalho de pesquisadores futuros** que queiram dar continuidade à proposta — seja em outro TCC, mestrado, doutorado ou desenvolvimento como produto real.

**Por que entregar uma prova de conceito além do protótipo?** Porque um app navegável real reduz drasticamente a barreira de entrada para quem pegar este trabalho. Em vez de receber apenas mockups estáticos, o próximo pesquisador encontra fluxos navegáveis e uma base de referência funcionando, demonstrando que a proposta é tecnicamente viável.

## 📌 Status do projeto

| Entrega | Status | Onde ver |
|---|---|---|
| **Protótipo de média fidelidade (Figma)** — entrega formal do TCC | ✅ Concluído | [Link do Figma](https://www.figma.com/design/31mshRyEJ3thfybxoS4uLh/Securio---O-CyberQuiz?node-id=0-1) |
| **Revisão bibliográfica e proposta** — entrega formal do TCC | ✅ Concluído | Texto do TCC |
| **Prova de conceito funcional** — entrega extra para apoiar trabalhos futuros | ✅ Concluído | Este repositório / [demo](https://securio-woad.vercel.app) |
| **Produto pronto para uso público** | ⏳ Trabalho futuro | Ver [DOCUMENTACAO.md](DOCUMENTACAO.md#para-quem-for-continuar-este-projeto) |

> ⚠️ Esta é uma **prova de conceito para demonstração e base de continuidade** — não está pronta para uso em produção. Pendências completas estão catalogadas na [documentação técnica](DOCUMENTACAO.md#para-quem-for-continuar-este-projeto).

## 💡 A proposta

Inspirado em jogos diários de sucesso como **Pokédle** e **Valorantes Quiz**, o Securio aplica a mesma fórmula a um tema de impacto social: a **cibersegurança**. Todo dia ao meio-dia uma pergunta nova é liberada, com pontuação que recompensa quem responde rápido e acerta de primeira.

Os pilares da experiência:

- **Aprendizado leve** — pergunta curta + 4 alternativas + explicação após resposta
- **Gamificação** — pontos, multiplicador de velocidade, ranking, medalhas
- **Dimensão social** — perfil público, ranking por universidade/cidade, fórum colaborativo
- **Sustentação** — premiações oferecidas por empresas parceiras como recompensa real

## ✨ Principais funcionalidades

- 🎮 Quiz diário com perguntas anteriores acessíveis
- 🏆 Ranking global, por universidade e por cidade
- 👤 Perfil customizável com redes sociais opcionais
- 🎁 Premiações em andamento e concluídas
- 🤝 Formulário "Seja um Parceiro" para empresas
- 💬 Fórum colaborativo de dicas de segurança
- 🔑 Painel administrativo completo
- 🔔 Notificações push do quiz diário (mobile)
- 📱 Disponível como **PWA** (instalável no celular pelo navegador)

## 🎯 Para pesquisadores que continuarem este projeto

A documentação técnica completa está em **[DOCUMENTACAO.md](DOCUMENTACAO.md)** e cobre:

- Motivação e decisões de projeto
- Arquitetura e modelo de dados da prova de conceito
- O que foi implementado e o que conscientemente ficou de fora
- **Pendências detalhadas para evoluir até produto** (segurança, testes, conteúdo, distribuição)
- **Considerações sobre LGPD e Comitê de Ética da UFVJM** — exigências para uma futura pesquisa com usuários reais
- 10 sugestões de **trabalhos futuros de pesquisa** que podem se apoiar nesta prova de conceito

## 🛠️ Tecnologias

Construído com tecnologias modernas e gratuitas:

- **React Native + Expo** (mobile cross-platform)
- **TypeScript** (tipagem estática)
- **Firebase** (autenticação + banco de dados)
- **Vercel** (deploy web)

A escolha de cada uma e suas alternativas são discutidas em [DOCUMENTACAO.md](DOCUMENTACAO.md#decisões-de-stack).

## 📥 Como rodar localmente

Pré-requisitos: Node.js ≥ 18 e o app Expo Go no celular.

```bash
git clone https://github.com/matheuslfbrandao/securio.git
cd securio
npm install
npx expo start
```

Configuração do Firebase e detalhes de deploy estão em [DOCUMENTACAO.md](DOCUMENTACAO.md#deploy-e-operação).

## 👤 Autor

**Matheus Brandão**
Bacharelando em Sistemas de Informação · UFVJM
matheus.fonseca@ufvjm.edu.br

## 🙏 Créditos

- **Anthropic** — a implementação da prova de conceito foi assistida por **Claude (Opus 4.7)** via Claude Code, no plano Max 5x. Detalhes em [DOCUMENTACAO.md](DOCUMENTACAO.md#processo-de-desenvolvimento-com-ia-assistente).
- **DiceBear** — geração dos avatares (estilo bottts)
- **Ionicons** — biblioteca de ícones

## 📜 Licença

Distribuído sob a licença **MIT**. Veja [LICENSE](LICENSE) para detalhes. Pode ser usado livremente como base para pesquisas e projetos derivados.

---

<div align="center">

Trabalho de Conclusão de Curso · Bacharelado em Sistemas de Informação · UFVJM · 2026

</div>
