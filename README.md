# 🌌 AtlasAI — Intelligent Marketing & Creative Autonomous Agent

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?style=for-the-badge&logo=google" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Meta%20Graph%20API-v21.0-1877F2?style=for-the-badge&logo=meta" alt="Meta Graph API" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</div>

<br />

**AtlasAI** é uma plataforma SaaS premium e moderna que atua como copiloto e agente autônomo para equipes de marketing digital, gestores de tráfego e criadores de conteúdo. O sistema combina análise de funil, redação persuasiva (copywriting), geração de criativos visuais para anúncios e publicação direta em redes sociais via **Meta Graph API**.

---

## ✨ Principais Funcionalidades

### 1. 🤖 Agente de Estratégia de Mídia & Marketing
* **Conversação Contextual e Multi-turn:** Agente inteligente alimentado pelo Google Gemini com memória das conversas e Function Calling em tempo real.
* **Diagnóstico de Métricas e Campanhas:** Sugestão de alocação de verba, planejamento de funil (topo, meio e fundo) e análise de KPIs.
* **Instruções Personalizadas:** Configuração de diretrizes e regras de tom de voz personalizadas pelo usuário em seu perfil.

### 2. 🎨 Creative Studio & Design Visual
* **Geração de Artes Publicitárias:** Criação de imagens de anúncios em proporções oficiais (Feed 1:1, Retrato 4:5, Stories/Reels 9:16 e Banner 16:9).
* **Renderizador Visual no Chat:** Visualização interativa no próprio chat com loading estilizado, prévia em alta definição, opção de download e fallback inteligente.
* **Copywriting Integrado:** Geração automática de headlines de alto impacto, legendas com quebras de leitura estratégicas e grupos de hashtags.

### 3. 🌐 Central de Integrações (Hub Multicanal)
* **Instagram Business / Creator:** Fluxo oficial de autorização OAuth 2.0 da Meta, sincronização de perfil, foto e agendamento/publicação com prévia de aprovação em 2 etapas.
* **Meta Ads:** Gestão centralizada de contas de anúncios (`meta_ads`), conjuntos e criativos.
* **Google Ads & TikTok Ads:** Painel preparado para conexão unificada de sinais de performance.
* **Interface SaaS Premium:** Design minimalista e responsivo inspirado nas diretrizes visuais de Linear, Vercel e Apple (Dark Theme).

### 4. 🔒 Segurança & Arquitetura Robusta
* **Autenticação Segura:** Sessão com tokens Bearer JWT e proteção contra vazamento de credenciais no frontend.
* **Criptografia Ponta a Ponta:** Tokens de acesso e chaves de integração armazenados com criptografia no backend.
* **Proxy BFF (Next.js 16):** Roteamento seguro das chamadas de API e arquivos de mídia gerados sem conflitos de CORS.

---

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Next.js 16.2.6 (App Router)
- **Biblioteca Base:** React 19.2.4 & TypeScript
- **Estilização:** Tailwind CSS v4 & Lucide Icons
- **Animações:** Framer Motion
- **Design System:** Padrão Linear/Vercel (Dark Theme)

### Backend (`Atlas-IA_backend`)
- **API Framework:** FastAPI (Python 3.11+)
- **Banco de Dados:** PostgreSQL com SQLAlchemy
- **IA & Modelos:** Google Gemini 2.5 Flash / Imagen 3
- **Integrações:** Meta Graph API v21.0 & Instagram Business API

---

## 🚀 Como Começar

### Pré-requisitos
- Node.js 20+ e npm (ou pnpm / yarn)
- Backend `Atlas-IA_backend` em execução (por padrão em `http://127.0.0.1:8000`)

### 1. Clonar o repositório e instalar dependências

```bash
git clone https://github.com/seu-usuario/atlas-ai.git
cd atlas-ai
npm install
```

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do frontend baseado no `.env.example`:

```env
# URL do Backend FastAPI
BACKEND_URL=http://127.0.0.1:8000
NEXT_PUBLIC_API_URL=/api/backend
```

### 3. Executar o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para acessar a aplicação.

---

## 📂 Estrutura do Projeto

```text
├── public/                 # Ativos estáticos e logos
├── src/
│   ├── app/                # Rotas da aplicação (Next.js App Router)
│   │   ├── (auth)/         # Telas de login e cadastro
│   │   ├── dashboard/      # Workspace, Chat com IA e Configurações
│   │   ├── integracoes/    # Hub de integrações de plataformas (Meta, Instagram, etc.)
│   │   └── layout.tsx      # Layout raiz com provedores globais
│   ├── components/         # Componentes modulares reutilizáveis
│   │   ├── chat/           # Chat composer, telas de mensagem e MediaContentRenderer
│   │   ├── icons/          # SVGs oficiais das marcas e plataformas
│   │   ├── integrations/   # Cards de integração, modais de conexão e gerenciamento
│   │   ├── layout/         # Sidebar, cabeçalhos e navegação
│   │   └── ui/             # Componentes base (botões, inputs, diálogos)
│   ├── contexts/           # Provedores de estado (Chats, Integrações, Usuário)
│   └── lib/                # Cliente de API (`api.ts`), utilitários e constantes
├── next.config.ts          # Configuração de rewrites e proxy para o backend
├── PROGRESSO.MD            # Histórico detalhado de integrações e contratos
└── package.json            # Dependências e scripts do projeto
```

---

## 📄 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento local |
| `npm run build` | Compila o projeto otimizado para produção |
| `npm run start` | Inicia o servidor de produção compilado |
| `npm run lint` | Executa a verificação de linter com ESLint |
| `npx tsc --noEmit` | Validação estrita de tipos TypeScript |

---

## 🛡️ Licença

Este projeto é desenvolvido para fins comerciais e proprietários da plataforma **AtlasAI**. Todos os direitos reservados.
