# 🔥 GUIA: COMO APAGAR TODO O HISTÓRICO DO GIT

## ⚠️ AVISO CRÍTICO
**ISSO APAGARÁ PERMANENTEMENTE TODO O HISTÓRICO!**
- Todos os commits serão perdidos
- Todas as branches serão perdidas
- Todo o histórico de mudanças será perdido
- Não há como desfazer esta operação

## 🎯 QUANDO USAR
- Você quer começar do zero
- Há dados sensíveis no histórico
- O repositório ficou muito pesado
- Você quer um commit inicial limpo

---

## 🔥 MÉTODO 1: REINICIALIZAR REPOSITÓRIO (RECOMENDADO)

### Passo 1: Fazer backup (OPCIONAL mas recomendado)
```bash
# Criar backup da pasta atual
cp -r . ../backup-tarefix
```

### Passo 2: Remover o Git atual
```bash
# Windows PowerShell
Remove-Item -Recurse -Force .git

# Linux/Mac
rm -rf .git
```

### Passo 3: Inicializar novo repositório
```bash
git init
git add .
git commit -m "🎉 Inicial: Tarefix - Task Manager com Clerk Auth"
```

### Passo 4: Conectar ao GitHub (se necessário)
```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git branch -M main
git push -u origin main --force
```

---

## 🔥 MÉTODO 2: ORPHAN BRANCH (PRESERVA REMOTE)

```bash
# Criar nova branch órfã (sem histórico)
git checkout --orphan new-main

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "🎉 Inicial: Tarefix - Task Manager com Clerk Auth"

# Deletar branch antiga
git branch -D master  # ou main

# Renomear nova branch
git branch -m main

# Forçar push
git push -f origin main
```

---

## 🔥 MÉTODO 3: REBASE INTERATIVO (PRESERVA ALGUNS COMMITS)

```bash
# Ver histórico
git log --oneline

# Rebase interativo desde o primeiro commit
git rebase -i --root

# No editor, mude 'pick' para 'drop' nos commits que quer deletar
# Mude 'pick' para 'squash' para juntar commits
```

---

## 🛡️ SCRIPT AUTOMATIZADO SEGURO

### Windows PowerShell
```powershell
# Verificar se tem mudanças não commitadas
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️ Há mudanças não commitadas!" -ForegroundColor Yellow
    Write-Host "Faça commit ou stash antes de continuar." -ForegroundColor Yellow
    exit 1
}

# Confirmar ação
$confirm = Read-Host "🔥 Confirma apagar TODO o histórico? (digite 'SIM' para confirmar)"
if ($confirm -ne "SIM") {
    Write-Host "❌ Operação cancelada." -ForegroundColor Red
    exit 1
}

# Executar limpeza
Write-Host "🧹 Removendo histórico do Git..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .git

Write-Host "🎯 Inicializando novo repositório..." -ForegroundColor Green
git init
git add .
git commit -m "🎉 Inicial: Tarefix - Task Manager com Clerk Auth"

Write-Host "✅ Histórico apagado com sucesso!" -ForegroundColor Green
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. git remote add origin SEU_REPO_URL" -ForegroundColor White
Write-Host "2. git push -u origin main --force" -ForegroundColor White
```

---

## 🚨 VERIFICAÇÕES DE SEGURANÇA

### Antes de apagar:
```bash
# 1. Verificar se há dados sensíveis
git log --all --full-history -- .env

# 2. Verificar tamanho do repositório
du -sh .git

# 3. Listar todos os arquivos já commitados
git ls-files

# 4. Verificar remotes
git remote -v
```

### Depois de apagar:
```bash
# 1. Verificar se .env está ignorado
git check-ignore .env

# 2. Verificar se não há dados sensíveis
git log --oneline

# 3. Verificar tamanho
du -sh .git
```

---

## 🎯 COMANDOS ESPECÍFICOS PARA TAREFIX

```bash
# 1. Apagar histórico e começar limpo
Remove-Item -Recurse -Force .git
git init

# 2. Adicionar arquivos seguros
git add .gitignore
git add .env.example
git add SECURITY.md
git add README.md
git add package.json
git add src/
git add prisma/schema.prisma
git add scripts/
git add docs/

# 3. Commit inicial seguro
git commit -m "🎉 Inicial: Tarefix - Task Manager

✨ Features:
- Next.js 15 com TypeScript
- Clerk Authentication
- Prisma ORM com PostgreSQL
- Tailwind CSS
- API Routes protegidas
- Scripts de segurança

🔒 Segurança:
- .env ignorado
- Scripts de verificação
- Documentação de segurança"

# 4. Conectar ao GitHub
git remote add origin https://github.com/SEU_USUARIO/tarefix.git
git branch -M main
git push -u origin main --force
```

---

## 💡 DICAS IMPORTANTES

### ✅ FAÇA:
- Backup antes de apagar
- Verifique se .env está no .gitignore
- Use mensagens de commit descritivas
- Execute script de segurança antes do push

### ❌ NÃO FAÇA:
- Apagar histórico sem backup
- Forçar push sem verificar
- Incluir dados sensíveis no novo commit
- Esquecer de configurar .gitignore

---

**Escolha o método que melhor se adequa à sua situação!** 🚀
