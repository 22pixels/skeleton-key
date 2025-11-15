'use client'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      {/* Navigation */}
      <nav className="container mx-auto px-5 py-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <span className="text-3xl">🔑</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Skeleton Key
            </span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-white/90 hover:text-emerald-400 transition font-medium">Features</a>
            <a href="#how-it-works" className="text-white/90 hover:text-emerald-400 transition font-medium">How It Works</a>
            <a href="#extension" className="text-white/90 hover:text-emerald-400 transition font-medium">Extension</a>
            <a href="/login" className="px-7 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-5 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-full mb-6 border border-emerald-500/30">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-white/90 text-sm">Platform Under Development</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          Unlock Every <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">Vulnerability</span>
          <br />Before Hackers Do
        </h1>
        
        <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
          Skeleton Key scans your client-side code for security vulnerabilities and optimization opportunities. 
          Upload files, analyze GitHub repos, or scan live websites—all powered by advanced AI detection.
        </p>
        
        <div className="flex flex-wrap gap-5 justify-center mb-16">
          <a href="/signup" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold text-lg hover:shadow-xl hover:shadow-emerald-500/50 transition hover:-translate-y-1">
            Start Scanning Free
          </a>
          <a href="#extension" className="px-8 py-4 bg-transparent text-white border-2 border-emerald-500 rounded-lg font-semibold text-lg hover:bg-emerald-500 transition">
            Install Extension
          </a>
        </div>
        
        <div className="text-9xl animate-bounce">🔑</div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white rounded-t-3xl py-20">
        <div className="container mx-auto px-5">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-900">
            Unlock Security at Every Level
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-2 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-5">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Upload & Analyze</h3>
              <p className="text-slate-600 leading-relaxed">
                Drag and drop your JavaScript, TypeScript, Python, or Java files for instant vulnerability detection. 
                Support for multiple file formats and batch uploads.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-2 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-5">
                <span className="text-3xl">🐙</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">GitHub Integration</h3>
              <p className="text-slate-600 leading-relaxed">
                Paste any GitHub repository URL to scan entire codebases. Automatically detects client-side 
                vulnerabilities across all supported languages.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-2 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-5">
                <span className="text-3xl">🌐</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Live Website Scanner</h3>
              <p className="text-slate-600 leading-relaxed">
                Enter any website URL to extract and analyze all client-side JavaScript. Perfect for security 
                audits and competitor analysis.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-2 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-5">
                <span className="text-3xl">🧩</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Browser Extension</h3>
              <p className="text-slate-600 leading-relaxed">
                Scan any webpage you visit with one click. Real-time vulnerability detection while browsing. 
                Works on Chrome, Edge, and Brave.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-2 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-5">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">AI-Powered Detection</h3>
              <p className="text-slate-600 leading-relaxed">
                Leveraging transfer learning models and GNNs to detect 100+ vulnerability types with 95%+ accuracy. 
                Constantly improving with new patterns.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-2 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-5">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Code Optimization</h3>
              <p className="text-slate-600 leading-relaxed">
                Beyond security—get actionable recommendations to improve performance, reduce bundle size, 
                and eliminate unused code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-50 py-20">
        <div className="container mx-auto px-5">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-900">
            Unlock Security in 3 Simple Steps
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Upload or Connect</h3>
              <p className="text-slate-600">
                Upload code files, paste a GitHub repo URL, enter a website link, or use our browser extension.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">AI Analysis</h3>
              <p className="text-slate-600">
                Skeleton Key analyzes your code with advanced AI models, detecting vulnerabilities and optimization opportunities.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Get Results</h3>
              <p className="text-slate-600">
                Review detailed findings with severity ratings, code snippets, and fix recommendations. Export or share reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            <div>
              <h3 className="text-5xl font-extrabold text-emerald-500 mb-2">100+</h3>
              <p className="text-slate-300 text-lg">Vulnerability Types</p>
            </div>
            <div>
              <h3 className="text-5xl font-extrabold text-emerald-500 mb-2">95%</h3>
              <p className="text-slate-300 text-lg">Detection Accuracy</p>
            </div>
            <div>
              <h3 className="text-5xl font-extrabold text-emerald-500 mb-2">7</h3>
              <p className="text-slate-300 text-lg">Languages Supported</p>
            </div>
            <div>
              <h3 className="text-5xl font-extrabold text-emerald-500 mb-2">Free</h3>
              <p className="text-slate-300 text-lg">For Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-emerald-600 py-20">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Ready to Unlock Your Code's Security?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join developers who trust Skeleton Key to protect their applications.
          </p>
          <a href="/signup" className="inline-block px-10 py-4 bg-white text-emerald-600 rounded-lg font-bold text-lg hover:shadow-2xl transition hover:-translate-y-1">
            Create Free Account
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-5">
          <div className="flex flex-wrap gap-8 justify-center mb-6">
            <a href="#" className="text-emerald-400 hover:text-emerald-300 transition">About</a>
            <a href="#" className="text-emerald-400 hover:text-emerald-300 transition">Documentation</a>
            <a href="#" className="text-emerald-400 hover:text-emerald-300 transition">Privacy Policy</a>
            <a href="#" className="text-emerald-400 hover:text-emerald-300 transition">Terms of Service</a>
            <a href="#" className="text-emerald-400 hover:text-emerald-300 transition">Contact</a>
          </div>
          <p className="text-slate-400 text-center">
            &copy; 2024 Skeleton Key. Built with passion by a high school developer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}