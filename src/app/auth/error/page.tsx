import Link from 'next/link'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <AuthLayout
      title="Authentication Error"
      subtitle="Something went wrong during authentication"
    >
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
        <div className="text-sm text-red-700">
          <p className="font-medium">Authentication failed</p>
          <p className="mt-1">
            There was an error confirming your account. The link may have expired or already been used.
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <Link
          href="/sign-in"
          className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-center block"
        >
          Try Logging In
        </Link>
        
        <Link
          href="/sign-up"
          className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
        >
          Create New Account
        </Link>
      </div>
    </AuthLayout>
  )
}