# Plataforma Inteligente de Pesquisa, Desenvolvimento e IA — Especificação Técnica

> Documento baseado no **Documento de Visão — Plataforma Inteligente de Pesquisa, Desenvolvimento e IA (Viso)**.  
> Este `spec.md` orienta a evolução do produto, com foco imediato na definição do **Backend** e do **Banco de Dados**. A implementação dessas camadas será feita em etapas posteriores; por enquanto, este arquivo consolida requisitos, arquitetura e modelo de dados planejados.

---

## Visão Geral

Criar uma **plataforma unificada de Inteligência Artificial** que ajude usuários a **pesquisar**, **validar ideias**, **desenvolver aplicações** e **automatizar tarefas** em um único ambiente inteligente.

Mais do que um chatbot, a plataforma será um **sistema operacional de produtividade baseado em IA**, capaz de conectar pesquisa, criação e execução dentro de um único fluxo:

> *"Uma plataforma de IA que transforma pesquisa e ideias em produtos digitais mais rápido, conectando validação, desenvolvimento e automação em um único fluxo."*

### Visão de longo prazo

Evoluir para um ambiente completo de criação e desenvolvimento com IA, onde o usuário possa **pesquisar**, **construir**, **apresentar** e **automatizar** tudo em um só ecossistema.

---

## Problema

Hoje, profissionais e equipes precisam alternar entre várias ferramentas para pesquisar, programar, criar apresentações, montar landing pages e organizar projetos. Isso:

- Fragmenta o contexto;
- Reduz a produtividade;
- Aumenta o retrabalho.

---

## Solução

A plataforma centraliza **pesquisa**, **desenvolvimento** e **automação** em um fluxo contínuo, permitindo que o usuário:

- Pesquise dados, mercado, documentos e conteúdos científicos;
- Desenvolva código, landing pages, APIs e aplicações;
- Crie apresentações e materiais visuais com IA;
- Organize projetos com **memória contextual** e **workspace inteligente**;
- Modele e evolua **estruturas de banco de dados** com apoio da IA (ver seção dedicada abaixo).

---

## Proposta de Valor

| Pilar | Descrição |
|--------|-----------|
| **Pesquisa** | Inteligência para validar ideias, mercado e referências técnicas/científicas |
| **Desenvolvimento** | Geração de código, APIs, landing pages e aplicações |
| **Criação** | Apresentações e materiais visuais assistidos por IA |
| **Organização** | Projetos, histórico e contexto compartilhado entre módulos |
| **Dados** | Modelagem, scripts e evolução de bancos de dados guiados por IA |

---

## Público-alvo

- Startups e founders;
- Desenvolvedores;
- Profissionais de marketing e produto;
- Estudantes, professores e pesquisadores;
- Empresas de tecnologia e criadores de produtos digitais.

---

## Diferenciais

- **Orquestração de múltiplos modelos de IA** (Claude, OpenAI, Gemini, entre outros);
- **Contexto compartilhado** entre módulos (pesquisa ↔ código ↔ apresentação ↔ dados);
- **Fluxo integrado** entre pesquisa, código, automação e modelagem de dados;
- **Experiência simples** para usuários técnicos e não técnicos;
- **Engine interna** de organização de prompts, validação de saídas e redução de alucinações.

---

## Modelo de Negócio (SaaS)

### Plano gratuito

- Uso limitado de até 5 Prompts por dia;
- Pesquisas limitadas;
- Funcionalidades básicas de criação;
- Limite de geração de código, apresentações e artefatos de dados;
- Modelo de IA padrão e histórico com retenção reduzida.


### Plano premium

- Pesquisa aprofundada;
- Geração avançada de código e aplicações;
- **Memória contextual** e workspace estendido;
- Automação e exportações avançadas;
- Acesso a modelos e agentes inteligentes;
- Modelagem de banco de dados avançada (schemas complexos, migrações, otimizações).

---

## Módulos da Plataforma (Produto)

