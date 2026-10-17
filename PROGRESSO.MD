# Progresso do projeto AtlasAI

> Inventário e relatório de integração atualizado em 17/10/2026. Este arquivo reflete estritamente as integrações realizadas e o estado constatado no repositório e no backend.

## 1. Backend e banco de dados identificados

- **Repositório do Backend**: Localizado em `Atlas-IA_backend` (FastAPI / Python, SQLAlchemy, PostgreSQL e integração de IA via Google Gemini).
- **Autenticação**: Baseada em OAuth2 Password Bearer com JWT HS256 (`/auth/login`).
- **Endpoints confirmados no backend**:
  - `POST /auth/register`: Cadastro de usuário (`UserCreate` com nome, e-mail e senha de mín. 8 caracteres).
  - `POST /auth/login`: Autenticação via formulário OAuth2 (`username`/`password`), retornando token Bearer JWT.
  - `GET /users/me`: Consulta do usuário autenticado (`UserRead`).
  - `PATCH /users/me`: Atualização de perfil (`name`, `last_name`, `custom_instructions`).
  - `POST /users/me/deletion`: Solicitação de exclusão de conta mediante confirmação de senha.
  - `GET /conversations`: Listagem de conversas do usuário.
  - `POST /conversations`: Criação de nova conversa.
  - `GET /conversations/{id}`: Obtenção de conversa detalhada com histórico de mensagens.
  - `PATCH /conversations/{id}`: Renomeação de conversa.
  - `DELETE /conversations/{id}`: Exclusão permanente de conversa.
  - `POST /conversations/{id}/messages`: Envio de mensagem pelo usuário e retorno da resposta gerada pela IA Gemini (`ChatExchange`).
  - `GET /ad-accounts`: Listagem de contas de anúncios vinculadas ao usuário (`meta_ads`, `google_ads`, `tiktok_ads`).
  - `POST /ad-accounts`: Cadastro/vinculação de conta de anúncio.
  - `DELETE /ad-accounts/{id}`: Remoção de conta de anúncio vinculada.
  - Endpoints de campanhas, regras de otimização, criativos e ações de agentes (`/campaigns`, `/campaigns/{id}/rules`, etc.).

---

## 2. Integrações conectadas no Frontend

1. **Configuração e Proxy BFF (Next.js 16)**:
   - `next.config.ts`: Configurado `rewrites` mapeando `/api/backend/:path*` para `process.env.BACKEND_URL || "http://127.0.0.1:8000/:path*"`, prevenindo bloqueios de CORS no navegador durante o desenvolvimento.
   - `.env.example` e `.env.local`: Documentada e definida a variável `NEXT_PUBLIC_API_URL=/api/backend` e `BACKEND_URL=http://127.0.0.1:8000`.
   - `src/lib/api.ts`: Módulo cliente HTTP centralizando tipagem dos contratos do backend, injeção de token Bearer e tratamento padronizado de erros do FastAPI.

2. **Fluxo de Autenticação (`/login`)**:
   - `src/app/login/page.tsx`: Substituída a simulação de temporizador pela chamada real a `api.login(email, password)`. Armazena o token de acesso no cliente e redireciona para `/dashboard`. Exibe mensagens de erro retornadas pelo backend em caso de falha.

3. **Fluxo de Cadastro (`/register`)**:
   - `src/app/register/page.tsx`: Substituída a simulação pela chamada real a `api.register(...)`. Ajustada a validação da senha para no mínimo 8 caracteres (requisito do contrato `UserCreate` do backend). Realiza login automático em seguida para estabelecer sessão e redireciona para `/dashboard`.

4. **Fluxo de Configurações e Perfil (`/dashboard/settings`)**:
   - `src/app/dashboard/settings/page.tsx`:
     - Carrega dados reais do usuário autenticado via `GET /users/me` ao montar o componente.
     - Salva nome e sobrenome via `PATCH /users/me`.
     - Salva instruções personalizadas da IA via `PATCH /users/me` (`custom_instructions`).
     - Solicita exclusão de conta via `POST /users/me/deletion` com confirmação da senha atual.
     - Logout seguro limpando o token de autenticação e redirecionando para `/login`.

