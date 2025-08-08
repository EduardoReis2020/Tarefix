import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Crie sua conta</h1>
          <p className="text-gray-600 mt-2">Comece a organizar suas tarefas hoje</p>
        </div>
        
        <div className="flex justify-center">
            <SignUp 
            appearance={{
                elements: {
                formButtonPrimary: 
                    "bg-gray-900 hover:bg-gray-800 text-sm normal-case",
                card: "shadow-xl border border-gray-200",
                headerTitle: "hidden",
                headerSubtitle: "hidden"
                }
            }}
            />
        </div>
      </div>
    </div>
  )
}
