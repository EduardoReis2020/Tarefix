import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Tarefix</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Link 
                  href="/sign-in"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/sign-up"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Começar
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Gerencie suas tarefas<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900">
                de forma inteligente
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Uma plataforma moderna e intuitiva para organizar, priorizar e acompanhar 
              suas tarefas com máxima eficiência.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/sign-up"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white text-lg font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Começar Gratuitamente
            </Link>
            <Link 
              href="/sign-in"
              className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Já tenho uma conta
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Organização Simples</h3>
              <p className="text-gray-600 leading-relaxed">
                Crie, edite e organize suas tarefas de forma intuitiva com nossa interface limpa e moderna.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Alta Performance</h3>
              <p className="text-gray-600 leading-relaxed">
                Acesse suas tarefas instantaneamente com nossa arquitetura otimizada e responsiva.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Totalmente Seguro</h3>
              <p className="text-gray-600 leading-relaxed">
                Seus dados protegidos com criptografia avançada e autenticação robusta.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Tarefix. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
