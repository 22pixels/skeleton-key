'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Key, Upload, FileCode, X, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { scanCode } from '@/lib/scanner'

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [scanResults, setScanResults] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
    setError('')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.js', '.jsx', '.ts', '.tsx', '.py', '.php', '.java', '.c', '.cpp', '.go', '.rb', '.json'],
      'text/html': ['.html'],
      'text/css': ['.css']
    }
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file')
      return
    }

    setUploading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const allScanResults: any[] = []

      // Upload and scan each file
      for (const file of files) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`
        
        // Upload to Supabase
        const { error: uploadError } = await supabase.storage
          .from('code-uploads')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Read file content and scan
        const fileContent = await file.text()
        const scanResult = scanCode(file.name, fileContent)
        allScanResults.push(scanResult)
      }

      setUploading(false)
      setScanning(true)
      setScanResults(allScanResults)
      
      // Show results for 3 seconds then redirect
      setTimeout(() => {
        setUploadComplete(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 20000)
      }, 30000)
      
    } catch (error: any) {
      setError(error.message || 'Failed to upload files')
      setUploading(false)
    }
  }

  const getTotalIssues = () => {
    if (!scanResults) return 0
    return scanResults.reduce((sum: number, result: any) => sum + result.totalIssues, 0)
  }

  const getTotalBySeverity = (severity: string) => {
    if (!scanResults) return 0
    return scanResults.reduce((sum: number, result: any) => {
      return sum + result[`${severity}Count`]
    }, 0)
  }

  return (
    <div className="min-h-screen bg-[#2a2b2a]">
      {/* Top Nav */}
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {uploadComplete ? (
          <div className="text-center py-20">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#c2d3cd] mb-4">
              Scan Complete!
            </h2>
            <p className="text-[#afbfc0] mb-4">
              Found {getTotalIssues()} potential vulnerabilities
            </p>
            <p className="text-sm text-[#9fa4a9]">Redirecting to dashboard...</p>
          </div>
        ) : scanning ? (
          <div className="py-12">
            <h2 className="text-3xl font-bold text-[#c2d3cd] mb-8 text-center">
              Scan Results
            </h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{getTotalBySeverity('critical')}</div>
                <div className="text-sm text-[#9fa4a9]">Critical</div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-400">{getTotalBySeverity('high')}</div>
                <div className="text-sm text-[#9fa4a9]">High</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-yellow-400">{getTotalBySeverity('medium')}</div>
                <div className="text-sm text-[#9fa4a9]">Medium</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">{getTotalBySeverity('low')}</div>
                <div className="text-sm text-[#9fa4a9]">Low</div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-6">
              {scanResults?.map((result: any, fileIndex: number) => (
                <div key={fileIndex} className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#c2d3cd] flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-[#395c6b]" />
                      {result.fileName}
                    </h3>
                    <span className="text-[#9fa4a9]">
                      {result.totalIssues} issues found
                    </span>
                  </div>

                  {result.vulnerabilities.length > 0 ? (
                    <div className="space-y-3">
                      {result.vulnerabilities.map((vuln: any, vulnIndex: number) => (
                        <div
                          key={vulnIndex}
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
                          <p className="text-sm text-[#afbfc0] mb-2">
                            {vuln.pattern.description}
                          </p>
                          <div className="bg-[#2a2b2a] rounded p-2 mb-2">
                            <code className="text-xs text-[#9fa4a9] font-mono">
                              {vuln.code}
                            </code>
                          </div>
                          <p className="text-sm text-[#395c6b]">
                            💡 {vuln.pattern.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                      <p className="text-[#afbfc0]">No vulnerabilities found!</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#c2d3cd] mb-2">
                Upload Code Files
              </h1>
              <p className="text-[#afbfc0]">
                Drag and drop your source code files to scan for vulnerabilities
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-[#395c6b] bg-[#395c6b]/10'
                  : 'border-[#395c6b]/30 hover:border-[#395c6b]/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-16 h-16 text-[#395c6b] mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-xl text-[#c2d3cd] font-semibold">
                  Drop the files here...
                </p>
              ) : (
                <>
                  <p className="text-xl text-[#c2d3cd] font-semibold mb-2">
                    Drag & drop files here
                  </p>
                  <p className="text-[#9fa4a9] mb-4">or click to browse</p>
                  <p className="text-sm text-[#9fa4a9]">
                    Supported: .js, .jsx, .ts, .tsx, .py, .php, .java, .c, .cpp, .go, .rb, .html, .css
                  </p>
                </>
              )}
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-[#c2d3cd] mb-4">
                  Selected Files ({files.length})
                </h3>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <FileCode className="w-5 h-5 text-[#395c6b]" />
                        <div>
                          <p className="text-[#c2d3cd] font-medium">{file.name}</p>
                          <p className="text-sm text-[#9fa4a9]">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full mt-6 bg-[#c2d3cd] hover:bg-[#afbfc0] text-[#2a2b2a] font-semibold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#2a2b2a] border-t-transparent rounded-full animate-spin"></div>
                      Uploading & Scanning...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload & Scan Files
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}