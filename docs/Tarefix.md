# Tarefix — Diagramas Mermaid (Arquitetura, Fluxos e ERD)

Este documento contém **todos os diagramas em Mermaid** prontos para usar no seu repositório ou em [https://mermaid.live](https://mermaid.live). Copie e cole os blocos `mermaid` onde precisar.

---

## 1) Diagrama de Arquitetura (alto nível)

```mermaid
flowchart LR
  %% Clientes
  Browser[Usuário (Browser / Mobile App)]

  %% Frontend
  subgraph Frontend
    NextJS[Next.js (React) - UI / SSR / Client]
  end

  Browser -->|HTTPS| NextJS

  %% Autenticação
  subgraph Auth
    NextAuth[NextAuth (API Routes)]
  end
  NextJS -->|Auth Requests / Session| NextAuth

  %% Backend / API
  subgraph Backend
    API[Next.js API / Node.js (Business API)]
    Socket[Realtime Server (Socket.io) / WebSocket]
  end
  NextJS -->|API Calls (REST/GraphQL)| API
  NextJS -->|WebSocket| Socket

  %% Database & Cache & Storage
  subgraph Infra
    Postgres[(PostgreSQL - Prisma)]
    Redis[(Redis - Cache / PubSub / RateLimit)]
    S3[(Object Storage - S3 / DigitalOcean Spaces)]
  end
  API --> Postgres
  Socket --> Postgres
  API --> Redis
  Socket --> Redis
  API --> S3

  %% Serviços terceiros
  subgraph ThirdParty
    Stripe[Stripe (Pagamentos)]
    Email[Email Provider (SendGrid / SES)]
    Storage[CDN (Cloudflare / Cloudfront)]
    CI[GitHub Actions CI/CD]
    Monitoring[Sentry / Prometheus]
  end
  API -->|Payments| Stripe
  API -->|Emails| Email
  API -->|CDN| Storage
  CI -->|Deploy| NextJS
  CI -->|Deploy| API
  API --> Monitoring
  Socket --> Monitoring

  %% Admin panel
  AdminUI[Admin Dashboard (Next.js - Role: Super Admin)]
  AdminUI -->|Admin API| API

  classDef infra fill:#f9f,stroke:#333,stroke-width:1px;
  class Infra infra
```

**Notas**:

* `NextAuth` roda em API Routes do Next.js (padrão). Use `Prisma Adapter` para armazenar contas/sessions em PostgreSQL.
* `Socket.io` pode rodar dentro do mesmo servidor do Backend (serverless caveats) ou em um serviço dedicado (Recomendado: servidor persistente/Instance ou PaaS que suporta WebSocket).
* `Redis` serve para Pub/Sub (notificações em tempo real), cache e rate-limiting.
* `S3` para anexos de tarefas.

---

## 2) Diagrama ER (Modelo de dados simplificado)

```mermaid
erDiagram
  USERS {
    uuid id PK
    string name
    string email
    string password_hash
    string avatar_url
    timestamp created_at
    timestamp updated_at
  }

  TEAMS {
    uuid id PK
    string name
    string description
    string logo_url
    uuid owner_id FK
    timestamp created_at
  }

  TEAM_MEMBERS {
    uuid id PK
    uuid team_id FK
    uuid user_id FK
    string role "admin|member|readonly"
    timestamp joined_at
  }

  TASKS {
    uuid id PK
    uuid team_id FK
    uuid created_by FK
    string title
    text description
    enum priority "low|medium|high|urgent"
    enum status "todo|in_progress|done|overdue"
    timestamp start_date
    timestamp due_date
    timestamp created_at
    timestamp updated_at
  }

  TASK_ASSIGNMENTS {
    uuid id PK
    uuid task_id FK
    uuid user_id FK
    timestamp assigned_at
  }

  COMMENTS {
    uuid id PK
    uuid task_id FK
    uuid author_id FK
    text content
    timestamp created_at
  }

  ATTACHMENTS {
    uuid id PK
    uuid task_id FK
    string url
    string filename
    int size
    timestamp uploaded_at
  }

  TAGS {
    uuid id PK
    string name
  }

  TASK_TAGS {
    uuid id PK
    uuid task_id FK
    uuid tag_id FK
  }

  PLANS {
    uuid id PK
    string name
    text features
    decimal price
  }

  SUBSCRIPTIONS {
    uuid id PK
    uuid user_id FK
    uuid plan_id FK
    timestamp started_at
    timestamp expires_at
    enum status "active|past_due|canceled"
  }

  USERS ||--o{ TEAM_MEMBERS : "is member"
  TEAMS ||--o{ TEAM_MEMBERS : "has"
  TEAMS ||--o{ TASKS : "owns"
  USERS ||--o{ TASKS : "creates"
  TASKS ||--o{ TASK_ASSIGNMENTS : "assigned to"
  USERS ||--o{ TASK_ASSIGNMENTS : "has assignment"
  TASKS ||--o{ COMMENTS : "has"
  USERS ||--o{ COMMENTS : "writes"
  TASKS ||--o{ ATTACHMENTS : "contains"
  TASKS ||--o{ TASK_TAGS : "tagged"
  TAGS ||--o{ TASK_TAGS : "used in"
  USERS ||--o{ SUBSCRIPTIONS : "subscribed"
  PLANS ||--o{ SUBSCRIPTIONS : "contains"
```

**Notas**:

* Use `Prisma` para gerar migrations a partir deste modelo (ajuste nomes de campos e tipos conforme necessidade).
* Considere índices em `task.due_date`, `task.status`, `task.team_id` e `team_members.team_id,user_id`.

---

## 3) Fluxo do Usuário — Signup / Criar Time / Convidar

```mermaid
flowchart TD
  A[Usuário abre app] --> B[Signup / Login]
  B --> C{Usuário novo?}
  C -->|Sim| D[Preenche perfil (nome, foto...)]
  D --> E[Opção: Criar Time ou Entrar via convite]
  E --> F{Criar Time}
  F -->|Criar| G[Form: nome do time, descrição, convidar emails]
  G --> H[Time criado; usuário é Admin do Time]
  H --> I[Dashboard do Time]
  E -->|Entrar via convite| J[Insere token/aceita convite]
  J --> K[Entrou no time como Member/Role conforme convite]
  K --> I

  C -->|Não| L[Login -> Redirect para Dashboard/Último Time]
  L --> I
```

---

## 4) Fluxo: Criar Tarefa e Atribuir + Notificação (Sequence)

```mermaid
sequenceDiagram
  participant U as Usuário (Front)
  participant FE as Frontend (Next.js)
  participant API as Backend API
  participant DB as PostgreSQL
  participant S as Socket/Redis
  participant Email as Email Service

  U->>FE: Preenche form de tarefa (title, desc, due_date, assignees...)
  FE->>API: POST /teams/:id/tasks {payload}
  API->>DB: INSERT task, INSERT task_assignments
  DB-->>API: 201 CREATED
  API->>S: PubSub notify (task_created, notify assignees)
  S->>FE: emits WebSocket -> assignees recebem notificação em tempo real
  API->>Email: enqueue email to assignees (async)
  Email-->>API: 202 queued
  API-->>FE: 201 CREATED + task object
  FE-->>U: mostra task criada e notificação
```

**Observações**:

* Enviei notificações em 2 canais: WebSocket (tempo real) e Email (fallback/persistente).
* Use background workers (ex: BullMQ + Redis) para envio de emails e tasks demoradas.

---

## 5) Fluxo: Comentários/Chat por Tarefa

```mermaid
sequenceDiagram
  participant U1 as Membro
  participant FE as Frontend
  participant Socket as Socket Server
  participant DB as PostgreSQL

  U1->>FE: Envia comentário na tarefa
  FE->>Socket: emit('task:commented', {taskId, content, authorId})
  Socket->>DB: INSERT comment
  DB-->>Socket: OK -> savedComment
  Socket-->>FE: broadcast('task:commented', savedComment) to room(taskId)
  FE-->>U2: Recebe comentário em tempo real
```

**Dica**: mantenha um evento `room` por `taskId` para broadcast e use TTL para mensagens em cache se desejar.

---

## 6) Diagrama de Fluxos de Permissões (RBAC simplificado)

```mermaid
flowchart LR
  AdminApp[Super Admin]
  TeamAdmin[Admin do Time]
  Member[Member]
  ReadOnly[Somente Leitura]

  AdminApp -->|manage platform| All
  TeamAdmin -->|create/edit/delete tasks| Member
  TeamAdmin -->|assign tasks| Member
  Member -->|create/edit own tasks| Member
  ReadOnly -.->|view only| Member

  classDef role fill:#fff7c0,stroke:#333
  class AdminApp,TeamAdmin,Member,ReadOnly role
```

---

## 7) Sequência de Deploy / CI (High-level)

```mermaid
flowchart LR
  Dev[Dev pushes PR] --> GH[GitHub Actions]
  GH --> Test[Run tests]
  Test --> Build[Build artifacts]
  Build --> DeployFront[Vercel]
  Build --> DeployAPI[Railway / Render / DigitalOcean]
  DeployFront -->|CD| ProdFront
  DeployAPI -->|CD| ProdAPI
```

---

## 8) Instruções de uso

1. Copie cada bloco `mermaid` para `.md` ou para o editor do Mermaid Live ([https://mermaid.live](https://mermaid.live)).
2. Para renderizar localmente em docs: use `MkDocs` ou `Docusaurus` com plugin Mermaid, ou `vite-plugin-markdown` com `mermaid`.
3. Ajuste nomes de serviços e endpoints conforme a implementação real.

---

## 9) Checklist de Implementação (prático)

* [ ] Implementar schema Prisma baseado no ERD.
* [ ] Configurar NextAuth com adapter Prisma (tabelas `users`, `accounts`, `sessions`).
* [ ] Estruturar API Routes: `/teams`, `/tasks`, `/comments`, `/members`, `/reports`.
* [ ] Implementar Socket.io ou alternativa (pusher) e integração com Redis Pub/Sub.
* [ ] Upload de anexos para S3 e servir via CDN.
* [ ] Relatórios: queries otimizadas (use materialized views se necessário).
* [ ] Background worker (BullMQ) para emails e jobs demorados.
* [ ] Testes end-to-end (Cypress) e unitários (Jest).

---

Se quiser, eu posso:

* Gerar um **arquivo .md** pronto com esses diagramas para você adicionar ao repositório.
* Gerar **SVGs** a partir dos diagramas (preciso que confirme para gerar arquivos).
* Gerar o **schema Prisma** baseado no ERD.

Diga qual próximo passo você quer: `arquivo .md` | `SVGs` | `schema Prisma` | `diagramas adicionais`.
