import Link from "next/link"
import {
  ArrowRight,
  Shield,
  Cpu,
  BarChart3,
  Lock,
  FileText,
  Clock,
  CheckCircle,
  Users,
  Globe,
  Database,
  Zap,
} from "lucide-react"

export default function FeaturesPage() {
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
      <div className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for <span className="text-[#78ec66]">Modern Governance</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-12">
            Explore the comprehensive suite of features designed to transform government operations with blockchain
            technology.
          </p>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-[#78ec66]" />}
              title="Enhanced Security"
              description="Military-grade encryption and blockchain verification for all government transactions, ensuring data integrity and protection."
            />
            <FeatureCard
              icon={<Cpu className="h-10 w-10 text-[#78ec66]" />}
              title="Smart Contracts"
              description="Automated execution of agreements with transparent terms and conditions, reducing bureaucracy and increasing efficiency."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-[#78ec66]" />}
              title="Real-time Analytics"
              description="Comprehensive dashboards for monitoring government spending and activities with detailed insights and reporting."
            />
            <FeatureCard
              icon={<Lock className="h-10 w-10 text-[#78ec66]" />}
              title="Immutable Records"
              description="Tamper-proof documentation of all transactions and approvals, creating a permanent and verifiable audit trail."
            />
            <FeatureCard
              icon={<FileText className="h-10 w-10 text-[#78ec66]" />}
              title="Document Management"
              description="Secure storage and retrieval of government documents with version control and access permissions."
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-[#78ec66]" />}
              title="Transaction Tracking"
              description="Real-time monitoring of transaction status from initiation to completion with detailed timeline views."
            />
            <FeatureCard
              icon={<CheckCircle className="h-10 w-10 text-[#78ec66]" />}
              title="Multi-level Approvals"
              description="Configurable approval workflows with role-based permissions and digital signatures for authentication."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-[#78ec66]" />}
              title="User Management"
              description="Comprehensive user administration with role-based access control and detailed activity logging."
            />
            <FeatureCard
              icon={<Globe className="h-10 w-10 text-[#78ec66]" />}
              title="Cross-Department Integration"
              description="Seamless collaboration between government departments with unified data access and sharing capabilities."
            />
          </div>
        </div>
      </div>

      {/* Technical Features */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Technical Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <Database className="h-6 w-6 text-[#78ec66] mr-2" /> Blockchain Infrastructure
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-[#78ec66] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Distributed Ledger Technology</p>
                    <p className="text-gray-600">
                      Decentralized record-keeping across multiple nodes for enhanced security and reliability.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#78ec66] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Consensus Mechanism</p>
                    <p className="text-gray-600">
                      Efficient validation of transactions through a proof-of-authority consensus model.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#78ec66] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Cryptographic Security</p>
                    <p className="text-gray-600">
                      Advanced encryption for all data with digital signatures for verification.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <Zap className="h-6 w-6 text-[#78ec66] mr-2" /> System Performance
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-[#78ec66] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">High Throughput</p>
                    <p className="text-gray-600">
                      Capable of processing thousands of transactions per second to meet government demands.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#78ec66] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Low Latency</p>
                    <p className="text-gray-600">
                      Minimal processing delays for real-time transaction confirmation and updates.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#78ec66] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Scalability</p>
                    <p className="text-gray-600">Designed to grow with increasing transaction volumes and user base.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#f0fff0] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to experience these features?</h2>
          <p className="text-xl mb-10">
            Try our interactive demo to see how blockchain technology can transform government operations.
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
    <div className="bg-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
