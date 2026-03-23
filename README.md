# Tarefix

Aplicação web colaborativa para gerenciamento de tarefas, permitindo que equipes organizem atividades, acompanhem responsabilidades e mantenham um histórico do que aconteceu em cada time.

---

## ✨ Principais recursos

- **Autenticação de usuários** com registro, login e senhas criptografadas (bcrypt + JWT via [`jose`](lib/jwt.ts)).
- **Gestão de times** com proprietário (`ownerId`) e permissões por membro (`ADMIN`, `MEMBER`, `READONLY`).
- **Convites e memberships** para controlar quem participa de cada time.
- **Gestão de tarefas** com prioridade, status, datas e relacionamento com time.
- **Camada de serviços e repositórios** para concentrar regras de negócio e acesso ao banco.
- **Script de verificação** (`scripts/test-flow.js`) que exerce o fluxo principal: registrar usuário → logar → criar time → criar tarefa.

> Observação: modelos como `Plan`, `ActivityLog` e `Invite` já estão presentes no schema Prisma e serão evoluídos conforme as necessidades do produto futuramente.

---

## 🧱 Tech stack

| Camada        | Tecnologia / Ferramenta |
|---------------|-------------------------|
| UI & SSR      | [Next.js 15](https://nextjs.org/) (App Router) + React 19 + Tailwind CSS |
| API           | Next.js API Routes em TypeScript (controllers → services → repositories) |
| Banco         | PostgreSQL (Neon) + [Prisma ORM](https://www.prisma.io/) |
| Autenticação  | JWT com a biblioteca [`jose`](https://github.com/panva/jose) |
| Testes        | [Vitest](https://vitest.dev/) |
| Qualidade     | ESLint 9 + TypeScript 5 |

---

## 📂 Estrutura (resumo)

```text
app/
├── api/
│   ├── auth/             # Rotas de autenticação (login, register, me, logout)
│   ├── tasks/            # Rotas de tarefas (listar, criar, editar, deletar)
│   ├── teams/            # Rotas de times
│   └── controllers/      # Controllers HTTP
│       services/         # Regras de negócio
│       repositories/     # Acesso ao banco via Prisma
├── dashboard/            # Página inicial autenticada (frontend)
├── login/                # Tela de login
├── register/             # Tela de registro
└── ...
components/               # Componentes React reutilizáveis (Header, Footer, etc.)
lib/                      # Utilitários (ex.: helper JWT)
prisma/                   # Schema e migrações
scripts/                  # Scripts auxiliares (ex.: test-flow.js)
tests/                    # Testes (Vitest)
```

---

---

## ✅ Pré-requisitos

- Node.js 18 ou superior
- NPM 9 (vem com o Node)
- Banco PostgreSQL acessível (o projeto utiliza Neon nas configurações de exemplo)

---

## 🚀 Como rodar localmente

1. **Clonar o repositório**

	```bash
	git clone https://github.com/EduardoReis2020/Tarefix.git
	cd Tarefix
	```

2. **Instalar dependências**

	```bash
	npm install
	```

3. **Configurar o arquivo `.env`**

	```env
	DATABASE_URL="postgresql://<usuario>:<senha>@<host>/<db>?sslmode=require"
	JWT_SECRET="sua_chave_super_secreta"
	```

4. **Aplicar migrações & gerar Prisma Client**

	```bash
	npx prisma migrate deploy   # ou npx prisma migrate dev para ambientes locais
	npx prisma generate
	```

5. **Executar o servidor de desenvolvimento**

	```bash
	npm run dev
	```

	A aplicação ficará disponível em <http://localhost:3000>.

6. **Rodar testes e lint (opcional)**

	```bash
	npm run test     # vitest
	npm run lint     # eslint
	```

7. **Validar o fluxo completo via script (opcional)**

	```bash
	node scripts/test-flow.js
	```

	Use `BASE_URL` para apontar para outro ambiente, caso necessário:

	```bash
	BASE_URL=https://tarefix.dev node scripts/test-flow.js
	```

---

## 🧪 Testes & qualidade

| Comando               | Descrição                                                      |
|-----------------------|----------------------------------------------------------------|
| `npm run test`        | Executa a suíte de testes Vitest.                              |
| `npm run lint`        | Analisa o código com ESLint.                                   |
| `npx prisma studio`   | Abre o Prisma Studio para inspecionar e editar dados.          |
| `node scripts/test-flow.js` | Smoke test completo da API (registro → login → time → tarefa). |

---

## � Banco de dados & Prisma

- `npx prisma migrate dev --name <nome>`: cria e aplica nova migração em desenvolvimento.
- `npx prisma migrate deploy`: aplica migrações existentes (ideal para produção).
- `npx prisma studio`: interface visual para consultar e editar dados.

O schema principal encontra-se em `prisma/schema.prisma` e as migrações ficam versionadas em `prisma/migrations/`.

---

## � Autenticação

- Rotas protegidas esperam o header `Authorization: Bearer <token>`.
- O middleware (`middleware.ts`) valida o token e injeta `x-user-id` para os controllers.
- Tokens são assinados com o helper definido em `lib/jwt.ts`.

---

## 📌 Próximos passos

- Implementar a UI das rotas existentes (dashboard, tarefas, times) consumindo o backend.
- Adicionar documentação interativa da API (Swagger/OpenAPI) em `/docs`.
- Criar testes end-to-end (Playwright ou Cypress) cobrindo os fluxos críticos.

---

## 🤝 Contribuindo

1. Faça um fork do projeto.
2. Crie uma branch para sua feature/fix.
3. Garanta que `npm run lint` e `npm run test` passam.
4. Abra um Pull Request descrevendo as mudanças.

Sugestões, issues e PRs são muito bem-vindos!

---
