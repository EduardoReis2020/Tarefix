# 🔒 GUIA DE SEGURANÇA - TAREFIX

## ⚠️ ARQUIVOS QUE NUNCA DEVEM SER COMPARTILHADOS

### 🚫 CRÍTICOS (Nunca compartilhar)
- `.env` - Contém credenciais do banco de dados e chaves de API
- `.env.local` - Variáveis de ambiente locais
- `.env.production.local` - Configurações de produção
- `*.key` - Chaves privadas
- `*.pem` - Certificados SSL/TLS
- `*.p12` - Certificados PKCS#12

### 📊 DADOS SENSÍVEIS
- `*.db`, `*.sqlite` - Bancos de dados locais
- `*.backup`, `*.dump` - Backups de banco
- `*.log` - Logs que podem conter dados pessoais

### 🛠️ CONFIGURAÇÕES PESSOAIS
- `.vscode/settings.json` - Configurações pessoais do VS Code
- `.idea/` - Configurações do IntelliJ/WebStorm

## ✅ ARQUIVOS SEGUROS PARA COMPARTILHAR

### 📝 DOCUMENTAÇÃO
- `README.md`
- `SECURITY.md` (este arquivo)
- `package.json`
- `prisma/schema.prisma`

### 🔧 CONFIGURAÇÃO
- `.env.example` - Template das variáveis de ambiente
- `.gitignore` - Configuração do Git
- `next.config.ts` - Configuração do Next.js
- `tailwind.config.js` - Configuração do Tailwind

### 💻 CÓDIGO
- `src/**/*.tsx` - Componentes React
- `src/**/*.ts` - Código TypeScript
- Arquivos de migração do Prisma (sem dados)

## 🔐 CHAVES E CREDENCIAIS NO PROJETO

### DATABASE_URL
```
postgresql://username:password@host/database
```
**Risco**: Acesso total ao banco de dados
**Localização**: `.env`

### CLERK_SECRET_KEY
```
sk_test_xxxxxxxxxxxxxxx
```
**Risco**: Controle total da autenticação
**Localização**: `.env`

### NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```
pk_test_xxxxxxxxxxxxxxx
```
**Risco**: Menor (é pública), mas pode expor configuração
**Localização**: `.env`

## 🛡️ MELHORES PRÁTICAS

### ✅ FAÇA
1. **Use `.env.example`** para documentar variáveis necessárias
2. **Mantenha .gitignore atualizado** com todos os arquivos sensíveis
3. **Use chaves diferentes** para desenvolvimento e produção
4. **Rotacione chaves regularmente** em produção
5. **Monitore logs** para vazamentos acidentais de dados

### ❌ NÃO FAÇA
1. **Nunca** faça commit de arquivos `.env`
2. **Nunca** inclua credenciais em código
3. **Nunca** use credenciais de produção em desenvolvimento
4. **Nunca** compartilhe chaves em chat/email
5. **Nunca** faça hardcode de URLs de produção

## 🚨 EM CASO DE EXPOSIÇÃO ACIDENTAL

### Se credenciais foram expostas no Git:

1. **Revogue imediatamente** todas as chaves expostas
2. **Gere novas credenciais** em todos os serviços
3. **Reescreva o histórico do Git** (se necessário):
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env' \
   --prune-empty --tag-name-filter cat -- --all
   ```
4. **Force push** após limpeza:
   ```bash
   git push origin --force --all
   ```

### Serviços a atualizar:
- **Neon/PostgreSQL**: Rotacionar senha do banco
- **Clerk**: Regenerar chaves no dashboard
- **Vercel/Deploy**: Atualizar variáveis de ambiente

## 📞 CONTATOS DE EMERGÊNCIA

- **Clerk Support**: support@clerk.com
- **Neon Support**: support@neon.tech

---

**Lembre-se**: A segurança é responsabilidade de todos! 🔐
