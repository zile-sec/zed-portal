import Link from "next/link"
import { ArrowRight, Shield, Lock, Key, Eye, FileCheck, AlertTriangle, CheckCircle } from "lucide-react"

export default function SecurityPage() {
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
            Enterprise-Grade <span className="text-[#78ec66]">Security</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-12">
            Our blockchain platform is built with the highest security standards to protect sensitive government data
            and transactions.
          </p>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Comprehensive Security Measures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-6">
                <Shield className="h-10 w-10 text-[#78ec66] mr-4" />
                <h3 className="text-2xl font-semibold">Blockchain Security</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-[#78ec66] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Immutable Ledger</p>
                    <p className="text-gray-600">
                      Once recorded, data cannot be altered or deleted, ensuring a permanent and tamper-proof record.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#78ec66] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Distributed Architecture</p>
                    <p className="text-gray-600">
                      Data is stored across multiple nodes, eliminating single points of failure and increasing
                      resilience.
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
                      Transactions are validated through a secure consensus protocol ensuring only legitimate
                      transactions are recorded.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-6">
                <Lock className="h-10 w-10 text-[#78ec66] mr-4" />
                <h3 className="text-2xl font-semibold">Data Protection</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-[#78ec66] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">End-to-End Encryption</p>
                    <p className="text-gray-600">
                      All data is encrypted in transit and at rest using AES-256 encryption standards.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#78ec66] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Zero-Knowledge Proofs</p>
                    <p className="text-gray-600">
                      Verify transactions without revealing sensitive information, maintaining privacy while ensuring
                      validity.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#78ec66] rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Data Segregation</p>
                    <p className="text-gray-600">
                      Strict isolation of data between departments and users to prevent unauthorized access.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Access Control Section */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Advanced Access Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="mb-4">
                <Key className="h-10 w-10 text-[#78ec66]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Factor Authentication</h3>
              <p className="text-gray-600">
                Secure login process requiring multiple verification methods, including biometrics and hardware tokens.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="mb-4">
                <Eye className="h-10 w-10 text-[#78ec66]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-Based Access Control</h3>
              <p className="text-gray-600">
                Granular permissions based on user roles, ensuring individuals only access information relevant to their
                responsibilities.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="mb-4">
                <FileCheck className="h-10 w-10 text-[#78ec66]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Audit Logging</h3>
              <p className="text-gray-600">
                Comprehensive logging of all system activities with tamper-proof records for accountability and
                compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Compliance & Certifications</h2>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-10 w-10 text-[#78ec66] mr-4" />
              <h3 className="text-2xl font-semibold">International Standards</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-lg mb-2">ISO 27001</p>
                <p className="text-gray-600">
                  Certified for information security management systems, ensuring comprehensive security controls.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-lg mb-2">GDPR Compliant</p>
                <p className="text-gray-600">
                  Fully compliant with General Data Protection Regulation for handling personal data.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-lg mb-2">NIST Cybersecurity Framework</p>
                <p className="text-gray-600">
                  Follows the National Institute of Standards and Technology guidelines for cybersecurity.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-lg mb-2">SOC 2 Type II</p>
                <p className="text-gray-600">
                  Audited for security, availability, processing integrity, confidentiality, and privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#f0fff0] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience our security features firsthand</h2>
          <p className="text-xl mb-10">
            Try our interactive demo to see how we protect sensitive government data and transactions.
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
