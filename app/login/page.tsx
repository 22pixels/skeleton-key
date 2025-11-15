'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Key, Mail, Lock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#2a2b2a] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Key className="w-10 h-10 text-[#395c6b]" />
            <span className="text-3xl font-bold text-[#c2d3cd]">Skeleton Key</span>
          </div>
          <p className="text-[#afbfc0]">Welcome back! Sign in to your account</p>
        </div>

        <div className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#c2d3cd] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9fa4a9]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-[#2a2b2a] border border-[#395c6b]/30 rounded-lg focus:outline-none focus:border-[#395c6b] text-[#c2d3cd] placeholder-[#9fa4a9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#c2d3cd] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9fa4a9]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-[#2a2b2a] border border-[#395c6b]/30 rounded-lg focus:outline-none focus:border-[#395c6b] text-[#c2d3cd] placeholder-[#9fa4a9]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c2d3cd] hover:bg-[#afbfc0] text-[#2a2b2a] font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#395c6b]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#2a2b2a] text-[#9fa4a9]">
                Don't have an account?
              </span>
            </div>
          </div>

          <Link href="/signup">
            <button className="w-full border-2 border-[#c2d3cd] hover:bg-[#c2d3cd]/10 text-[#c2d3cd] font-semibold py-3 rounded-lg transition-all">
              Create Account
            </button>
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-[#9fa4a9] hover:text-[#c2d3cd]">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}