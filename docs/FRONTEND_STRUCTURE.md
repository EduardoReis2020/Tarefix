# 🏗️ Estrutura do Frontend - Tarefix

## 📁 Organização dos Diretórios

```
src/
├── app/                     # Pages (App Router)
│   ├── (auth)/             # Grupo de rotas de autenticação
│   │   ├── login/          # Página de login
│   │   └── register/       # Página de registro
│   ├── dashboard/          # Área logada
│   │   ├── tasks/          # Gerenciamento de tarefas
│   │   ├── profile/        # Perfil do usuário
│   │   ├── layout.tsx      # Layout do dashboard
│   │   └── page.tsx        # Dashboard principal
│   ├── api/               # API Routes (Backend)
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx          # Página inicial
│   └── globals.css       # Estilos globais
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes básicos
│   │   ├── Button.tsx    # Botão customizado
│   │   ├── Input.tsx     # Input customizado
│   │   └── index.tsx     # Card, Alert, Loading, etc.
│   ├── forms/            # Formulários
│   │   └── LoginForm.tsx # Formulário de login
│   ├── layout/           # Componentes de layout
│   └── tasks/            # Componentes específicos de tarefas
├── hooks/                # Custom hooks
│   ├── useAuth.tsx       # Hook de autenticação
│   └── useTasks.ts       # Hook para gerenciar tarefas
├── lib/                  # Utilitários e configurações
│   ├── auth.ts           # Funções de autenticação
│   ├── authMiddleware.ts # Middleware de auth
│   ├── rateLimiter.ts    # Rate limiting
│   ├── tokenManager.ts   # Gerenciador de tokens
│   └── prisma.ts         # Cliente Prisma
├── types/                # Definições TypeScript
│   └── index.ts          # Tipos principais
└── utils/                # Funções utilitárias
```

## 🎨 Componentes Criados

### **UI Base**
- ✅ `Button` - Botão com variantes e estados
- ✅ `Input` - Input com validação e estilos
- ✅ `Card` - Container para conteúdo
- ✅ `Alert` - Notificações e alertas
- ✅ `LoadingSpinner` - Indicador de carregamento

### **Formulários**
- ✅ `LoginForm` - Formulário de login completo

### **Hooks Personalizados**
- ✅ `useAuth` - Gerenciamento de autenticação
- ✅ `useTasks` - CRUD de tarefas

## 🔗 Fluxo de Navegação

```
/ (Homepage)
├── Usuário não logado → /login ou /register
└── Usuário logado → /dashboard

/login
└── Login bem-sucedido → /dashboard

/register
└── Registro bem-sucedido → /dashboard (login automático)

/dashboard (Protegido)
├── /dashboard/tasks (Lista de tarefas)
├── /dashboard/profile (Perfil do usuário)
└── Logout → /
```

## 🛡️ Proteção de Rotas

- **Públicas**: `/`, `/login`, `/register`
- **Protegidas**: `/dashboard/*` (requer autenticação)
- **Redirecionamento automático** baseado no status de auth

## 🎯 Funcionalidades Implementadas

### **Autenticação**
- [x] Login com validação
- [x] Registro de usuário
- [x] Logout
- [x] Proteção de rotas
- [x] Renovação automática de tokens
- [x] Persistência de sessão

### **Dashboard**
- [x] Estatísticas de tarefas
- [x] Navegação entre seções
- [x] Layout responsivo
- [x] Menu de usuário

### **UI/UX**
- [x] Design responsivo
- [x] Estados de loading
- [x] Tratamento de erros
- [x] Validação de formulários
- [x] Feedback visual

## 🚀 Próximos Passos

### **Componentes a Criar**
- [ ] `TaskCard` - Card individual de tarefa
- [ ] `TaskForm` - Formulário de criação/edição
- [ ] `TaskList` - Lista de tarefas
- [ ] `FilterBar` - Filtros e busca
- [ ] `DatePicker` - Seletor de data
- [ ] `Select` - Dropdown customizado

### **Páginas a Implementar**
- [ ] `/dashboard/tasks` - Lista completa de tarefas
- [ ] `/dashboard/tasks/new` - Criar nova tarefa
- [ ] `/dashboard/tasks/[id]` - Detalhes da tarefa
- [ ] `/dashboard/profile` - Perfil do usuário

### **Funcionalidades Avançadas**
- [ ] Filtros por status/prioridade
- [ ] Busca de tarefas
- [ ] Ordenação customizada
- [ ] Drag & drop para reordenar
- [ ] Notificações push
- [ ] Dark mode

## 🧪 Como Testar

### **1. Autenticação**
```bash
# Acessar homepage
http://localhost:3000

# Testar registro
http://localhost:3000/register

# Testar login
http://localhost:3000/login

# Acessar dashboard (protegido)
http://localhost:3000/dashboard
```

### **2. Fluxos de Teste**
1. **Novo usuário**: Homepage → Register → Dashboard
2. **Usuário existente**: Homepage → Login → Dashboard
3. **Proteção**: Acessar `/dashboard` sem login → Redirect para `/login`
4. **Logout**: Dashboard → Logout → Homepage

## 💡 Padrões Seguidos

- **Component-driven development**
- **Hooks personalizados** para lógica reutilizável
- **TypeScript** para tipagem forte
- **Responsividade** mobile-first
- **Acessibilidade** com labels e ARIA
- **Loading states** em todas as operações assíncronas
- **Error handling** consistente
- **Validação** client-side e server-side
