import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div>
          {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm mb-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Tarefix</h1>
            </div>
          </div>
        </div>
      </header>
    <div className="flex items-center justify-center my-10">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-300",
              socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20",
              formButtonPrimary: "bg-gradient-to-r from-gray-600 to-white-600 hover:from-gray-700 hover:to-white-700",
              formFieldInput: "bg-white/10 border-white/20 text-white placeholder:text-gray-400",
              formFieldLabel: "text-gray-300",
              dividerLine: "bg-white/20",
              dividerText: "text-gray-300",
              footerActionLink: "text-purple-400 hover:text-purple-300"
            }
          }}
        />
      </div>
    </div>
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm mt-10">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Tarefix. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
