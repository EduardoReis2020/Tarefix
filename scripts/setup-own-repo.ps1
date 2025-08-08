# Script para Configurar Seu Proprio Repositorio - Tarefix
# Este script desconecta do repo atual e conecta ao seu proprio repo

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "    CONFIGURAR SEU PROPRIO REPOSITORIO GITHUB    " -ForegroundColor Cyan  
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar repositorio atual
Write-Host "Repositorio atual conectado:" -ForegroundColor Yellow
git remote -v

Write-Host ""
Write-Host "PROBLEMA DETECTADO:" -ForegroundColor Red
Write-Host "Voce esta conectado ao repositorio de outra pessoa!" -ForegroundColor Red
Write-Host "Repositorio atual: caochao39/tare_planner" -ForegroundColor Red
Write-Host ""

# Solicitar informacoes do novo repositorio
Write-Host "Para continuar, precisamos das informacoes do SEU repositorio:" -ForegroundColor Cyan
Write-Host ""

$githubUsername = Read-Host "Digite seu usuario do GitHub"
if (-not $githubUsername) {
    Write-Host "Usuario do GitHub e obrigatorio!" -ForegroundColor Red
    exit 1
}

$repoName = Read-Host "Digite o nome do repositorio (ex: tarefix, task-manager, etc)"
if (-not $repoName) {
    Write-Host "Nome do repositorio e obrigatorio!" -ForegroundColor Red
    exit 1
}

$newRepoUrl = "https://github.com/$githubUsername/$repoName.git"

Write-Host ""
Write-Host "Configuracao:" -ForegroundColor Cyan
Write-Host "Usuario: $githubUsername" -ForegroundColor White
Write-Host "Repositorio: $repoName" -ForegroundColor White
Write-Host "URL: $newRepoUrl" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "As informacoes estao corretas? (digite 'SIM')"
if ($confirm -ne "SIM") {
    Write-Host "Operacao cancelada." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "AVISO: Primeiro crie o repositorio no GitHub!" -ForegroundColor Yellow
Write-Host "1. Va para https://github.com" -ForegroundColor White
Write-Host "2. Clique em '+' -> 'New repository'" -ForegroundColor White
Write-Host "3. Nome: $repoName" -ForegroundColor White
Write-Host "4. NAO marque 'Add a README file'" -ForegroundColor White
Write-Host "5. Clique em 'Create repository'" -ForegroundColor White
Write-Host ""

$repoCreated = Read-Host "Ja criou o repositorio no GitHub? (digite 'SIM')"
if ($repoCreated -ne "SIM") {
    Write-Host "Crie o repositorio primeiro e execute o script novamente." -ForegroundColor Yellow
    exit 1
}

try {
    Write-Host ""
    Write-Host "Executando configuracao..." -ForegroundColor Yellow
    
    # Passo 1: Remover remote atual
    Write-Host "1. Removendo conexao com repositorio atual..." -ForegroundColor Cyan
    git remote remove tarefix 2>$null
    git remote remove origin 2>$null
    
    # Passo 2: Adicionar novo remote
    Write-Host "2. Conectando ao seu repositorio..." -ForegroundColor Cyan
    git remote add origin $newRepoUrl
    
    # Passo 3: Verificar se funcionou
    Write-Host "3. Verificando conexao..." -ForegroundColor Cyan
    $remotes = git remote -v
    
    if ($remotes -match $githubUsername) {
        Write-Host ""
        Write-Host "✅ SUCESSO! Repositorio configurado:" -ForegroundColor Green
        Write-Host $remotes -ForegroundColor White
        Write-Host ""
        
        Write-Host "Proximos passos:" -ForegroundColor Yellow
        Write-Host "1. npm run clean-git-history  # Para limpar historico" -ForegroundColor White
        Write-Host "   OU" -ForegroundColor Gray
        Write-Host "2. git add . && git commit -m 'Initial commit'" -ForegroundColor White
        Write-Host "3. git push -u origin main" -ForegroundColor White
        Write-Host ""
        
        Write-Host "IMPORTANTE:" -ForegroundColor Red
        Write-Host "- Se usar clean-git-history, o historico sera apagado" -ForegroundColor Red
        Write-Host "- Se fazer commit normal, mantera o historico existente" -ForegroundColor Red
        
    } else {
        Write-Host "ERRO: Nao foi possivel conectar ao repositorio." -ForegroundColor Red
        Write-Host "Verifique se o repositorio foi criado corretamente." -ForegroundColor Red
    }
    
} catch {
    Write-Host ""
    Write-Host "ERRO: $_" -ForegroundColor Red
    Write-Host "Verifique se o repositorio existe e tente novamente." -ForegroundColor Red
}

Write-Host ""
Write-Host "Configuracao concluida!" -ForegroundColor Green
