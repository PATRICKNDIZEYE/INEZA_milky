// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Milk, Eye, EyeOff, Loader2 } from 'lucide-react'
// import { toast } from 'react-hot-toast'

// export default function LoginPage() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//         credentials: 'include', // Ensure cookies are included
//       })

//       const data = await response.json()

//       if (response.ok) {
//         toast.success('Login successful!')
//         router.push('/dashboard')
//       } else {
//         toast.error(data.error || 'Login failed')
//       }
//     } catch (error) {
//       toast.error('An error occurred during login')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center mb-4">
//             <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center">
//               <Milk className="w-8 h-8 text-white" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900">INEZA Dairy</h1>

//         </div>

//         <Card className="shadow-xl">
//           <CardHeader>
//             <CardTitle className="text-center">Login</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email or Username</Label>
//                 <Input
//                   id="email"
//                   type="text"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   placeholder="Enter your email or username"
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? 'text' : 'password'}
//                     value={formData.password}
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     placeholder="Enter your password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               <Button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600">
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Signing in...
//                   </>
//                 ) : (
//                   'Sign In'
//                 )}
//               </Button>
//             </form>

//             <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//               <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
//               <p className="text-xs text-gray-500">Email: admin@dairysystem.com</p>
//               <p className="text-xs text-gray-500">Password: admin123</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Milk, Eye, EyeOff, Loader2, Shield, Building2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // Ensure cookies are included
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Login successful!')
        router.push('/dashboard')
      } else {
        toast.error(data.error || 'Login failed')
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4 relative">
      {/* Background Pattern - Similar to landing page */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.2),transparent_50%)]"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header - Matching landing page style */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Milk className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2 tracking-tight">INEZA DAIRY</h1>
          <p className="text-gray-600 text-base">Management System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6 pt-8 px-8">
            {/* <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div> */}
            <CardTitle className="text-center text-2xl font-bold text-gray-800 mb-2">
              Welcome Back
            </CardTitle>
            <p className="text-center text-gray-600 text-sm">
              Sign in to access your dashboard
            </p>
          </CardHeader>
          <CardContent className="pt-0 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email or Username
                </Label>
                <Input
                  id="email"
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your credentials"
                  required
                  className="h-12 px-4 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-base bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                    className="h-12 px-4 pr-12 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-base bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base shadow-lg transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-blue-800">Demo Access Admin</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-blue-700">Email:</span>
                  <code className="text-sm bg-blue-50 px-2 py-1 rounded text-blue-800 font-mono">admin@dairysystem.com</code>
                </div>
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-blue-700">Password:</span>
                  <code className="text-sm bg-blue-50 px-2 py-1 rounded text-blue-800 font-mono">admin123</code>
                </div>
              </div>
            </div>
            <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-blue-800">Demo Access Operator</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-blue-700">Email:</span>
                  <code className="text-sm bg-blue-50 px-2 py-1 rounded text-blue-800 font-mono">operator@dairysystem.com</code>
                </div>
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-blue-700">Password:</span>
                  <code className="text-sm bg-blue-50 px-2 py-1 rounded text-blue-800 font-mono">operator123</code>
                </div>
              </div>
            </div>
            
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            © 2024 INEZA Dairy Management System
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Secure • Reliable • Professional
          </p>
        </div>
      </div>

      {/* Decorative elements similar to landing page */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-10 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-300 rounded-full opacity-10 blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-20"></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-500 rounded-full opacity-30"></div>
    </div>
  )
}