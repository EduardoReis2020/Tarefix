# 🔐 Configuração do Clerk - Guia Completo

## 📋 Pré-requisitos

Antes de começar, você precisa:
- Conta no [Clerk.dev](https://clerk.dev) (gratuita)
- Projeto Tarefix funcionando localmente

## 🚀 Passo a Passo

### **1. Criar Conta no Clerk**

1. Acesse [clerk.dev](https://clerk.dev)
2. Clique em "Sign up" 
3. Registre-se com email ou GitHub
4. Confirme seu email

### **2. Criar Nova Aplicação**

1. No dashboard do Clerk, clique em "Add Application"
2. Nome: **"Tarefix"**
3. Selecione os provedores de login desejados:
   - ✅ **Email** (obrigatório)
   - ✅ **Google** (recomendado)
   - ✅ **GitHub** (opcional)
4. Clique em "Create Application"

### **3. Copiar Chaves de API**

No dashboard da aplicação, vá em **"API Keys"**:

```env
# Copie estas chaves para seu .env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### **4. Configurar URLs de Redirecionamento**

1. Vá em **"Paths"** no menu lateral
2. Configure as URLs:

```
Sign-in URL: /auth/sign-in
Sign-up URL: /auth/sign-up
After sign-in URL: /dashboard
After sign-up URL: /dashboard
```

### **5. Configurar Webhook (Importante!)**

1. Vá em **"Webhooks"** no menu lateral
2. Clique em "Add Endpoint"
3. Configure:

```
Endpoint URL: http://localhost:3000/api/webhooks/clerk
Events: user.created, user.updated, user.deleted
```

4. **Copie o Signing Secret**:
```env
WEBHOOK_SECRET="whsec_..."
```

### **6. Configurar .env Completo**

Seu arquivo `.env` deve ficar assim:

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxx"
WEBHOOK_SECRET="whsec_xxxxxxxxx"

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### **7. Testar a Configuração**

1. **Reinicie o servidor**:
```bash
npm run dev
```

2. **Acesse**: http://localhost:3000

3. **Teste o fluxo**:
   - Clique em "Criar Conta"
   - Registre-se com seu email
   - Faça login
   - Verifique se chegou no dashboard

## 🎨 Personalizar Interface

### **Tema e Aparência**

No dashboard do Clerk, vá em **"Appearance"**:

1. **Logo**: Upload do logo do Tarefix
2. **Cores**:
   - Primary: `#1f2937`
   - Background: `#f9fafb`
3. **Tema**: Light (padrão do Tarefix)

### **Textos Personalizados**

Em **"Localization"**:
- Idioma: Português (BR)
- Personalizar mensagens de erro
- Textos dos botões em português

## 🔧 Configurações Avançadas

### **Segurança**

1. **Session Settings**:
   - Session timeout: 7 dias
   - Require multi-factor: Opcional

2. **Password Settings**:
   - Mínimo: 8 caracteres
   - Require special characters: Sim
   - Require numbers: Sim

### **Email Settings**

1. **From Email**: `noreply@seudominio.com`
2. **Email Templates**: Personalizar com branding Tarefix
3. **SMTP Custom**: Configurar se necessário

## 🌐 Deploy em Produção

### **1. Atualizar URLs**

No dashboard do Clerk:
1. Vá em **"Domains"**
2. Adicione seu domínio de produção
3. Atualize URLs:

```
Production URL: https://tarefix.com
Webhook URL: https://tarefix.com/api/webhooks/clerk
```

### **2. Variáveis de Produção**

```env
# Production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."
WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_APP_URL="https://tarefix.com"
```

### **3. Verificar Webhook**

No dashboard do Clerk, em **"Webhooks"**:
- Status deve ser "Active"
- Últimas entregas devem estar "Successful"

## 🚨 Solução de Problemas

### **Erro: "Invalid API Key"**
- Verifique se copiou as chaves corretas
- Confirme que não há espaços extras
- Reinicie o servidor após alterar .env

### **Erro: "Webhook failed"**
- Verifique se a URL está correta
- Confirme que o WEBHOOK_SECRET está configurado
- Teste localmente com ngrok se necessário

### **Login não funciona**
- Verifique as URLs de redirecionamento
- Confirme que o middleware está configurado
- Teste em navegador anônimo

### **Usuário não aparece no banco**
- Verifique se o webhook está funcionando
- Confirme se os eventos estão configurados
- Check logs do servidor

## 📞 Suporte

- **Documentação Clerk**: [docs.clerk.dev](https://docs.clerk.dev)
- **Comunidade**: [Discord do Clerk](https://discord.gg/clerk)
- **Suporte**: support@clerk.dev

---

## ✅ Checklist Final

- [ ] Conta Clerk criada
- [ ] Aplicação configurada
- [ ] Chaves API copiadas
- [ ] URLs configuradas
- [ ] Webhook funcionando
- [ ] .env atualizado
- [ ] Servidor reiniciado
- [ ] Teste de registro realizado
- [ ] Teste de login realizado
- [ ] Dashboard acessível

**🎉 Parabéns! Seu Tarefix agora está com autenticação profissional do Clerk!**
