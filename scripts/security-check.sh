#!/bin/bash

# 🔒 Script de Verificação de Segurança - Tarefix
# Execute antes de fazer push para verificar se não há arquivos sensíveis

echo "🔍 Verificando segurança antes do push..."

# Lista de arquivos/padrões sensíveis
SENSITIVE_FILES=(
    ".env"
    ".env.local"
    ".env.production.local"
    "*.key"
    "*.pem"
    "*.p12"
    "*.log"
    "*.backup"
    "*.dump"
)

# Verificar se arquivos sensíveis estão staged
echo "📋 Verificando arquivos staged..."
STAGED_FILES=$(git diff --cached --name-only)

if [ -z "$STAGED_FILES" ]; then
    echo "⚠️  Nenhum arquivo staged para commit."
    exit 1
fi

# Verificar cada arquivo sensível
SECURITY_VIOLATION=false

for file in "${SENSITIVE_FILES[@]}"; do
    if echo "$STAGED_FILES" | grep -q "$file"; then
        echo "🚨 ALERTA: Arquivo sensível detectado: $file"
        SECURITY_VIOLATION=true
    fi
done

# Verificar conteúdo dos arquivos por palavras-chave sensíveis
echo "🔍 Verificando conteúdo dos arquivos..."
SENSITIVE_PATTERNS=(
    "sk_test_"
    "sk_live_"
    "postgresql://.*:.*@"
    "mysql://.*:.*@"
    "mongodb://.*:.*@"
    "password.*="
    "secret.*="
    "token.*="
    "api_key.*="
)

for file in $STAGED_FILES; do
    if [ -f "$file" ]; then
        for pattern in "${SENSITIVE_PATTERNS[@]}"; do
            if grep -qi "$pattern" "$file"; then
                echo "🚨 ALERTA: Padrão sensível encontrado em $file: $pattern"
                SECURITY_VIOLATION=true
            fi
        done
    fi
done

# Verificar se .env está no .gitignore
if [ -f ".env" ] && ! grep -q "^\.env$" .gitignore; then
    echo "🚨 ALERTA: .env existe mas não está no .gitignore!"
    SECURITY_VIOLATION=true
fi

# Resultado final
if [ "$SECURITY_VIOLATION" = true ]; then
    echo ""
    echo "❌ VERIFICAÇÃO DE SEGURANÇA FALHOU!"
    echo "   Remova os arquivos sensíveis antes de fazer commit."
    echo ""
    echo "💡 Comandos úteis:"
    echo "   git reset HEAD <arquivo>     # Remove arquivo do stage"
    echo "   git rm --cached <arquivo>    # Remove do Git (mantém local)"
    echo "   echo '<arquivo>' >> .gitignore  # Adiciona ao .gitignore"
    echo ""
    exit 1
else
    echo ""
    echo "✅ VERIFICAÇÃO DE SEGURANÇA PASSOU!"
    echo "   Todos os arquivos estão seguros para commit."
    echo ""
    exit 0
fi
