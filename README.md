# 🎯 Tarefix - Task Manager Moderno

> **Sistema completo de gerenciamento de tarefas com autenticação avançada e interface moderna**

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?style=for-the-badge&logo=clerk)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**🚀 Aplicação em desenvolvimento - Primeiro commit funcional**

</div>

---

## 📋 **Sobre o Projeto**

**Tarefix** é um sistema moderno de gerenciamento de tarefas desenvolvido com **Next.js 15** e **TypeScript**. O projeto combina as melhores tecnologias atuais para oferecer uma experiência completa de produtividade.

### 🎯 **Objetivo**
Criar uma aplicação robusta, segura e escalável para gerenciamento de tarefas pessoais e profissionais, com foco em:
- **Performance** - Carregamento ultra-rápido
- **Segurança** - Autenticação enterprise-grade
- **UX/UI** - Interface moderna e intuitiva
- **Escalabilidade** - Arquitetura preparada para crescimento

---

## ✨ **Funcionalidades Implementadas**

### 🔐 **Autenticação & Segurança**
- ✅ **Clerk Authentication** - Sistema profissional de autenticação
- ✅ **Middleware de proteção** - Rotas privadas protegidas
- ✅ **Gerenciamento de sessões** - Login persistente e seguro
- ✅ **Webhooks** - Sincronização automática de usuários

### 📱 **Interface & Experiência**
- ✅ **Design responsivo** - Funciona perfeitamente em mobile e desktop
- ✅ **Tailwind CSS** - Estilização moderna e consistente
- ✅ **Componentes reutilizáveis** - Sistema de design estruturado
- ✅ **Loading states** - Feedback visual em todas as ações

### � **Gerenciamento de Tarefas**
- ✅ **CRUD completo** - Criar, listar, editar e deletar tarefas
- ✅ **API RESTful** - Endpoints organizados e documentados
- ✅ **Validação robusta** - Zod para validação de dados
- ✅ **Estados de tarefa** - Sistema de status e prioridades

### 🗄️ **Banco de Dados & Backend**
- ✅ **Prisma ORM** - Modelagem type-safe do banco
- ✅ **PostgreSQL** - Banco robusto e escalável (Neon)
- ✅ **Migrações** - Controle de versão do schema
- ✅ **Relações** - Usuários e tarefas conectados

---

## �️ **Stack Tecnológica**

### **Frontend**
```
⚡ Next.js 15        - Framework React com App Router
🔷 TypeScript       - Tipagem estática para maior segurança
🎨 Tailwind CSS     - Framework CSS utility-first
⚛️ React 19         - Biblioteca de interface moderna
```

### **Backend**
```
🚀 Next.js API     - API Routes serverless
🔗 Prisma ORM      - Type-safe database client
🐘 PostgreSQL      - Banco de dados relacional
✅ Zod             - Schema validation
```

### **Autenticação**
```
🔐 Clerk           - Authentication-as-a-Service
🛡️ Middleware      - Proteção de rotas
📡 Webhooks        - Sincronização de dados
```

### **Infraestrutura**
```
🌐 Neon Database   - PostgreSQL serverless
🚀 Vercel Ready    - Deploy otimizado
📦 npm/Node.js     - Gerenciamento de dependências
```

---

## 🎨 **Screenshots & Demo**

### 🏠 **Página Inicial**
- Design moderno com gradientes
- Call-to-action claro
- Navegação intuitiva

### 🔐 **Autenticação**
- Login/Registro via Clerk
- Interface profissional
- Redirects automáticos

### 📊 **Dashboard**
- Visão geral das tarefas
- Estatísticas em tempo real
- Interface responsiva

---

## 🚀 **Instalação e Execução**

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Conta no Clerk
- Banco PostgreSQL (Neon recomendado)

### **1. Clone e instale**
```bash
git clone https://github.com/SEU_USUARIO/tarefix.git
cd tarefix
npm install
```

### **2. Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### **3. Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
```

### **4. Execute em desenvolvimento**
```bash
npm run dev
# Aplicação rodando em http://localhost:3000
```

---

## � **Estrutura do Projeto**

```
📦 tarefix/
├── 📂 src/
│   ├── 📂 app/                   # Next.js App Router
│   │   ├── 📂 dashboard/         # Dashboard do usuário
│   │   ├── 📂 sign-in/          # Página de login
│   │   ├── 📂 sign-up/          # Página de registro
│   │   ├── 📂 api/              # API Routes
│   │   │   ├── 📂 tasks/        # CRUD de tarefas
│   │   │   └── 📂 webhooks/     # Integração Clerk
│   │   ├── 📄 layout.tsx        # Layout com ClerkProvider
│   │   └── 📄 page.tsx          # Página inicial
│   ├── 📂 components/           # Componentes React
│   │   └── 📂 ui/               # Sistema de Design
│   └── 📂 lib/                  # Utilitários
├── 📂 prisma/                   # Schema e migrações
├── 📂 scripts/                  # Scripts de automação
├── 📂 docs/                     # Documentação
├── 📄 .env.example             # Template de configuração
└── 📄 package.json             # Dependências e scripts
```

---

## 🔐 **Configuração de Segurança**

### **Variáveis de Ambiente**
O projeto inclui:
- ✅ `.env.example` - Template seguro
- ✅ `.gitignore` - Proteção de dados sensíveis
- ✅ Scripts de verificação - Detecção de vazamentos

### **Scripts de Segurança**
```bash
npm run security-check    # Verificar arquivos sensíveis
npm run pre-push          # Validação antes do push
```

---

## 🤝 **Contribuição**

### **Como contribuir**
1. **Fork** o repositório
2. **Crie** uma branch: `git checkout -b feature/nova-feature`
3. **Commit** suas mudanças: `git commit -m 'feat: nova feature'`
4. **Push** para a branch: `git push origin feature/nova-feature`
5. **Abra** um Pull Request

### **Padrões do projeto**
- 📝 **Commits**: Conventional Commits
- 🏗️ **Arquitetura**: Clean Architecture
- 🧪 **Testes**: Jest + Testing Library
- 📚 **Docs**: Sempre atualizadas

---

## 📄 **Licença**

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 📞 **Contato & Links**

<div align="center">

**Desenvolvido por Eduardo** 

[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?style=for-the-badge&logo=github)](https://github.com/SEU_USUARIO)
[![Portfolio](https://img.shields.io/badge/Portfolio-Website-blue?style=for-the-badge&logo=google-chrome)](https://seu-portfolio.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/seu-perfil)

---

### 🎯 **Tarefix v1.0** 
*Transformando a forma como você gerencia suas tarefas*

**⭐ Se gostou do projeto, deixe uma estrela no repositório!**

</div>