5. **Fluxo de Conversas e Mensagens com IA (`/dashboard`, `/dashboard/chat/[id]`)**:
   - `src/contexts/chats-context.tsx`: Conectado a `GET /conversations`, `POST /conversations` e `DELETE /conversations/{id}`.
   - `src/components/layout/sidebar.tsx`: Ações de criação e remoção de conversas atualizadas para sincronizar com o backend de forma assíncrona.
   - `src/app/dashboard/chat/[id]/page.tsx`: Repassa o identificador `chatId` ativo para a tela de chat.
   - `src/components/chat/chat-screen.tsx`: Conectado ao `GET /conversations/{id}` para carregar o histórico de mensagens salvas e a `POST /conversations/{id}/messages` para enviar mensagens do usuário e receber respostas reais da IA Gemini. No dashboard inicial (sem conversa ativa), cria a conversa no backend e redireciona para a rota `/dashboard/chat/[id]`.

6. **Fluxo de Integrações de Plataformas (`/integracoes`)**:
   - `src/contexts/integrations-context.tsx`: Conectado a `GET /ad-accounts` para sincronizar o status das plataformas (`meta_ads`, `google_ads`, `tiktok_ads`) com a base de dados do usuário autenticado. Vinculação conectada a `POST /ad-accounts` e desvinculação a `DELETE /ad-accounts/{id}`.
   - `src/components/integrations/connection-modal.tsx`: Atualizado para acionar a conexão assíncrona ao backend.

---

## 3. Arquivos alterados

- `next.config.ts`: Adicionado proxy rewrite para o backend FastAPI.
- `.env.example`: Adicionado com documentação de variáveis de ambiente.
- `.env.local`: Criado com configurações locais de conexão.
- `src/lib/api.ts`: Criado com cliente tipado para os contratos do backend.
- `src/app/login/page.tsx`: Conectado login ao backend.
- `src/app/register/page.tsx`: Conectado cadastro ao backend com validação de senha de 8 caracteres.
- `src/app/dashboard/settings/page.tsx`: Conectados consulta/atualização de perfil, instruções, exclusão de conta e logout.
- `src/contexts/chats-context.tsx`: Conectada listagem, criação e exclusão de conversas.
- `src/components/layout/sidebar.tsx`: Atualizado manuseio de conversas assíncronas.
- `src/app/dashboard/chat/[id]/page.tsx`: Repasse de `chatId` para o componente `ChatScreen`.
- `src/components/chat/chat-screen.tsx`: Conectado histórico e envio de mensagens para a IA do backend.
- `src/contexts/integrations-context.tsx`: Conectada listagem, criação e remoção de contas de anúncios.
- `src/components/integrations/connection-modal.tsx`: Conectada autorização assíncrona à API.
- `PROGRESSO.MD`: Atualizado com o relatório completo da integração.

---

## 4. Dependências pendentes e funcionalidades não cobertas pelo backend

As seguintes funcionalidades presentes na interface do frontend não possuem endpoints correspondentes no backend disponível:

1. **Login Social com Google (`/login`)**: O backend implementa apenas login com credenciais locais (`/auth/login`), sem rotas de OAuth ou verificação de tokens Google.
2. **Recuperação de Senha (`/forgot-password`)**: O backend não oferece rotas para envio de e-mail de recuperação, validação de código OTP ou redefinição de senha (`/auth/forgot-password` ou similar).
3. **Gerenciamento de Projetos do Workspace (`/workspace`, `/dashboard/workspace`)**: O backend implementa modelo de campanhas publicitárias (`campaign`), mas não possui rotas nem tabela ativa para os projetos de software cadastrados no frontend (`database/schema.sql` contém a tabela planejada, mas não está mapeada nos endpoints do backend).
4. **Assinaturas e Pagamentos (`/dashboard/upgrade`, `subscription-context`)**: O backend não possui rotas para checkout, planos ou webhooks Stripe.
5. **Handshake OAuth completo de Ad Platforms**: O backend possui endpoints para armazenar e consultar tokens de contas (`/ad-accounts`), mas não possui o fluxo 3-legged de redirecionamento OAuth com as APIs do Meta, Google ou TikTok.

---

## 5. Verificações executadas

- **Inspeção do Backend**: Verificado o código-fonte, modelos SQLAlchemy, rotas FastAPI e esquemas Pydantic em `Atlas-IA_backend`.
- **Verificação de Tipos TypeScript**: Executado `npx tsc --noEmit` no frontend com sucesso (0 erros de compilação).
