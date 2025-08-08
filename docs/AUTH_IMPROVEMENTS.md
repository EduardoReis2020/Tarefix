# 🔐 Melhorias de Autenticação JWT

## ✅ O que foi implementado

### 1. **Refresh Tokens**
- **Access Token**: Curta duração (15 minutos)
- **Refresh Token**: Longa duração (7 dias)
- **Segurança**: Refresh tokens são armazenados em cookies httpOnly

### 2. **Rate Limiting**
- **Login**: Máximo 5 tentativas por 15 minutos por IP
- **Proteção**: Contra ataques de força bruta
- **Headers**: Informações de limite nos headers HTTP

### 3. **Tipagem Melhorada**
- **TypeScript**: Interfaces para todos os tipos de token
- **Validação**: Verificação de tipo de token (access/refresh)

### 4. **Segurança Aprimorada**
- **Cookies seguros**: httpOnly, secure, sameSite
- **Logs de erro**: Para auditoria
- **Validação**: Verificação dupla de tokens

## 🚀 Como usar

### Frontend - Login
```typescript
import { tokenManager } from '@/lib/tokenManager';

// Fazer login
const result = await tokenManager.login('user@example.com', 'password');
console.log(result.user); // Dados do usuário
```

### Frontend - Requisições autenticadas
```typescript
// Requisição que automaticamente renova token se necessário
const response = await tokenManager.authenticatedFetch('/api/tasks', {
  method: 'GET'
});
```

### Backend - Proteger rotas
```typescript
import { authenticate } from '@/lib/authMiddleware';

export async function GET(request: NextRequest) {
  const userPayload = authenticate(request);
  if (!userPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = userPayload.userId;
  // Sua lógica aqui...
}
```

## 🔧 Configuração

### Variáveis de ambiente (.env)
```env
JWT_SECRET=your-super-secret-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
DATABASE_URL=your-database-url
```

### Fluxo de autenticação

1. **Login**: Usuário faz login → Recebe access token + refresh token (cookie)
2. **Requisições**: Frontend usa access token no header Authorization
3. **Expiração**: Se access token expira → Frontend automaticamente renova via refresh token
4. **Logout**: Remove refresh token do cookie

## 📊 Benefícios das melhorias

| Antes | Depois |
|-------|--------|
| Token de 7 dias | Access: 15min, Refresh: 7 dias |
| Sem rate limiting | 5 tentativas por 15min |
| Tipagem básica | TypeScript completo |
| Token único | Renovação automática |
| Vulnerável a XSS | Refresh tokens em httpOnly cookies |

## 🛡️ Próximos passos recomendados

1. **Blacklist de tokens**: Para logout forçado
2. **Redis**: Para rate limiting em produção
3. **2FA**: Autenticação de dois fatores
4. **Audit logs**: Registro de atividades de login
5. **Geolocalização**: Detecção de login suspeito

## 🧪 Testes

### Testar rate limiting
```bash
# Fazer 6 tentativas rápidas de login com credenciais inválidas
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'
```

### Testar refresh token
```bash
# 1. Fazer login
# 2. Esperar 16 minutos (access token expira)
# 3. Fazer requisição → Deve renovar automaticamente
```

## 🔍 Monitoramento

Logs importantes para monitorar:
- Tentativas de login falhadas
- Uso de refresh tokens
- Rate limiting ativado
- Erros de verificação de token
