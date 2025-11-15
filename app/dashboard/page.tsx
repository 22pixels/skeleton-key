'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Key, LogOut, Upload, FileCode, Globe, Github } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2a2b2a] flex items-center justify-center">
        <div className="text-[#c2d3cd]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#2a2b2a]">
      {/* Top Nav */}
      <nav className="border-b border-[#395c6b]/30 bg-[#2a2b2a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Key className="w-8 h-8 text-[#395c6b]" />
            <span className="text-2xl font-bold text-[#c2d3cd]">Skeleton Key</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#afbfc0]">
              {user?.user_metadata?.full_name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-[#395c6b]/30 rounded-lg text-[#c2d3cd] hover:bg-[#395c6b]/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#c2d3cd] mb-2">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Developer'}! 👋
          </h1>
          <p className="text-[#afbfc0]">
            Choose a scanning method to get started
          </p>
        </div>

        {/* Scan Options Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Upload Code */}
          <button className="bg-[#2a2b2a] border-2 border-[#395c6b]/30 rounded-xl p-8 hover:border-[#395c6b] transition-all text-left group">
            <div className="w-12 h-12 bg-[#395c6b]/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#395c6b]/30 transition-all">
              <FileCode className="w-6 h-6 text-[#395c6b]" />
            </div>
            <h3 className="text-xl font-bold text-[#c2d3cd] mb-2">Upload Code</h3>
            <p className="text-[#afbfc0]">
              Drag and drop your source files for analysis
            </p>
            <div className="mt-6 flex items-center gap-2 text-[#395c6b] font-semibold">
              <Upload className="w-4 h-4" />
              <span>Start Upload</span>
            </div>
          </button>

          {/* GitHub Repo */}
          <button className="bg-[#2a2b2a] border-2 border-[#395c6b]/30 rounded-xl p-8 hover:border-[#395c6b] transition-all text-left group">
            <div className="w-12 h-12 bg-[#395c6b]/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#395c6b]/30 transition-all">
              <Github className="w-6 h-6 text-[#395c6b]" />
            </div>
            <h3 className="text-xl font-bold text-[#c2d3cd] mb-2">GitHub Repo</h3>
            <p className="text-[#afbfc0]">
              Scan an entire repository by URL
            </p>
            <div className="mt-6 flex items-center gap-2 text-[#395c6b] font-semibold">
              <Github className="w-4 h-4" />
              <span>Enter URL</span>
            </div>
          </button>

          {/* Website URL */}
          <button className="bg-[#2a2b2a] border-2 border-[#395c6b]/30 rounded-xl p-8 hover:border-[#395c6b] transition-all text-left group">
            <div className="w-12 h-12 bg-[#395c6b]/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#395c6b]/30 transition-all">
              <Globe className="w-6 h-6 text-[#395c6b]" />
            </div>
            <h3 className="text-xl font-bold text-[#c2d3cd] mb-2">Website URL</h3>
            <p className="text-[#afbfc0]">
              Analyze live website client-side code
            </p>
            <div className="mt-6 flex items-center gap-2 text-[#395c6b] font-semibold">
              <Globe className="w-4 h-4" />
              <span>Scan Website</span>
            </div>
          </button>
        </div>

        {/* Recent Scans - Coming Soon */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#c2d3cd] mb-6">Recent Scans</h2>
          <div className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-12 text-center">
            <p className="text-[#9fa4a9]">No scans yet. Upload your first file to get started!</p>
          </div>
        </div>
      </div>
    </div>
  )
}