| Módulo | Capacidades |
|--------|-------------|
| **Pesquisa inteligente** | Dados, mercado, documentos, conteúdo científico |
| **Pesquisa de mercado** | Validação de ideias e tendências |
| **Desenvolvimento** | Código, APIs, landing pages, aplicações |
| **Apresentações** | Geração de decks e materiais visuais com IA |
| **Workspace** | Projetos, memória contextual, colaboração (fases futuras) |
| **Banco de dados (IA)** | Modelagem conceitual/lógica, DDL, migrações, seeds, documentação e boas práticas |
| **Automação** | Fluxos e tarefas repetitivas (fases futuras) |

---

## Arquitetura do Sistema (Planejada)

### Fluxo de comunicação

```text
Usuário (pesquisa, ideia, código, apresentação ou modelagem de dados)
  ↓
Frontend Next.js (dashboard, chat, workspaces, upgrade)
  ↓
Backend FastAPI (orquestrador, autenticação, regras de plano)
  ↓
Engine de IA interna (contexto, RAG, validação, roteamento de modelos)
  ↓
APIs LLM (Claude / OpenAI / Perplexity)
  ↓
Persistência (PostgreSQL) + armazenamento de artefatos
  ↓
Frontend exibe respostas, código, apresentações e schemas de BD
```

### Stack — Frontend (em desenvolvimento)

- **Framework:** Next.js (App Router), React;
- **Estilo:** Tailwind CSS v4, `clsx`, `tailwind-merge`;
- **UI/UX:** Framer Motion; dark mode, glassmorphism, experiência minimalista;
- **Autenticação (UI):** fluxos de login/registro (integração com backend planejada).

### Stack — Backend (a construir)

- **Linguagem:** Python 3.x;
- **Framework:** FastAPI;
- **Validação:** Pydantic;
- **ORM:** SQLAlchemy (async);
- **Migrações:** Alembic;
- **Auth:** JWT / sessões (definir na implementação);
- **Filas/jobs (futuro):** tarefas longas (pesquisa profunda, geração pesada).

### Stack — Banco de dados (a construir)

- **SGBD principal:** PostgreSQL;
- **Padrões:** normalização quando aplicável, índices, constraints, auditoria básica;
- **Versionamento de schema:** migrações versionadas no repositório;
- **Ambientes:** desenvolvimento, homologação e produção com configuração por variáveis de ambiente.

---

## IA e Desenvolvimento de Banco de Dados

> **Extensão ao documento de visão original:** a plataforma também permitirá que a IA **auxilie na concepção, evolução e documentação de bancos de dados**, não apenas em código de aplicação ou pesquisa.

### O que a IA poderá fazer neste módulo

- Entender requisitos de negócio e propor **modelo entidade-relacionamento** (conceitual e lógico);
- Gerar **DDL** (PostgreSQL): tabelas, chaves primárias/estrangeiras, índices, enums, constraints;
- Sugerir **migrações** (up/down) compatíveis com Alembic;
- Criar **scripts de seed** para desenvolvimento e testes;
- Recomendar **normalização**, tipos de dados, nomenclatura e convenções;
- Apontar riscos: N+1, falta de índices, cardinalidade, LGPD/dados sensíveis;
- Produzir **documentação** do schema (dicionário de dados, diagramas em texto/Mermaid);
- Iterar sobre o schema com base no feedback do usuário (memória do projeto).

### Limites e responsabilidades (importante)

- A IA **não executa** alterações diretas em bancos de produção do usuário sem fluxo explícito de aprovação;
- Scripts gerados devem ser **revisáveis e versionáveis** antes de aplicar em qualquer ambiente;
- Dados sensíveis do usuário seguem políticas de retenção e criptografia definidas no backend;
- Em produção, migrações passam por pipeline controlado (CI/CD), não por aplicação automática irrestrita.

### Integração com outros módulos

- Pesquisa de mercado pode alimentar entidades de domínio sugeridas;
- Geração de APIs (FastAPI/REST) pode ser **alinhada ao schema** já modelado;
- Workspace mantém o **schema e histórico de iterações** do banco por projeto.

---

## Estrutura de Banco de Dados (Planejada)

