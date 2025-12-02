import Link from "next/link"
import { ArrowRight, Shield, Cpu, BarChart3, Lock } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#daffcc] flex flex-col">
      {/* Navigation Bar */}
      <div className="w-full px-4">
        <nav className="max-w-6xl mx-auto bg-white rounded-full py-3 px-8 flex items-center justify-between mt-6">
          <div className="flex items-center space-x-12">
            <Link href="/" className="text-black relative group">
              <span className="transition-colors duration-300 ease-in-out group-hover:text-black/70">home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#78ec66] transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
            <Link href="/features" className="text-black relative group">
              <span className="transition-colors duration-300 ease-in-out group-hover:text-black/70">features</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#78ec66] transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
            <Link href="/security" className="text-black relative group">
              <span className="transition-colors duration-300 ease-in-out group-hover:text-black/70">security</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#78ec66] transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
            <Link href="/overview" className="text-black relative group">
              <span className="transition-colors duration-300 ease-in-out group-hover:text-black/70">overview</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#78ec66] transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
          </div>
          <Link
            href="/login"
            className="bg-[#78ec66] text-black px-6 py-2 rounded-full transition-all duration-300 ease-in-out hover:bg-[#5ee849] hover:shadow-md hover:scale-105"
          >
            DEMO
          </Link>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Zambia Digital <span className="text-[#78ec66]">Blockchain</span> Portal
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
            Secure, transparent, and efficient government transactions powered by blockchain technology
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/login"
              className="bg-[#78ec66] text-black px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 ease-in-out hover:bg-[#5ee849] hover:shadow-lg hover:scale-105 flex items-center justify-center"
            >
              DEMO <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/features"
              className="bg-white text-black px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 ease-in-out hover:bg-gray-100 hover:shadow-lg hover:scale-105 flex items-center justify-center"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-[#78ec66]" />}
              title="Enhanced Security"
              description="Military-grade encryption and blockchain verification for all government transactions"
            />
            <FeatureCard
              icon={<Cpu className="h-10 w-10 text-[#78ec66]" />}
              title="Smart Contracts"
              description="Automated execution of agreements with transparent terms and conditions"
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-[#78ec66]" />}
              title="Real-time Analytics"
              description="Comprehensive dashboards for monitoring government spending and activities"
            />
            <FeatureCard
              icon={<Lock className="h-10 w-10 text-[#78ec66]" />}
              title="Immutable Records"
              description="Tamper-proof documentation of all transactions and approvals"
            />
          </div>
          <div className="text-center mt-12">
            <Link
              href="/features"
              className="inline-flex items-center text-[#78ec66] font-medium hover:text-[#5ee849] transition-colors"
            >
              View all features <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#f0fff0] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to experience the future of government services?
          </h2>
          <p className="text-xl mb-10">
            Join the digital transformation of Zambia's government infrastructure with blockchain technology.
          </p>
          <Link
            href="/login"
            className="bg-[#78ec66] text-black px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 ease-in-out hover:bg-[#5ee849] hover:shadow-lg hover:scale-105 inline-flex items-center"
          >
            Try the DEMO <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-[#78ec66] rounded-full mr-2"></div>
                <span className="font-bold text-xl">Zambia Digital Portal</span>
              </div>
              <p className="text-gray-600 mt-2">Secure Government Blockchain Infrastructure</p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <h3 className="font-medium mb-3">Platform</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/features" className="text-gray-600 hover:text-[#78ec66]">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/security" className="text-gray-600 hover:text-[#78ec66]">
                      Security
                    </Link>
                  </li>
                  <li>
                    <Link href="/overview" className="text-gray-600 hover:text-[#78ec66]">
                      Overview
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-[#78ec66]">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-[#78ec66]">
                      API
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-[#78ec66]">
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-[#78ec66]">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-[#78ec66]">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-[#78ec66]">
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-gray-600">© 2023 Zambia Digital Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
