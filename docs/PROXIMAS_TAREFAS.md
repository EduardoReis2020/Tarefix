# 🚀 **PRÓXIMAS TAREFAS - TAREFIX**

> **Tarefas Específicas para Implementação Imediata**

---

## 🎯 **TAREFAS PRIORITÁRIAS (ESTA SEMANA)**

### **⚡ TAREFA 1: Completar Dashboard Principal** 
**Prazo**: 2-3 dias | **Prioridade**: 🔴 CRÍTICA

#### **📋 Subtarefas**
- [ ] **1.1** Criar componente `DashboardStats`
  - Métricas: Total de tarefas, Concluídas hoje, Pendentes, Vencidas
  - Cards com ícones e cores diferenciadas
  - Animação de carregamento

- [ ] **1.2** Melhorar layout do dashboard existente
  - Grid responsivo (1 coluna mobile, 2-3 desktop)
  - Seção "Tarefas Recentes" (últimas 5)
  - Seção "Deadlines Próximos" (próximas 5)
  - Quick Actions: "Nova Tarefa", "Ver Todas"

- [ ] **1.3** Implementar navegação
  - Links funcionais para `/dashboard/tasks`
  - Breadcrumbs básicos
  - Menu lateral ou top navigation

**📁 Arquivos para modificar:**
- `src/app/dashboard/page.tsx`
- `src/components/dashboard/DashboardStats.tsx` (criar)
- `src/components/dashboard/QuickActions.tsx` (criar)

---

### **⚡ TAREFA 2: Interface Completa de Tarefas**
**Prazo**: 2-3 dias | **Prioridade**: 🔴 CRÍTICA

#### **📋 Subtarefas**
- [ ] **2.1** Criar página `/dashboard/tasks`
  - Layout com header, filtros e lista
  - Botão "Nova Tarefa" proeminente
  - Loading skeleton para lista

- [ ] **2.2** Componente `TaskCard` completo
  - Checkbox para marcar como concluída
  - Display: título, descrição (truncada), data, prioridade
  - Badges visuais para status e prioridade
  - Botões de ação: editar, deletar
  - Estados visuais diferentes (pending, done, overdue)

- [ ] **2.3** Modal/Drawer para TaskForm
  - Formulário de criação/edição
  - Validação em tempo real
  - Estados de loading durante submit
  - Fechar com ESC ou backdrop click

**📁 Arquivos para criar:**
- `src/app/dashboard/tasks/page.tsx`
- `src/components/tasks/TaskCard.tsx`
- `src/components/tasks/TaskList.tsx`
- `src/components/tasks/TaskModal.tsx`

---

### **⚡ TAREFA 3: Funcionalidades do Frontend**
**Prazo**: 2 dias | **Prioridade**: 🟠 ALTA

#### **📋 Subtarefas**
- [ ] **3.1** Hook `useTasks` personalizado
  - Fetch, create, update, delete
  - Estados de loading e error
  - Cache local básico
  - Toast notifications

- [ ] **3.2** Integração com API existente
  - Conectar todos os endpoints
  - Tratamento de erros consistente
  - Optimistic updates para UX

- [ ] **3.3** Funcionalidade de toggle status
  - Click no checkbox marca como done
  - Animação de risco na tarefa
  - Undo action (opcional)

**📁 Arquivos para criar:**
- `src/hooks/useTasks.ts`
- `src/lib/api.ts` (client API utils)

---

## 🎨 **TAREFAS SECUNDÁRIAS (SEMANA 2)**

### **🔍 TAREFA 4: Sistema de Filtros**
**Prazo**: 1-2 dias | **Prioridade**: 🟡 MÉDIA

- [ ] **4.1** Componente `TaskFilters`
  - Filtro por status (dropdown)
  - Filtro por prioridade (checkboxes)
  - Busca por título (input com debounce)
  - Botão "Limpar filtros"

- [ ] **4.2** Estado global de filtros
  - Context ou state local
  - Persistir na URL (query params)
  - Aplicar filtros na API

### **🎨 TAREFA 5: Melhorias de UX**
**Prazo**: 1-2 dias | **Prioridade**: 🟡 MÉDIA

- [ ] **5.1** Loading states
  - Skeleton components
  - Spinners em botões
  - Loading overlay

- [ ] **5.2** Toast notifications
  - Sistema de notificações
  - Success, error, info, warning
  - Auto-dismiss e ações

- [ ] **5.3** Empty states
  - Primeira experiência do usuário
  - Estados sem tarefas
  - CTAs para criar primeira tarefa

---

## 🛠️ **IMPLEMENTAÇÃO PASSO A PASSO**

### **🎯 COMEÇAR POR AQUI - Dashboard Stats**