Entidades iniciais para suportar contas, projetos, chat, artefatos e modelagem de dados:

| Entidade | Propósito |
|----------|-----------|
| **`users`** | Autenticação, perfil, plano (free/premium), preferências |
| **`subscriptions`** | Assinatura, status de pagamento, ciclo de cobrança |
| **`projects`** | Workspace / agrupamento de trabalho do usuário |
| **`conversations`** | Sessões de chat por projeto |
| **`messages`** | Mensagens usuário/assistente com metadados de modelo |
| **`research_sessions`** | Pesquisas e resultados estruturados (Fase 1) |
| **`presentations`** | Apresentações geradas (metadados + referência ao arquivo/conteúdo) |
| **`code_artifacts`** | Trechos e projetos de código gerados |
| **`database_models`** | Schemas versionados por projeto (DDL, diagrama, notas) |
| **`database_migrations`** | Histórico de migrações sugeridas/aprovadas por projeto |
| **`exports`** | Registro de exportações (código, PPT, SQL, etc.) |
| **`usage_logs`** | Limites de plano, consumo de tokens/requisições |
| **`audit_logs`** | Eventos críticos para suporte e segurança |

Relacionamentos principais: `users` → `projects` → (`conversations`, `research_sessions`, `presentations`, `code_artifacts`, `database_models`).

---

## Roadmap de Produto (Documento de Visão)

### Fase 1

- Pesquisa inteligente;
- Pesquisa de mercado;
- Geração de apresentações;
- Sistema de contas;
- **Fundamentos de backend + PostgreSQL** (auth, projetos, chat básico).

### Fase 2

- Geração de código;
- Criação de landing pages;
- Workspace colaborativo;
- Memória contextual;
- **Módulo de modelagem de banco de dados com IA** (schemas, migrações, documentação).

### Fase 3

- Criação automática de apps;
- Multiagentes;
- APIs próprias;
- Marketplace de templates e automações.

---

## Roadmap Técnico (Implementação)

| Etapa | Escopo | Status |
|-------|--------|--------|
| **T0** | Frontend: dashboard, auth UI, upgrade, settings | Em andamento |
| **T1** | Backend: API base, auth, usuários, projetos | Planejado |
| **T2** | PostgreSQL: schema inicial, migrações Alembic, seeds | Planejado |
| **T3** | Chat + persistência de mensagens e limites por plano | Planejado |
| **T4** | Módulos Fase 1 (pesquisa, apresentações) + integração LLM | Planejado |
| **T5** | Módulo IA de banco de dados (schemas, DDL, migrações) | Planejado |

---

## Escopo Imediato deste Repositório

**Por enquanto:** atualizar e manter este `spec.md` alinhado ao documento de visão; **não** iniciar implementação completa do backend nem do banco nesta etapa, salvo quando explicitamente solicitado.

**Já em curso no frontend:** autenticação (telas), dashboard com chat, sidebar, configurações, fluxo de upgrade/planos e pagamento (UI).

**Próximo passo técnico (quando autorizado):** estruturar monorepo ou serviço `backend/` com FastAPI, definir schema PostgreSQL v1 e primeira migração Alembic conforme tabelas acima.

---

## Princípios de UX (Frontend)

- Estética moderna (referências: Vercel, Linear, Apple, Stripe);
- Dark mode, glassmorphism, tipografia clara, glow contido;
- Interface minimalista, sem excesso de controles;
- Fluxos críticos (upgrade/pagamento) em tela cheia, sem sidebar quando aplicável.

---

## Tese

A oportunidade está em transformar a **fragmentação atual das ferramentas de IA** em uma experiência única, fluida e orientada a resultado. O objetivo é acelerar o ciclo entre **ideia → validação → execução**, incluindo a camada de **dados estruturados** que sustenta produtos digitais sérios.

---

## Referência

- Documento de origem: *Documento de Visão — Plataforma Inteligente de Pesquisa, Desenvolvimento e IA (Viso)*.
- Extensões neste spec: **Backend**, **PostgreSQL**, **módulo de desenvolvimento de banco de dados assistido por IA**.
