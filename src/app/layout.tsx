import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata = {
  title: 'Tarefix - Sistema de Gerenciamento de Tarefas',
  description: 'Sistema moderno e completo para gerenciar suas tarefas e projetos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body 
          className="bg-gray-50 text-gray-900"
          suppressHydrationWarning={true}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
