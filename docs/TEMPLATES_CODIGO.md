# 🎨 **PADRÕES DE CÓDIGO E TEMPLATES - TAREFIX**

> **Guia de Consistência para Desenvolvimento**

---

## 🏗️ **ESTRUTURA DE ARQUIVOS**

### **📁 Organização Recomendada**
```
src/
├── app/                     # App Router (Next.js 15)
│   ├── (auth)/             # Route groups
│   ├── dashboard/          # Protected routes
│   ├── api/                # API routes
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── ui/                 # Base UI components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   └── features/           # Feature-specific components
├── lib/                    # Utility functions
│   ├── utils.ts            # General utilities
│   ├── validations.ts      # Zod schemas
│   ├── constants.ts        # App constants
│   └── types.ts            # Global TypeScript types
├── hooks/                  # Custom React hooks
└── styles/                 # Additional styles
```

---

## 🧩 **TEMPLATES DE COMPONENTES**

### **📦 Componente UI Base**
```tsx
// src/components/ui/ComponentName.tsx
import React from 'react'
import { cn } from '@/lib/utils'

interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
}

export function ComponentName({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  className,
  ...props
}: ComponentNameProps) {
  return (
    <div
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        // Variant styles
        {
          'bg-gray-900 text-white hover:bg-gray-800': variant === 'primary',
          'bg-white text-gray-900 border hover:bg-gray-50': variant === 'secondary',
          'bg-transparent hover:bg-gray-100': variant === 'ghost',
        },
        // Size styles
        {
          'px-3 py-2 text-sm': size === 'sm',
          'px-4 py-2.5 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        // State styles
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

### **📋 Componente de Formulário**
```tsx
// src/components/forms/TaskForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { taskSchema } from '@/lib/validations'

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  initialData?: Partial<TaskFormData>
  onSubmit: (data: TaskFormData) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
}

export function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Salvar'
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'PENDING',
    ...initialData
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const validatedData = taskSchema.parse(formData)
      await onSubmit(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof TaskFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Título"
          value={formData.title}
          onChange={handleChange('title')}
          error={errors.title}
          required
        />
      </div>
      
      <div>
        <textarea
          placeholder="Descrição (opcional)"
          value={formData.description}
          onChange={handleChange('description')}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
```

### **🃏 Card Component**
```tsx
// src/components/ui/Card.tsx
import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-xl shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('px-6 py-4 border-b border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('px-6 py-4 border-t border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  )
}
```

---

## 🔧 **TEMPLATES DE API**

### **📡 API Route Template**
```typescript
// src/app/api/resource/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Validation schemas
const createSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  // ... outros campos
})

const updateSchema = createSchema.partial()

// GET - List resources
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Fetch resources
    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.resource.count({
        where: { userId: user.id }
      })
    ])

    return NextResponse.json({
      data: resources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('GET /api/resource error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Create resource
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = createSchema.parse(body)

    // Create resource
    const resource = await prisma.resource.create({
      data: {
        ...validatedData,
        userId: user.id
      }
    })

    return NextResponse.json({ data: resource }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('POST /api/resource error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
```

### **📡 Dynamic API Route Template**
```typescript
// src/app/api/resource/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: { id: string }
}

// GET - Get single resource
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const resource = await prisma.resource.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Recurso não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: resource })
  } catch (error) {
    console.error(`GET /api/resource/${params.id} error:`, error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Update resource
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verify resource exists and belongs to user
    const existingResource = await prisma.resource.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Recurso não encontrado' },
        { status: 404 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = updateSchema.parse(body)

    // Update resource
    const updatedResource = await prisma.resource.update({
      where: { id: params.id },
      data: validatedData
    })

    return NextResponse.json({ data: updatedResource })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error(`PUT /api/resource/${params.id} error:`, error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Delete resource
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verify resource exists and belongs to user
    const existingResource = await prisma.resource.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Recurso não encontrado' },
        { status: 404 }
      )
    }

    // Delete resource
    await prisma.resource.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Recurso deletado com sucesso' })
  } catch (error) {
    console.error(`DELETE /api/resource/${params.id} error:`, error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
```

---

## 🎣 **TEMPLATES DE HOOKS**

### **🎯 Hook de CRUD**
```typescript
// src/hooks/useResource.ts
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export interface Resource {
  id: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateResourceData {
  title: string
  description?: string
}

export interface UpdateResourceData extends Partial<CreateResourceData> {}

export function useResource() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch resources
  const fetchResources = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/resource')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao buscar recursos')
      }
      
      const { data } = await response.json()
      setResources(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  // Create resource
  const createResource = async (data: CreateResourceData) => {
    try {
      const response = await fetch('/api/resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar recurso')
      }

      const { data: newResource } = await response.json()
      setResources(prev => [newResource, ...prev])
      toast.success('Recurso criado com sucesso!')
      
      return newResource
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar recurso'
      toast.error(message)
      throw err
    }
  }

  // Update resource
  const updateResource = async (id: string, data: UpdateResourceData) => {
    try {
      const response = await fetch(`/api/resource/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar recurso')
      }

      const { data: updatedResource } = await response.json()
      setResources(prev =>
        prev.map(resource =>
          resource.id === id ? updatedResource : resource
        )
      )
      toast.success('Recurso atualizado com sucesso!')
      
      return updatedResource
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar recurso'
      toast.error(message)
      throw err
    }
  }

  // Delete resource
  const deleteResource = async (id: string) => {
    try {
      const response = await fetch(`/api/resource/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao deletar recurso')
      }

      setResources(prev => prev.filter(resource => resource.id !== id))
      toast.success('Recurso deletado com sucesso!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar recurso'
      toast.error(message)
      throw err
    }
  }

  // Initial load
  useEffect(() => {
    fetchResources()
  }, [])

  return {
    resources,
    loading,
    error,
    fetchResources,
    createResource,
    updateResource,
    deleteResource
  }
}
```

---

## 📝 **TEMPLATES DE VALIDAÇÃO**

### **🔍 Schemas Zod**
```typescript
// src/lib/validations.ts
import { z } from 'zod'

// Task validation
export const taskSchema = z.object({
  title: z.string()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  description: z.string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional(),
  dueDate: z.string()
    .datetime('Data inválida')
    .optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
    errorMap: () => ({ message: 'Prioridade inválida' })
  }),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE', 'OVERDUE', 'CANCELLED'], {
    errorMap: () => ({ message: 'Status inválido' })
  }),
  estimatedTime: z.number()
    .min(1, 'Tempo estimado deve ser maior que 0')
    .max(480, 'Tempo estimado deve ser menor que 8 horas')
    .optional(),
  tags: z.array(z.string().min(1)).max(10).optional()
})