#### **Passo 1**: Criar componente de estatísticas
```typescript
// src/components/dashboard/DashboardStats.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'

interface Stats {
  total: number
  completed: number
  pending: number
  overdue: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscar estatísticas da API
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // TODO: Implementar endpoint /api/tasks/stats
      const response = await fetch('/api/tasks/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Carregando estatísticas...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Implementar cards de estatísticas */}
    </div>
  )
}
```

#### **Passo 2**: Adicionar endpoint de estatísticas
```typescript
// src/app/api/tasks/stats/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Buscar estatísticas agregadas
    const [total, completed, pending, overdue] = await Promise.all([
      prisma.task.count({ where: { userId: user.id } }),
      prisma.task.count({ where: { userId: user.id, status: 'DONE' } }),
      prisma.task.count({ where: { userId: user.id, status: 'PENDING' } }),
      prisma.task.count({ 
        where: { 
          userId: user.id, 
          status: { not: 'DONE' },
          dueDate: { lt: new Date() }
        } 
      })
    ])

    return NextResponse.json({
      total,
      completed,
      pending,
      overdue
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

#### **Passo 3**: Integrar no dashboard
```typescript
// src/app/dashboard/page.tsx - adicionar ao componente existente
import { DashboardStats } from '@/components/dashboard/DashboardStats'

export default function DashboardPage() {
  // ... código existente

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Novo componente de estatísticas */}
      <DashboardStats />
      
      {/* Resto do dashboard existente */}
      {/* ... */}
    </div>
  )
}
```

---

### **🎯 SEGUNDA PRIORIDADE - TaskCard Component**

#### **Modelo do TaskCard**
```typescript
// src/components/tasks/TaskCard.tsx
'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

interface Task {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'OVERDUE'
  createdAt: string
}

interface TaskCardProps {
  task: Task
  onToggleStatus: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onToggleStatus, onEdit, onDelete }: TaskCardProps) {
  const isCompleted = task.status === 'DONE'
  const isOverdue = task.status === 'OVERDUE'
  
  return (
    <Card className={`transition-all ${isCompleted ? 'opacity-70' : ''} ${isOverdue ? 'border-red-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleStatus(task.id)}
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />
          
          <div className="flex-1 min-w-0">
            {/* Título */}
            <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            
            {/* Descrição */}
            {task.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            
            {/* Metadata */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                {/* Badge de Prioridade */}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityStyles(task.priority)}`}>
                  {task.priority}
                </span>
                
                {/* Data de vencimento */}
                {task.dueDate && (
                  <span className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                    {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
              
              {/* Ações */}
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(task)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(task.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Deletar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getPriorityStyles(priority: string) {
  switch (priority) {
    case 'URGENT': return 'bg-red-100 text-red-800'
    case 'HIGH': return 'bg-orange-100 text-orange-800'
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
    case 'LOW': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
```

---

## 📋 **CHECKLIST DE VERIFICAÇÃO**

### **✅ Antes de Implementar Cada Tarefa**
- [ ] Leia os templates de código fornecidos
- [ ] Entenda a estrutura atual do projeto
- [ ] Identifique dependências entre tarefas
- [ ] Prepare os dados/APIs necessários

### **✅ Durante a Implementação**
- [ ] Siga os padrões de nomenclatura
- [ ] Implemente TypeScript sem `any`
- [ ] Adicione tratamento de erro
- [ ] Teste responsividade
- [ ] Faça commits frequentes com mensagens claras

### **✅ Após Cada Implementação**
- [ ] Teste a funcionalidade manualmente
- [ ] Verifique console por erros
- [ ] Teste em mobile e desktop
- [ ] Documente mudanças significativas

---

## 🎯 **FOCO DESTA SEMANA**

### **🔥 Objetivo Principal**
Ter um **MVP funcional** do dashboard com:
- ✅ Estatísticas básicas
- ✅ Lista de tarefas interativa
- ✅ CRUD completo funcionando
- ✅ Interface responsiva e polida

### **📊 Métricas de Sucesso**
- Dashboard carrega em < 2s
- Todas as ações de tarefa funcionam
- Interface responsiva em mobile
- Zero erros no console
- Código organizado e documentado

### **🚀 Próximo Marco**
**Ao final desta semana**: Demonstrar aplicação funcional para usuários beta e coletar feedback inicial.

---

**🎯 DICA**: Comece sempre pelas funcionalidades mais críticas (Dashboard Stats → TaskCard → CRUD Integration). Não se preocupe com perfeição inicial - foque em fazer funcionar primeiro, otimizar depois!

*Arquivo atualizado conforme progresso do desenvolvimento*  
*Última atualização: 25/09/2025*