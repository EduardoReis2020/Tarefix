# Script para Apagar Historico do Git - Tarefix
# Execute com cuidado - NAO HA COMO DESFAZER!

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "         APAGAR HISTORICO DO GIT - TAREFIX       " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se estamos em um repositorio Git
if (-not (Test-Path ".git")) {
    Write-Host "ERRO: Nao e um repositorio Git!" -ForegroundColor Red
    exit 1
}

# Verificar se ha mudancas nao commitadas
Write-Host "Verificando mudancas pendentes..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host ""
    Write-Host "AVISO: Ha mudancas nao commitadas!" -ForegroundColor Yellow
    Write-Host "Mudancas encontradas:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    $continueWithChanges = Read-Host "Continuar mesmo assim? Mudancas serao perdidas! (digite 'SIM' para continuar)"
    if ($continueWithChanges -ne "SIM") {
        Write-Host "Operacao cancelada." -ForegroundColor Red
        exit 1
    }
}

# Mostrar informacoes do repositorio atual
Write-Host ""
Write-Host "Informacoes do repositorio atual:" -ForegroundColor Cyan
Write-Host "Branch atual: " -NoNewline -ForegroundColor White
git branch --show-current
Write-Host "Total de commits: " -NoNewline -ForegroundColor White
git rev-list --all --count
Write-Host "Remotes configurados:" -ForegroundColor White
git remote -v

# Verificar se ha dados sensiveis no historico
Write-Host ""
Write-Host "Verificando dados sensiveis no historico..." -ForegroundColor Yellow
$sensitiveFiles = git log --all --name-only --pretty=format: | Sort-Object | Get-Unique | Where-Object { $_ -match "\.(env|key|pem|log)$" }
if ($sensitiveFiles) {
    Write-Host "ATENCAO: Arquivos sensiveis encontrados no historico:" -ForegroundColor Red
    $sensitiveFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host "E recomendado apagar o historico por seguranca." -ForegroundColor Yellow
}

# Confirmar acao
Write-Host ""
Write-Host "AVISO CRITICO:" -ForegroundColor Red
Write-Host "- Todo o historico de commits sera PERMANENTEMENTE apagado" -ForegroundColor Red
Write-Host "- Todas as branches serao perdidas" -ForegroundColor Red
Write-Host "- Nao ha como desfazer esta operacao" -ForegroundColor Red
Write-Host ""

$confirm1 = Read-Host "Confirma que quer apagar TODO o historico? (digite 'CONFIRMO')"
if ($confirm1 -ne "CONFIRMO") {
    Write-Host "Operacao cancelada." -ForegroundColor Red
    exit 1
}

$confirm2 = Read-Host "Tem certeza ABSOLUTA? Esta e a ultima chance! (digite 'SIM')"
if ($confirm2 -ne "SIM") {
    Write-Host "Operacao cancelada." -ForegroundColor Red
    exit 1
}

# Salvar informacoes importantes antes de apagar
$currentRemotes = git remote -v
$currentBranch = git branch --show-current

Write-Host ""
Write-Host "Executando limpeza do historico..." -ForegroundColor Yellow

try {
    # Passo 1: Remover pasta .git
    Write-Host "1. Removendo pasta .git..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force .git
    
    # Passo 2: Inicializar novo repositorio
    Write-Host "2. Inicializando novo repositorio..." -ForegroundColor Cyan
    git init | Out-Null
    
    # Passo 3: Configurar .gitignore se nao existir
    if (-not (Test-Path ".gitignore")) {
        Write-Host "3. Criando .gitignore basico..." -ForegroundColor Cyan
        @"
# Arquivos sensiveis
.env
.env.local
.env.production.local
*.key
*.pem
*.log

# Dependencies
node_modules/
.next/

# Sistema
.DS_Store
Thumbs.db
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    }
    
    # Passo 4: Verificar se .env esta seguro
    if ((Test-Path ".env") -and -not (Select-String -Path ".gitignore" -Pattern "\.env" -Quiet)) {
        Write-Host "AVISO: Adicionando .env ao .gitignore por seguranca..." -ForegroundColor Yellow
        Add-Content -Path ".gitignore" -Value "`n.env"
    }
    
    # Passo 5: Adicionar arquivos
    Write-Host "3. Adicionando arquivos ao novo repositorio..." -ForegroundColor Cyan
    git add .
    
    # Passo 6: Commit inicial
    Write-Host "4. Criando commit inicial..." -ForegroundColor Cyan
    $commitMessage = @"
🎉 Inicial: Tarefix - Task Manager

✨ Features:
- Next.js 15 com TypeScript  
- Clerk Authentication
- Prisma ORM com PostgreSQL
- Tailwind CSS
- API Routes protegidas
- Scripts de seguranca

🔒 Seguranca:
- Arquivos sensiveis protegidos
- Scripts de verificacao
- Documentacao de seguranca

🚀 Pronto para desenvolvimento!
"@
    
    git commit -m $commitMessage | Out-Null
    
    Write-Host ""
    Write-Host "✅ HISTORICO APAGADO COM SUCESSO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Informacoes do novo repositorio:" -ForegroundColor Cyan
    Write-Host "Commits: 1 (inicial)" -ForegroundColor White
    Write-Host "Branch: " -NoNewline -ForegroundColor White
    git branch --show-current
    Write-Host "Arquivos: " -NoNewline -ForegroundColor White
    git ls-files | Measure-Object | Select-Object -ExpandProperty Count
    
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Yellow
    Write-Host "1. Verificar arquivos com: git status" -ForegroundColor White
    Write-Host "2. Executar verificacao de seguranca: npm run security-check" -ForegroundColor White
    
    if ($currentRemotes) {
        Write-Host "3. Reconectar ao remote:" -ForegroundColor White
        $currentRemotes | ForEach-Object {
            if ($_ -match "origin\s+(.+)\s+\(push\)") {
                $remoteUrl = $matches[1]
                Write-Host "   git remote add origin $remoteUrl" -ForegroundColor Gray
            }
        }
        Write-Host "4. Fazer push forcado: git push -u origin main --force" -ForegroundColor White
        Write-Host ""
        Write-Host "ATENCAO: O push --force ira SOBRESCREVER o repositorio remoto!" -ForegroundColor Red
    }
    
} catch {
    Write-Host ""
    Write-Host "ERRO durante a operacao: $_" -ForegroundColor Red
    Write-Host "Voce pode precisar restaurar de um backup." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Operacao concluida com sucesso! 🎉" -ForegroundColor Green