export const taskUpdateSchema = taskSchema.partial()

// User validation
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  timezone: z.string().default('America/Sao_Paulo'),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']).default('DD/MM/YYYY'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    reminders: z.boolean().default(true)
  }).default({})
})

// Filter validation
export const taskFilterSchema = z.object({
  status: z.array(z.enum(['PENDING', 'IN_PROGRESS', 'DONE', 'OVERDUE', 'CANCELLED'])).optional(),
  priority: z.array(z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().max(100).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sortBy: z.enum(['title', 'dueDate', 'priority', 'createdAt', 'updatedAt']).default('dueDate'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10)
})
```

---

## 🎨 **UTILITIES E HELPERS**

### **🛠️ Utility Functions**
```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combine Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date
export function formatDate(date: string | Date, format: 'relative' | 'short' | 'long' = 'relative') {
  const d = new Date(date)
  const now = new Date()
  
  if (format === 'relative') {
    const diffTime = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    if (diffDays === -1) return 'Amanhã'
    if (diffDays < 7 && diffDays > 0) return `${diffDays} dias atrás`
    if (diffDays > -7 && diffDays < 0) return `Em ${Math.abs(diffDays)} dias`
  }
  
  if (format === 'short') {
    return d.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    })
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }
  
  return d.toLocaleDateString('pt-BR')
}

// Format time duration
export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return `${mins}min`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}min`
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Generate random color
export function generateColor(seed: string) {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-purple-100 text-purple-800',
    'bg-indigo-100 text-indigo-800',
    'bg-pink-100 text-pink-800',
    'bg-gray-100 text-gray-800'
  ]
  
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) & 0xffffffff
  }
  
  return colors[Math.abs(hash) % colors.length]
}
```

---

## 🏗️ **PADRÕES DE NOMENCLATURA**

### **📁 Arquivos e Pastas**
- **Componentes**: PascalCase (`TaskCard.tsx`)
- **Hooks**: camelCase começando com `use` (`useTask.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Páginas**: kebab-case (`task-details/page.tsx`)
- **API Routes**: kebab-case (`route.ts`)

### **🏷️ Variáveis e Funções**
- **Componentes**: PascalCase (`TaskCard`)
- **Variáveis**: camelCase (`taskList`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Funções**: camelCase (`handleSubmit`)
- **Types/Interfaces**: PascalCase (`TaskFormData`)

### **📝 Commit Messages**
```
feat: adiciona componente de filtros
fix: corrige bug na validação de data
docs: atualiza documentação da API
style: ajusta espaçamento dos cards
refactor: reorganiza estrutura de pastas
test: adiciona testes para TaskCard
chore: atualiza dependências
```

---

## ✅ **CHECKLIST DE DESENVOLVIMENTO**

### **🎨 Para Cada Componente**
- [ ] TypeScript interfaces definidas
- [ ] Props com valores padrão
- [ ] Estados de loading/error
- [ ] Responsividade testada
- [ ] Acessibilidade implementada
- [ ] Storybook stories (futuro)

### **📡 Para Cada API Route**
- [ ] Validação com Zod
- [ ] Autenticação verificada
- [ ] Error handling completo
- [ ] Logs estruturados
- [ ] Documentação da API
- [ ] Testes de integração

### **📱 Para Cada Página**
- [ ] SEO metadata
- [ ] Loading states
- [ ] Error boundaries
- [ ] Responsividade
- [ ] Performance otimizada
- [ ] Testes E2E críticos

---

*Templates atualizados conforme o projeto evolui*  
*Última atualização: 25/09/2025*