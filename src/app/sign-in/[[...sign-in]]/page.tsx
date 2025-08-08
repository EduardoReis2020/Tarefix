import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-300",
              socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20",
              formButtonPrimary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
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
  )
}
