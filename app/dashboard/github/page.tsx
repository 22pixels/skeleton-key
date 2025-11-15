'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Key, Github, AlertCircle, CheckCircle, FileCode, Loader } from 'lucide-react'
import Link from 'next/link'
import { scanCode } from '@/lib/scanner'

interface RepoFile {
  name: string
  path: string
  content: string
}

export default function GitHubScanPage() {
  const [repoUrl, setRepoUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [scanResults, setScanResults] = useState<any>(null)
  const [progress, setProgress] = useState('')
  const router = useRouter()

  const parseGitHubUrl = (url: string) => {
    // Handle various GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/,
      /^([^\/]+)\/([^\/]+)$/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace('.git', '')
        }
      }
    }
    return null
  }

  const fetchRepoFiles = async (owner: string, repo: string): Promise<RepoFile[]> => {
    setProgress('Fetching repository structure...')
    
    // Get default branch
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
    if (!repoResponse.ok) {
      throw new Error('Repository not found or not accessible')
    }
    const repoData = await repoResponse.json()
    const defaultBranch = repoData.default_branch

    setProgress('Loading file tree...')

    // Get repository tree
    const treeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`
    )
    if (!treeResponse.ok) {
      throw new Error('Failed to fetch repository tree')
    }
    const treeData = await treeResponse.json()

    // Filter for code files only
    const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.php', '.java', '.c', '.cpp', '.go', '.rb']
    const codeFiles = treeData.tree.filter((item: any) => 
      item.type === 'blob' && 
      codeExtensions.some(ext => item.path.endsWith(ext)) &&
      !item.path.includes('node_modules') &&
      !item.path.includes('dist') &&
      !item.path.includes('build')
    ).slice(0, 20) // Limit to 20 files for MVP

    setProgress(`Found ${codeFiles.length} code files. Downloading...`)

    // Fetch content for each file
    const files: RepoFile[] = []
    for (let i = 0; i < codeFiles.length; i++) {
      const file = codeFiles[i]
      setProgress(`Downloading ${i + 1}/${codeFiles.length}: ${file.path}`)
      
      try {
        const contentResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}?ref=${defaultBranch}`
        )
        
        if (contentResponse.ok) {
          const contentData = await contentResponse.json()
          if (contentData.content) {
            // GitHub API returns base64 encoded content
            const content = atob(contentData.content)
            files.push({
              name: file.path.split('/').pop() || file.path,
              path: file.path,
              content
            })
          }
        }
      } catch (err) {
        console.error(`Failed to fetch ${file.path}:`, err)
      }
    }

    return files
  }

  const calculateRiskScore = (critical: number, high: number, medium: number, low: number): number => {
    return (critical * 40) + (high * 20) + (medium * 10) + (low * 5)
  }

  const handleScan = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL')
      return
    }

    setScanning(true)
    setError('')
    setProgress('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const parsedUrl = parseGitHubUrl(repoUrl)
      if (!parsedUrl) {
        throw new Error('Invalid GitHub URL. Use format: github.com/owner/repo or owner/repo')
      }

      const { owner, repo } = parsedUrl
      setProgress(`Scanning ${owner}/${repo}...`)

      // Fetch repository files
      const files = await fetchRepoFiles(owner, repo)
      
      if (files.length === 0) {
        throw new Error('No code files found in repository')
      }

      setProgress(`Analyzing ${files.length} files for vulnerabilities...`)

      // Scan all files
      const allScanResults: any[] = []
      let totalCritical = 0, totalHigh = 0, totalMedium = 0, totalLow = 0, totalIssues = 0

      for (const file of files) {
        const scanResult = scanCode(file.name, file.content)
        if (scanResult.totalIssues > 0) {
          allScanResults.push({ ...scanResult, path: file.path })
        }
        totalCritical += scanResult.criticalCount
        totalHigh += scanResult.highCount
        totalMedium += scanResult.mediumCount
        totalLow += scanResult.lowCount
        totalIssues += scanResult.totalIssues
      }

      // Save to database
      setProgress('Saving scan results...')

      const { data: fileRecord, error: fileError } = await supabase
        .from('files')
        .insert({
          user_id: user.id,
          file_name: `${owner}/${repo}`,
          file_size: files.length,
          storage_path: `github:${owner}/${repo}`
        })
        .select()
        .single()

      if (fileError) throw fileError

      const riskScore = calculateRiskScore(totalCritical, totalHigh, totalMedium, totalLow)

      const { data: scanRecord, error: scanError } = await supabase
        .from('scans')
        .insert({
          file_id: fileRecord.id,
          user_id: user.id,
          status: 'complete',
          total_vulnerabilities: totalIssues,
          critical_count: totalCritical,
          high_count: totalHigh,
          medium_count: totalMedium,
          low_count: totalLow,
          risk_score: riskScore
        })
        .select()
        .single()

      if (scanError) throw scanError

      // Save all vulnerabilities
      const allVulnerabilities = allScanResults.flatMap(result => 
        result.vulnerabilities.map((vuln: any) => ({
          scan_id: scanRecord.id,
          name: vuln.pattern.name,
          severity: vuln.pattern.severity,
          line_number: vuln.line,
          code_snippet: `${result.path}: ${vuln.code}`,
          description: vuln.pattern.description,
          recommendation: vuln.pattern.recommendation
        }))
      )

      if (allVulnerabilities.length > 0) {
        const { error: vulnError } = await supabase
          .from('vulnerabilities')
          .insert(allVulnerabilities)

        if (vulnError) throw vulnError
      }

      setScanResults({
        repoName: `${owner}/${repo}`,
        filesScanned: files.length,
        results: allScanResults,
        totalIssues,
        criticalCount: totalCritical,
        highCount: totalHigh,
        mediumCount: totalMedium,
        lowCount: totalLow
      })

      setProgress('')
      
    } catch (error: any) {
      console.error('Scan error:', error)
      setError(error.message || 'Failed to scan repository')
      setScanning(false)
      setProgress('')
    }
  }

  return (
    <div className="min-h-screen bg-[#2a2b2a]">
      <nav className="border-b border-[#395c6b]/30 bg-[#2a2b2a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Key className="w-8 h-8 text-[#395c6b]" />
            <span className="text-2xl font-bold text-[#c2d3cd]">Skeleton Key</span>
          </Link>
          <Link href="/dashboard">
            <button className="text-[#afbfc0] hover:text-[#c2d3cd] transition-colors">
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {scanResults ? (
          <div className="py-12">
            <div className="text-center mb-8">
              <Github className="w-16 h-16 text-[#395c6b] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-[#c2d3cd] mb-2">
                Scan Complete: {scanResults.repoName}
              </h2>
              <p className="text-[#afbfc0]">
                Scanned {scanResults.filesScanned} files, found {scanResults.totalIssues} vulnerabilities
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{scanResults.criticalCount}</div>
                <div className="text-sm text-[#9fa4a9]">Critical</div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-400">{scanResults.highCount}</div>
                <div className="text-sm text-[#9fa4a9]">High</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-yellow-400">{scanResults.mediumCount}</div>
                <div className="text-sm text-[#9fa4a9]">Medium</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">{scanResults.lowCount}</div>
                <div className="text-sm text-[#9fa4a9]">Low</div>
              </div>
            </div>

            <div className="space-y-6">
              {scanResults.results.map((result: any, idx: number) => (
                <div key={idx} className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#c2d3cd] flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-[#395c6b]" />
                      {result.path}
                    </h3>
                    <span className="text-[#9fa4a9]">{result.totalIssues} issues</span>
                  </div>

                  <div className="space-y-3">
                    {result.vulnerabilities.map((vuln: any, vIdx: number) => (
                      <div
                        key={vIdx}
                        className={`border-l-4 pl-4 py-2 ${
                          vuln.pattern.severity === 'critical' ? 'border-red-500 bg-red-500/5' :
                          vuln.pattern.severity === 'high' ? 'border-orange-500 bg-orange-500/5' :
                          vuln.pattern.severity === 'medium' ? 'border-yellow-500 bg-yellow-500/5' :
                          'border-blue-500 bg-blue-500/5'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                              vuln.pattern.severity === 'critical' ? 'bg-red-500 text-white' :
                              vuln.pattern.severity === 'high' ? 'bg-orange-500 text-white' :
                              vuln.pattern.severity === 'medium' ? 'bg-yellow-500 text-black' :
                              'bg-blue-500 text-white'
                            }`}>
                              {vuln.pattern.severity}
                            </span>
                            <span className="ml-3 text-[#c2d3cd] font-semibold">
                              {vuln.pattern.name}
                            </span>
                          </div>
                          <span className="text-sm text-[#9fa4a9]">Line {vuln.line}</span>
                        </div>
                        <p className="text-sm text-[#afbfc0] mb-2">{vuln.pattern.description}</p>
                        <div className="bg-[#2a2b2a] rounded p-2 mb-2">
                          <code className="text-xs text-[#9fa4a9] font-mono">{vuln.code}</code>
                        </div>
                        <p className="text-sm text-[#395c6b]">💡 {vuln.pattern.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/dashboard">
                <button className="bg-[#c2d3cd] hover:bg-[#afbfc0] text-[#2a2b2a] px-8 py-3 rounded-lg font-semibold transition-all">
                  ← Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <Github className="w-16 h-16 text-[#395c6b] mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-[#c2d3cd] mb-2">
                Scan GitHub Repository
              </h1>
              <p className="text-[#afbfc0]">
                Enter a GitHub repository URL to scan for vulnerabilities
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-8">
              <label className="block text-sm font-semibold text-[#c2d3cd] mb-3">
                Repository URL
              </label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                disabled={scanning}
                className="w-full px-4 py-3 bg-[#2a2b2a] border border-[#395c6b]/30 rounded-lg focus:outline-none focus:border-[#395c6b] text-[#c2d3cd] placeholder-[#9fa4a9] mb-6 disabled:opacity-50"
              />

              <div className="bg-[#395c6b]/10 border border-[#395c6b]/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-[#afbfc0] mb-2">
                  <strong>Supported formats:</strong>
                </p>
                <ul className="text-sm text-[#9fa4a9] space-y-1">
                  <li>• https://github.com/owner/repo</li>
                  <li>• github.com/owner/repo</li>
                  <li>• owner/repo</li>
                </ul>
              </div>

              {progress && (
                <div className="bg-[#395c6b]/10 border border-[#395c6b]/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Loader className="w-5 h-5 text-[#395c6b] animate-spin" />
                    <p className="text-sm text-[#afbfc0]">{progress}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleScan}
                disabled={scanning || !repoUrl.trim()}
                className="w-full bg-[#c2d3cd] hover:bg-[#afbfc0] text-[#2a2b2a] font-semibold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {scanning ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Scanning Repository...
                  </>
                ) : (
                  <>
                    <Github className="w-5 h-5" />
                    Scan Repository
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 bg-[#395c6b]/10 border border-[#395c6b]/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#c2d3cd] mb-3">How it works:</h3>
              <ul className="space-y-2 text-sm text-[#afbfc0]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#395c6b] mt-0.5 flex-shrink-0" />
                  <span>Fetches up to 20 code files from the repository</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#395c6b] mt-0.5 flex-shrink-0" />
                  <span>Analyzes JavaScript, TypeScript, Python, PHP, Java, C/C++, Go, and Ruby files</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#395c6b] mt-0.5 flex-shrink-0" />
                  <span>Scans for common vulnerabilities and security issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#395c6b] mt-0.5 flex-shrink-0" />
                  <span>Provides detailed recommendations for fixing issues</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}