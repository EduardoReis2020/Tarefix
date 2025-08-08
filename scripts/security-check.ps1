# Script de Verificacao de Seguranca - Tarefix (PowerShell)
# Execute antes de fazer push para verificar se nao ha arquivos sensiveis

Write-Host "Verificando seguranca antes do push..." -ForegroundColor Cyan

# Lista de arquivos/padroes sensiveis
$SensitiveFiles = @(
    ".env",
    ".env.local",
    ".env.production.local",
    "*.key",
    "*.pem",
    "*.p12",
    "*.log",
    "*.backup",
    "*.dump"
)

# Verificar se arquivos sensiveis estao staged
Write-Host "Verificando arquivos staged..." -ForegroundColor Yellow
$StagedFiles = git diff --cached --name-only

if (-not $StagedFiles) {
    Write-Host "Nenhum arquivo staged para commit." -ForegroundColor Yellow
    exit 1
}

# Verificar cada arquivo sensivel
$SecurityViolation = $false

foreach ($file in $SensitiveFiles) {
    if ($StagedFiles -match $file) {
        Write-Host "ALERTA: Arquivo sensivel detectado: $file" -ForegroundColor Red
        $SecurityViolation = $true
    }
}

# Verificar conteudo dos arquivos por palavras-chave sensiveis
Write-Host "Verificando conteudo dos arquivos..." -ForegroundColor Yellow
$SensitivePatterns = @(
    "sk_test_",
    "sk_live_",
    "postgresql://.*:.*@",
    "mysql://.*:.*@",
    "mongodb://.*:.*@",
    "password.*=",
    "secret.*=",
    "token.*=",
    "api_key.*="
)

foreach ($file in $StagedFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -ErrorAction SilentlyContinue
        if ($content) {
            foreach ($pattern in $SensitivePatterns) {
                if ($content -match $pattern) {
                    Write-Host "ALERTA: Padrao sensivel encontrado em $file : $pattern" -ForegroundColor Red
                    $SecurityViolation = $true
                }
            }
        }
    }
}

# Verificar se .env esta no .gitignore
if ((Test-Path ".env") -and -not (Select-String -Path ".gitignore" -Pattern "^\.env$" -Quiet)) {
    Write-Host "ALERTA: .env existe mas nao esta no .gitignore!" -ForegroundColor Red
    $SecurityViolation = $true
}

# Resultado final
if ($SecurityViolation) {
    Write-Host ""
    Write-Host "VERIFICACAO DE SEGURANCA FALHOU!" -ForegroundColor Red
    Write-Host "Remova os arquivos sensiveis antes de fazer commit." -ForegroundColor Red
    Write-Host ""
    Write-Host "Comandos uteis:" -ForegroundColor Yellow
    Write-Host "git reset HEAD arquivo     # Remove arquivo do stage" -ForegroundColor White
    Write-Host "git rm --cached arquivo    # Remove do Git (mantem local)" -ForegroundColor White
    Write-Host "Adicione arquivo ao .gitignore" -ForegroundColor White
    Write-Host ""
    exit 1
} else {
    Write-Host ""
    Write-Host "VERIFICACAO DE SEGURANCA PASSOU!" -ForegroundColor Green
    Write-Host "Todos os arquivos estao seguros para commit." -ForegroundColor Green
    Write-Host ""
    exit 0
}
