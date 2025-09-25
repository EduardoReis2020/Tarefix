# 🧪 **TESTE MERMAID - TAREFIX**

> **Arquivo de teste para verificar renderização dos diagramas**

## 🔍 **Teste Rápido de Renderização**

Teste simples para verificar se Mermaid está funcionando:

```mermaid
flowchart LR
    A[Teste] --> B[Funcionando!]
    B --> C{Renderizou?}
    C -->|Sim| D[✅ Perfeito!]
    C -->|Não| E[❌ Verificar suporte]
```

## 📊 **Diagrama Atual do Tarefix (Simplificado)**

```mermaid
flowchart TB
    subgraph Frontend
        Next[Next.js 15 + TypeScript]
        Clerk[Clerk Auth]
        Tailwind[Tailwind CSS]
    end
    
    subgraph Backend
        API[Next.js API Routes]
        Prisma[Prisma ORM]
    end
    
    subgraph Database
        Postgres[(PostgreSQL)]
    end
    
    subgraph External
        Vercel[Vercel Deploy]
        Railway[Railway DB]
    end
    
    Next --> Clerk
    Next --> API
    API --> Prisma
    Prisma --> Postgres
    
    Next --> Vercel
    Postgres --> Railway
```

## 🗄️ **Modelo de Dados Atual**

```mermaid
erDiagram
    User {
        string id PK
        string clerkId
        string email
        string name
        string imageUrl
        datetime createdAt
        datetime updatedAt
    }
    
    Task {
        string id PK
        string title
        string description
        datetime dueDate
        enum priority "LOW|MEDIUM|HIGH|URGENT"
        enum status "PENDING|IN_PROGRESS|DONE|OVERDUE"
        string userId FK
        datetime createdAt
        datetime updatedAt
    }
    
    User ||--o{ Task : "has many"
```

## 🔄 **Fluxo de Criação de Tarefa**

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant A as API
    participant D as Database
    
    U->>F: Preenche formulário
    F->>A: POST /api/tasks
    A->>D: INSERT task
    D-->>A: Task criada
    A-->>F: Response 201
    F-->>U: Tarefa exibida
```

## 🏗️ **Status do Desenvolvimento**

```mermaid
gantt
    title Cronograma Tarefix
    dateFormat  YYYY-MM-DD
    section MVP
    Setup & Config     :done, des1, 2025-09-01, 2025-09-15
    Auth & DB         :done, des2, 2025-09-15, 2025-09-20
    Basic CRUD        :active, des3, 2025-09-20, 2025-09-30
    Dashboard         :des4, 2025-09-30, 2025-10-05
    section Features
    Filters & Search  :des5, 2025-10-05, 2025-10-10
    Kanban View      :des6, 2025-10-10, 2025-10-15
    Calendar View    :des7, 2025-10-15, 2025-10-20
```

---

**💡 Dica:** Se você conseguir ver estes diagramas renderizados, significa que o Mermaid está funcionando perfeitamente na sua plataforma!