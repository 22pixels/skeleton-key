import { useState } from 'react';
import { Key, Lock, Shield, Zap, Github, Code, Globe, Chrome } from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');

<<<<<<< HEAD
import { useState } from 'react';
import { Key, Lock, Shield, Zap, Github, Code, Globe, Chrome } from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');

=======
>>>>>>> 28c7ad3b19d33fb951a9fa15f982373c16290197
  return (
    <div className="min-h-screen bg-[#2a2b2a] text-[#c2d3cd]">
      {/* Navigation */}
      <nav className="border-b border-[#395c6b]/30 backdrop-blur-sm fixed w-full z-50 bg-[#2a2b2a]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Key className="w-8 h-8 text-[#395c6b]" />
            <span className="text-2xl font-bold text-[#c2d3cd]">Skeleton Key</span>
          </div>
          <div className="flex gap-6 items-center">
            <a href="#features" className="hover:text-[#9fa4a9] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#9fa4a9] transition-colors">How It Works</a>
            <a href="/login" className="hover:text-[#9fa4a9] transition-colors">Sign In</a>
            <a href="/signup">
              <button className="bg-[#c2d3cd] hover:bg-[#afbfc0] px-6 py-2 rounded-lg font-semibold transition-all text-[#2a2b2a]">
                Get Started
              </button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#395c6b]/20 border border-[#395c6b]/30 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-[#395c6b]" />
              <span className="text-sm text-[#afbfc0]">Automated Security Analysis</span>
            </div>
            
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Unlock Your Code's{' '}
              <span className="text-[#395c6b]">Vulnerabilities</span>
            </h1>
            
            <p className="text-xl text-[#afbfc0] mb-10 leading-relaxed">
              Scan your code, GitHub repos, and live websites for security vulnerabilities and optimization opportunities. Built by a high schooler, for developers who care about security.
            </p>

            <div className="flex gap-4 justify-center mb-12">
<<<<<<< HEAD
              <button className="bg-[#c2d3cd] hover:bg-[#afbfc0] px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-2 text-[#2a2b2a]">
                <Zap className="w-5 h-5" />
                Start Scanning Free
              </button>
              <button className="border-2 border-[#c2d3cd] hover:bg-[#c2d3cd]/10 px-8 py-4 rounded-lg font-semibold text-lg transition-all text-[#c2d3cd]">
                View Demo
              </button>
=======
              <a href="/signup">
                <button className="bg-[#c2d3cd] hover:bg-[#afbfc0] px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-2 text-[#2a2b2a]">
                  <Zap className="w-5 h-5" />
                  Start Scanning Free
                </button>
              </a>
              <a href="#features">
                <button className="border-2 border-[#c2d3cd] hover:bg-[#c2d3cd]/10 px-8 py-4 rounded-lg font-semibold text-lg transition-all text-[#c2d3cd]">
                  View Demo
                </button>
              </a>
>>>>>>> 28c7ad3b19d33fb951a9fa15f982373c16290197
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-[#395c6b]/30">
              <div>
                <div className="text-3xl font-bold text-[#395c6b]">50+</div>
                <div className="text-sm text-[#9fa4a9]">Vulnerability Patterns</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#395c6b]">3</div>
                <div className="text-sm text-[#9fa4a9]">Scan Methods</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#395c6b]">&lt;2min</div>
                <div className="text-sm text-[#9fa4a9]">Average Scan Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-[#2a2b2a]/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Three Ways to <span className="text-[#395c6b]">Scan</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-8 hover:border-[#395c6b] transition-all">
              <div className="w-12 h-12 bg-[#395c6b]/20 rounded-lg flex items-center justify-center mb-6">
                <Code className="w-6 h-6 text-[#395c6b]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Upload Code</h3>
              <p className="text-[#afbfc0] mb-6">
                Drag and drop your source files. We'll analyze them for common vulnerabilities, insecure patterns, and optimization opportunities.
              </p>
              <ul className="space-y-2 text-sm text-[#9fa4a9]">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#395c6b] rounded-full"></div>
                  Supports JS, Python, PHP, Java
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#395c6b] rounded-full"></div>
                  Real-time analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#395c6b] rounded-full"></div>
                  Detailed reports
                </li>
              </ul>
            </div>

            <div className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-8 hover:border-[#395c6b] transition-all">
              <div className="w-12 h-12 bg-[#395c6b]/20 rounded-lg flex items-center justify-center mb-6">
                <Github className="w-6 h-6 text-[#395c6b]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">GitHub Repos</h3>
              <p className="text-[#afbfc0] mb-6">
                Paste any GitHub repository URL. We'll clone it, scan the entire codebase, and provide a comprehensive security audit.
              </p>
              <ul className="space-y-2 text-sm text-[#9fa4a9]">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#395c6b] rounded-full"></div>
                  Public & private repos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#395c6b] rounded-full"></div>
                  Branch-specific scanning
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#395c6b] rounded-full"></div>
                  Dependency checking
                </li>
              </ul>
            </div>

            <div className="bg-[#2a2b2a] border border-[#395c6b]/30 rounded-xl p-8 hover:border-[#395c6b] transition-all">
              <div className="w-12 h-12 bg-[#395c6b]/20 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-[#395c6b]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Live Websites</h3>
              <p className="text-[#afbfc0] mb-6">
                Enter a website URL or use our browser extension. We'll analyze client-side code for XSS, CSRF, and other web vulnerabilities.
              </p>
              <ul className="space-y-2 text-sm text-[#9fa4a9]">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#395c6b] rounded-full"></div>
                  Client-side analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#395c6b] rounded-full"></div>
                  Chrome extension available
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#395c6b] rounded-full"></div>
                  Header security checks
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Browser Extension Callout */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#395c6b]/20 to-[#2a2b2a] border border-[#395c6b]/30 rounded-2xl p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#395c6b]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Chrome className="w-10 h-10 text-[#395c6b]" />
                <h2 className="text-3xl font-bold">Browser Extension</h2>
              </div>
              <p className="text-xl text-[#afbfc0] mb-8 max-w-2xl">
                Install our Chrome extension to scan any webpage you visit. One click security analysis, right in your browser.
              </p>
              <button className="bg-[#c2d3cd] hover:bg-[#afbfc0] px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2 text-[#2a2b2a]">
                <Chrome className="w-5 h-5" />
                Add to Chrome - Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-[#2a2b2a]/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            How It <span className="text-[#395c6b]">Works</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Upload or Link", desc: "Choose your scanning method: upload code, paste GitHub URL, or enter website URL" },
              { num: "02", title: "Analysis", desc: "Our engine scans for 50+ vulnerability patterns, insecure coding practices, and optimization issues" },
              { num: "03", title: "Results", desc: "Get a detailed report with severity ratings, code snippets, and line numbers for each issue" },
              { num: "04", title: "Fix", desc: "Follow our recommendations to patch vulnerabilities and improve code quality" }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-[#395c6b]/20 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-[#afbfc0]">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-[#395c6b]/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Lock className="w-16 h-16 text-[#395c6b] mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Ready to Secure Your Code?
          </h2>
          <p className="text-xl text-[#afbfc0] mb-10">
            Join developers who are building more secure applications with Skeleton Key.
          </p>
          
          <div className="flex gap-4 max-w-md mx-auto mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 bg-[#2a2b2a] border border-[#395c6b]/30 rounded-lg focus:outline-none focus:border-[#395c6b] text-[#c2d3cd]"
            />
<<<<<<< HEAD
            <button className="bg-[#c2d3cd] hover:bg-[#afbfc0] px-8 py-4 rounded-lg font-semibold transition-all whitespace-nowrap text-[#2a2b2a]">
              Get Early Access
            </button>
=======
            <a href="/signup">
              <button className="bg-[#c2d3cd] hover:bg-[#afbfc0] px-8 py-4 rounded-lg font-semibold transition-all whitespace-nowrap text-[#2a2b2a]">
                Get Early Access
              </button>
            </a>
>>>>>>> 28c7ad3b19d33fb951a9fa15f982373c16290197
          </div>
          <p className="text-sm text-[#9fa4a9]">No credit card required. Start scanning in under 2 minutes.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#395c6b]/30 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-6 h-6 text-[#395c6b]" />
                <span className="text-xl font-bold">Skeleton Key</span>
              </div>
              <p className="text-sm text-[#9fa4a9]">
                Built with passion by a high school developer. Making security accessible to everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[#9fa4a9]">
                <li><a href="#" className="hover:text-[#c2d3cd]">Features</a></li>
                <li><a href="#" className="hover:text-[#c2d3cd]">Pricing</a></li>
                <li><a href="#" className="hover:text-[#c2d3cd]">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[#9fa4a9]">
                <li><a href="#" className="hover:text-[#c2d3cd]">About</a></li>
                <li><a href="#" className="hover:text-[#c2d3cd]">Blog</a></li>
                <li><a href="#" className="hover:text-[#c2d3cd]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[#9fa4a9]">
                <li><a href="#" className="hover:text-[#c2d3cd]">Privacy</a></li>
                <li><a href="#" className="hover:text-[#c2d3cd]">Terms</a></li>
                <li><a href="#" className="hover:text-[#c2d3cd]">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#395c6b]/30 pt-8 text-center text-sm text-[#9fa4a9]">
            <p>© 2024 Skeleton Key. Built with determination and caffeine.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
