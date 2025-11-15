export interface VulnerabilityPattern {
  name: string
  regex: RegExp
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  recommendation: string
}

export const vulnerabilityPatterns: VulnerabilityPattern[] = [
  // Critical Severity
  {
    name: 'eval() usage',
    regex: /eval\s*\(/gi,
    severity: 'critical',
    description: 'Use of eval() can execute arbitrary code and is a major security risk',
    recommendation: 'Remove eval() and use safer alternatives like JSON.parse() or Function constructor with validation'
  },
  {
    name: 'Hardcoded credentials',
    regex: /(password|api[_-]?key|secret|token)\s*=\s*['"]\w+['"]/gi,
    severity: 'critical',
    description: 'Hardcoded credentials in source code',
    recommendation: 'Move credentials to environment variables or secure key management system'
  },
  {
    name: 'SQL Injection vulnerability',
    regex: /(execute|query)\s*\(\s*['"]\s*SELECT.*\+/gi,
    severity: 'critical',
    description: 'Potential SQL injection through string concatenation',
    recommendation: 'Use parameterized queries or prepared statements'
  },

  // High Severity
  {
    name: 'innerHTML injection',
    regex: /\.innerHTML\s*=/gi,
    severity: 'high',
    description: 'Direct innerHTML assignment can lead to XSS attacks',
    recommendation: 'Use textContent, or sanitize HTML input with DOMPurify'
  },
  {
    name: 'dangerouslySetInnerHTML',
    regex: /dangerouslySetInnerHTML/gi,
    severity: 'high',
    description: 'React dangerouslySetInnerHTML can introduce XSS vulnerabilities',
    recommendation: 'Sanitize HTML content before rendering or avoid using this prop'
  },
  {
    name: 'document.write usage',
    regex: /document\.write\s*\(/gi,
    severity: 'high',
    description: 'document.write can be exploited for XSS attacks',
    recommendation: 'Use modern DOM manipulation methods like createElement and appendChild'
  },
  {
    name: 'Weak cryptography (MD5)',
    regex: /md5\s*\(/gi,
    severity: 'high',
    description: 'MD5 is cryptographically broken and should not be used',
    recommendation: 'Use SHA-256 or bcrypt for hashing'
  },

  // Medium Severity
  {
    name: 'console.log in production',
    regex: /console\.log\s*\(/gi,
    severity: 'medium',
    description: 'Console logs may expose sensitive information in production',
    recommendation: 'Remove console.log statements or use a logging library with levels'
  },
  {
    name: 'alert() usage',
    regex: /alert\s*\(/gi,
    severity: 'medium',
    description: 'alert() can be used in phishing attacks and provides poor UX',
    recommendation: 'Use modern UI notifications or modal dialogs'
  },
  {
    name: 'Insecure random',
    regex: /Math\.random\s*\(/gi,
    severity: 'medium',
    description: 'Math.random() is not cryptographically secure',
    recommendation: 'Use crypto.getRandomValues() for security-sensitive operations'
  },

  // Low Severity
  {
    name: 'TODO/FIXME comments',
    regex: /(TODO|FIXME|HACK|XXX):/gi,
    severity: 'low',
    description: 'Unresolved TODO or FIXME comments may indicate incomplete security measures',
    recommendation: 'Review and complete pending tasks before deployment'
  },
  {
    name: 'Debugger statement',
    regex: /debugger\s*;/gi,
    severity: 'low',
    description: 'Debugger statements should not be in production code',
    recommendation: 'Remove all debugger statements'
  }
]

export interface ScanResult {
  fileName: string
  vulnerabilities: {
    pattern: VulnerabilityPattern
    line: number
    code: string
  }[]
  totalIssues: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
}

export function scanCode(fileName: string, code: string): ScanResult {
  const lines = code.split('\n')
  const vulnerabilities: ScanResult['vulnerabilities'] = []
  
  let criticalCount = 0
  let highCount = 0
  let mediumCount = 0
  let lowCount = 0

  vulnerabilityPatterns.forEach(pattern => {
    lines.forEach((line, index) => {
      if (pattern.regex.test(line)) {
        vulnerabilities.push({
          pattern,
          line: index + 1,
          code: line.trim()
        })

        // Count by severity
        switch (pattern.severity) {
          case 'critical': criticalCount++; break
          case 'high': highCount++; break
          case 'medium': mediumCount++; break
          case 'low': lowCount++; break
        }
      }
    })
  })

  return {
    fileName,
    vulnerabilities,
    totalIssues: vulnerabilities.length,
    criticalCount,
    highCount,
    mediumCount,
    lowCount
  }
}