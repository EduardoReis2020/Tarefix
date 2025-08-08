'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded) {
      fetchTasks()
    }
  }, [isLoaded])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })

      if (response.ok) {
        setNewTask({ title: '', description: '' })
        fetchTasks()
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      })

      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error)
    }
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const pendingTasks = tasks.filter(task => !task.completed).length

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando seu workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Moderno */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tarefix</h1>
                <p className="text-sm text-gray-500">Workspace</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-4 text-sm">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  ✓ {completedTasks} concluídas
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  ⏳ {pendingTasks} pendentes
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium">
                  Olá, {user?.firstName || 'Usuário'}!
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 rounded-xl",
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Bem-vindo de volta, {user?.firstName}! 👋
                </h2>
                <p className="text-gray-300 text-lg">
                  Você tem {pendingTasks} tarefa{pendingTasks !== 1 ? 's' : ''} pendente{pendingTasks !== 1 ? 's' : ''} para hoje
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Tarefas</p>
                <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-3xl font-bold text-amber-600">{pendingTasks}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Formulário para Nova Tarefa */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nova Tarefa
                </h3>
              </div>
              
              <form onSubmit={createTask} className="p-6 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Título da Tarefa
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                    placeholder="Ex: Revisar relatório mensal"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição (opcional)
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all resize-none"
                    placeholder="Adicione detalhes sobre a tarefa..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all transform hover:scale-[1.02]"
                >
                  Criar Tarefa
                </button>
              </form>
            </div>
          </div>

          {/* Lista de Tarefas */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Minhas Tarefas
                  </h3>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {tasks.length} total
                  </span>
                </div>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {tasks.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma tarefa ainda</h4>
                    <p className="text-gray-500 mb-6">Crie sua primeira tarefa para começar a organizar seu trabalho</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {tasks.map((task) => (
                      <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-start space-x-4">
                          <button
                            onClick={() => toggleTask(task.id, task.completed)}
                            className={`mt-1 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                              task.completed 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300 hover:border-green-400'
                            }`}
                          >
                            {task.completed && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-lg transition-all ${
                              task.completed 
                                ? 'line-through text-gray-500' 
                                : 'text-gray-900'
                            }`}>
                              {task.title}
                            </h4>
                            
                            {task.description && (
                              <p className={`mt-2 text-sm transition-all ${
                                task.completed 
                                  ? 'line-through text-gray-400' 
                                  : 'text-gray-600'
                              }`}>
                                {task.description}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-xs text-gray-400 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Criado em {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                              </p>
                              
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all p-1 rounded-lg hover:bg-red-50"
                                title="Deletar tarefa"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
