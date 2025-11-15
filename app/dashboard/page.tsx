'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Key, LogOut, Upload, FileCode, Globe, Github, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Scan {
  id: string
  file_name: string
  scanned_at: string
  total_vulnerabilities: number
  critical_count: number
  high_count: number
  medium_count: number
  low_count: number
  risk_score: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [scans, setScans] = useState<Scan[]>([])
  const [stats, setStats] = useState({
    totalScans: 0,
    totalVulnerabilities: 0,
    criticalIssues: 0,
    averageRisk: 0
  })
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
      await loadScans(user.id)
    }
    setLoading(false)
  }

  const loadScans = async (userId: string) => {
    try {
      console.log('Loading scans for user:', userId)
      
      // Get recent scans
      const { data: scansData, error: scansError } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', userId)
        .order('scanned_at', { ascending: false })
        .limit(10)

      if (scansError) {
        console.error('Error loading scans:', scansError)
        return
      }

      console.log('Scans loaded:', scansData)

      if (!scansData || scansData.length === 0) {
        setScans([])
        return
      }

      // Get file names separately
      const fileIds = scansData.map(scan => scan.file_id).filter(Boolean)
      const { data: filesData, error: filesError } = await supabase
        .from('files')
        .select('id, file_name')
        .in('id', fileIds)

      if (filesError) {
        console.error('Error loading files:', filesError)
      }

      console.log('Files loaded:', filesData)

      // Create a map of file_id to file_name
      const fileMap = new Map()
      filesData?.forEach(file => {
        fileMap.set(file.id, file.file_name)
      })

      // Transform data
      const transformedScans = scansData.map((scan: any) => ({
        id: scan.id,
        file_name: fileMap.get(scan.file_id) || 'Unknown',
        scanned_at: scan.scanned_at,
        total_vulnerabilities: scan.total_vulnerabilities,
        critical_count: scan.critical_count,
        high_count: scan.high_count,
        medium_count: scan.medium_count,
        low_count: scan.low_count,
        risk_score: scan.risk_score
      }))

      setScans(transformedScans)

      // Calculate stats
      const totalScans = transformedScans.length
      const totalVulnerabilities = transformedScans.reduce((sum, s) => sum + s.total_vulnerabilities, 0)
      const criticalIssues = transformedScans.reduce((sum, s) => sum + s.critical_count, 0)
      const averageRisk = totalScans > 0 
        ? Math.round(transformedScans.reduce((sum, s) => sum + s.risk_score, 0) / totalScans)
        : 0

      setStats({
        totalScans,
        totalVulnerabilities,
        criticalIssues,
        averageRisk
      })
    } catch (err) {
      console.error('Error in loadScans:', err)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getRiskColor = (score: number) => {
    if (score >= 100) return 'text-red-400'
    if (score >= 50) return 'text-orange-400'
    if (score >= 20) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 100) return 'Critical Risk'
    if (score >= 50) return 'High Risk'
    if (score >= 20) return 'Medium Risk'
    return 'Low Risk'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#c2d3cd] mb-2">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Developer'}! 👋
          </h1>
          <p className="text-[#afbfc0]">
            {scans.length === 0 
              ? 'Start your first scan to secure your code'
              : 'Here\'s your security overview'
            }
          </p>
        </div>

        {/* Stats Cards */}
        {scans.length > 0 && (
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <div className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-6">
              <div className="text-3xl font-bold text-[#395c6b] mb-1">{stats.totalScans}</div>
              <div className="text-sm text-[#9fa4a9]">Total Scans</div>
            </div>
            <div className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-6">
              <div className="text-3xl font-bold text-orange-400 mb-1">{stats.totalVulnerabilities}</div>
              <div className="text-sm text-[#9fa4a9]">Vulnerabilities Found</div>
            </div>
            <div className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-6">
              <div className="text-3xl font-bold text-red-400 mb-1">{stats.criticalIssues}</div>
              <div className="text-sm text-[#9fa4a9]">Critical Issues</div>
            </div>
            <div className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-6">
              <div className={`text-3xl font-bold mb-1 ${getRiskColor(stats.averageRisk)}`}>
                {stats.averageRisk}
              </div>
              <div className="text-sm text-[#9fa4a9]">Avg Risk Score</div>
            </div>
          </div>
        )}

        {/* Scan Methods */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#c2d3cd] mb-6">
            {scans.length === 0 ? 'Choose a scanning method' : 'Start New Scan'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Upload Code */}
            <Link href="/dashboard/upload">
              <button className="bg-[#2a2b2a] border-2 border-[#395c6b]/30 rounded-xl p-8 hover:border-[#395c6b] transition-all text-left group w-full">
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
            </Link>

            {/* GitHub Repo */}
<Link href="/dashboard/github">
  <button className="bg-[#2a2b2a] border-2 border-[#395c6b]/30 rounded-xl p-8 hover:border-[#395c6b] transition-all text-left group w-full">
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
</Link>

            {/* Website URL */}
            <button className="bg-[#2a2b2a] border-2 border-[#395c6b]/30 rounded-xl p-8 opacity-50 cursor-not-allowed text-left">
              <div className="w-12 h-12 bg-[#395c6b]/20 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-[#395c6b]" />
              </div>
              <h3 className="text-xl font-bold text-[#c2d3cd] mb-2">Website URL</h3>
              <p className="text-[#afbfc0]">
                Analyze live website client-side code
              </p>
              <div className="mt-6 flex items-center gap-2 text-[#9fa4a9] font-semibold">
                <span className="text-xs bg-[#9fa4a9]/20 px-2 py-1 rounded">Coming Soon</span>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#c2d3cd] mb-6">Recent Scans</h2>
          {scans.length === 0 ? (
            <div className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-12 text-center">
              <FileCode className="w-16 h-16 text-[#395c6b]/30 mx-auto mb-4" />
              <p className="text-[#9fa4a9] mb-6">No scans yet. Upload your first file to get started!</p>
              <Link href="/dashboard/upload">
                <button className="bg-[#c2d3cd] hover:bg-[#afbfc0] text-[#2a2b2a] px-6 py-3 rounded-lg font-semibold transition-all">
                  Start Your First Scan
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((scan) => (
                <div key={scan.id} className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-6 hover:border-[#395c6b] transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileCode className="w-5 h-5 text-[#395c6b]" />
                        <h3 className="text-lg font-semibold text-[#c2d3cd]">{scan.file_name}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#9fa4a9] mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(scan.scanned_at)}
                        </span>
                        <span className={getRiskColor(scan.risk_score)}>
                          {getRiskLabel(scan.risk_score)}
                        </span>
                      </div>
                      
                      {/* Vulnerability Badges */}
                      <div className="flex gap-3 flex-wrap">
                        {scan.critical_count > 0 && (
                          <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full">
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                            <span className="text-xs font-semibold text-red-400">{scan.critical_count} Critical</span>
                          </div>
                        )}
                        {scan.high_count > 0 && (
                          <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
                            <span className="text-xs font-semibold text-orange-400">{scan.high_count} High</span>
                          </div>
                        )}
                        {scan.medium_count > 0 && (
                          <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full">
                            <span className="text-xs font-semibold text-yellow-400">{scan.medium_count} Medium</span>
                          </div>
                        )}
                        {scan.low_count > 0 && (
                          <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
                            <span className="text-xs font-semibold text-blue-400">{scan.low_count} Low</span>
                          </div>
                        )}
                        {scan.total_vulnerabilities === 0 && (
                          <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span className="text-xs font-semibold text-green-400">Clean</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Risk Score Circle */}
                    <div className="flex flex-col items-center ml-6">
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                        scan.risk_score >= 100 ? 'border-red-500 bg-red-500/10' :
                        scan.risk_score >= 50 ? 'border-orange-500 bg-orange-500/10' :
                        scan.risk_score >= 20 ? 'border-yellow-500 bg-yellow-500/10' :
                        'border-green-500 bg-green-500/10'
                      }`}>
                        <span className={`text-lg font-bold ${getRiskColor(scan.risk_score)}`}>
                          {scan.risk_score}
                        </span>
                      </div>
                      <span className="text-xs text-[#9fa4a9] mt-1">Risk Score</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}