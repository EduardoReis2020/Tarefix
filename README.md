# 🎯 Tarefix - Sistema de Gerenciamento de Tarefas

**Versão 2.0** - Agora com autenticação Clerk integrada!

Sistema moderno e completo para gerenciar tarefas e projetos com máxima eficiência e segurança.

## ✨ Funcionalidades Principais

### 🔐 Autenticação & Segurança
- **Clerk Authentication** - Sistema de autenticação profissional
- Verificação automática de email
- Autenticação multi-fator (MFA)
- Login social (Google, GitHub, etc.)
- Proteção contra ataques e rate limiting
- Sessões seguras e persistentes

### 📋 Gerenciamento de Tarefas
- Criação, edição e exclusão de tarefas
- Sistema de prioridades (Alta, Média, Baixa)
- Status personalizáveis (Pendente, Em Progresso, Concluída)
- Datas de vencimento e lembretes
- Categorização e filtros avançados

### 🎨 Interface & UX
- **Design System Minimalista Profissional**
- Interface responsiva e moderna
- Componentes UI reutilizáveis
- Tema consistente e acessível
- Experiência otimizada para mobile

## 🚀 Tecnologias

### Frontend
- **Next.js 15** (App Router)
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Clerk** para autenticação

### Backend
- **Next.js API Routes**
- **Prisma ORM** com PostgreSQL
- **Webhooks** para sincronização automática
- Validação com **Zod**

### Infraestrutura
- **Neon Database** (PostgreSQL)
- **Vercel** para deploy
- **Clerk Dashboard** para gerenciamento de usuários

## 📦 Instalação e Configuração

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/tarefix.git
cd tarefix
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="sua-url-do-postgresql"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your-publishable-key"
CLERK_SECRET_KEY="sk_test_your-secret-key"
WEBHOOK_SECRET="whsec_your-webhook-secret"

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Configurar Clerk
1. Crie uma conta em [Clerk.dev](https://clerk.dev)
2. Crie uma nova aplicação
3. Copie as chaves para o arquivo `.env`
4. Configure o webhook para sincronização de usuários:
   - URL: `https://seu-dominio.com/api/webhooks/clerk`
   - Eventos: `user.created`, `user.updated`, `user.deleted`

### 4. Configurar Banco de Dados
```bash
# Aplicar migrações
npx prisma migrate dev

# (Opcional) Visualizar dados
npx prisma studio
```

### 5. Executar em Desenvolvimento
```bash
npm run dev
# Acesse: http://localhost:3000
```

## 🗂️ Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Páginas de autenticação
│   │   ├── sign-in/       # Login (Clerk)
│   │   └── sign-up/       # Registro (Clerk)
│   ├── dashboard/         # Dashboard do usuário
│   ├── api/               # API Routes
│   │   ├── tasks/         # CRUD de tarefas
│   │   └── webhooks/      # Webhooks do Clerk
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz com ClerkProvider
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   └── ui/                # Design System
│       ├── Button.tsx     # Componente de botão
│       ├── Input.tsx      # Componente de input
│       ├── Card.tsx       # Componente de card
│       └── ...            # Outros componentes
├── lib/                   # Utilitários
│   └── prisma.ts          # Cliente do Prisma
└── hooks/                 # Custom Hooks
    └── useTasks.tsx       # Hook para gerenciar tarefas
```

## 🎨 Design System

### Cores Principais
- **Primary**: `#1f2937` (Gray 800)
- **Secondary**: `#374151` (Gray 700)
- **Success**: `#10b981` (Emerald 500)
- **Warning**: `#f59e0b` (Amber 500)
- **Error**: `#ef4444` (Red 500)

### Componentes UI
- ✅ **Button** (5 variantes + 3 tamanhos)
- ✅ **Input** (com validação e estados)
- ✅ **Card** (container flexível)
- ✅ **Alert** (4 tipos de notificação)
- ✅ **Badge** (indicadores de status)
- ✅ **LoadingSpinner** (estados de carregamento)

### Tipografia
- **Fonte**: Inter (system fonts fallback)
- **Escalas**: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl

## 🔄 Fluxo de Autenticação

1. **Registro/Login**: Usuário se autentica via Clerk
2. **Webhook**: Clerk envia dados do usuário para nossa API
3. **Sincronização**: API cria/atualiza usuário no banco local
4. **Autorização**: Middleware protege rotas privadas
5. **Dashboard**: Usuário acessa área logada

## 📊 Schema do Banco de Dados

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique        // ID do usuário no Clerk
  email     String   @unique
  name      String
  imageUrl  String?                // URL do avatar
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]                 // Relacionamento com tarefas
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  priority    Priority   @default(MEDIUM)
  status      Status     @default(PENDING)
  dueDate     DateTime?
  userId      String                // FK para User
  user        User       @relation(fields: [userId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Atualize a URL do webhook no Clerk
4. Deploy automático a cada push

### Outras Plataformas
- **Netlify**: Suporte completo para Next.js
- **Railway**: Deploy rápido com banco integrado
- **Heroku**: Configure buildpacks para Next.js

## 🔮 Roadmap

### v2.1 - Melhorias de UX
- [ ] Dark mode toggle
- [ ] Notificações push
- [ ] Filtros avançados de tarefas
- [ ] Exportação de dados

### v2.2 - Colaboração
- [ ] Compartilhamento de tarefas
- [ ] Equipes e workspaces
- [ ] Comentários em tarefas
- [ ] Histórico de atividades

### v2.3 - Integrações
- [ ] API pública
- [ ] Integração com calendários
- [ ] Webhooks personalizados
- [ ] Import/Export (JSON, CSV)

### v3.0 - AI & Analytics
- [ ] Sugestões inteligentes
- [ ] Análise de produtividade
- [ ] Relatórios automatizados
- [ ] Integração com IA

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

**Eduardo** - [GitHub](https://github.com/seu-usuario)

---

<div align="center">
  <strong>Feito com ❤️ para organizar suas tarefas!</strong><br>
  <em>Tarefix v2.0 - Powered by Clerk</em>
</div>

