"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  Users,
  DollarSign,
  Shield,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Search,
  ZoomIn,
  ZoomOut,
  Stamp,
  AlertCircle,
  CheckCircle2,
  Clock3,
} from "lucide-react"

export default function OverviewPage() {
  return (
    <main className="min-h-screen bg-[#daffcc] flex flex-col">
      {/* Navigation Bar */}
      <div className="w-full px-4">
        <nav className="max-w-6xl mx-auto bg-white rounded-full py-3 px-8 flex items-center justify-between mt-6">
          <div className="flex items-center space-x-12">
            <Link href="/" className="text-black relative group">
              <span className="transition-colors duration-300 ease-in-out group-hover:text-black/70 uppercase font-medium">
                HOME
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#78ec66] transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
            <Link href="/features" className="text-black relative group">
              <span className="transition-colors duration-300 ease-in-out group-hover:text-black/70 uppercase font-medium">
                FEATURES
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#78ec66] transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
            <Link href="/security" className="text-black relative group">
              <span className="transition-colors duration-300 ease-in-out group-hover:text-black/70 uppercase font-medium">
                SECURITY
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#78ec66] transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
            <Link href="/overview" className="text-black relative group">
              <span className="transition-colors duration-300 ease-in-out group-hover:text-black/70 uppercase font-medium">
                OVERVIEW
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#78ec66] transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
          </div>
          <Link
            href="/login"
            className="bg-[#78ec66] text-black px-6 py-2 rounded-full transition-all duration-300 ease-in-out hover:bg-[#5ee849] hover:shadow-md hover:scale-105 uppercase font-medium"
          >
            DEMO
          </Link>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Platform <span className="text-[#78ec66]">Overview</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-12">
            A comprehensive look at how our blockchain platform transforms government operations and services.
          </p>
        </div>
      </div>

      {/* Transaction Flow Document Preview Section */}
      <div className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <TransactionFlowDocumentPreview />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#78ec66] transform md:-translate-x-1/2"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              <TimelineItem
                title="Transaction Initiation"
                description="Government officials create and submit transactions through a secure interface with proper documentation."
                icon={<FileText className="h-6 w-6 text-white" />}
                isLeft={true}
              />
              <TimelineItem
                title="Multi-level Verification"
                description="Transactions undergo verification by authorized personnel based on predefined approval workflows."
                icon={<CheckCircle className="h-6 w-6 text-white" />}
                isLeft={false}
              />
              <TimelineItem
                title="Blockchain Recording"
                description="Verified transactions are recorded on the blockchain with cryptographic signatures and timestamps."
                icon={<Shield className="h-6 w-6 text-white" />}
                isLeft={true}
              />
              <TimelineItem
                title="Real-time Monitoring"
                description="Stakeholders can track transaction status and history through comprehensive dashboards."
                icon={<BarChart3 className="h-6 w-6 text-white" />}
                isLeft={false}
              />
              <TimelineItem
                title="Automated Execution"
                description="Smart contracts automatically execute predefined actions when conditions are met, reducing manual intervention."
                icon={<Clock className="h-6 w-6 text-white" />}
                isLeft={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Shield className="h-10 w-10 text-[#78ec66]" />}
              title="Enhanced Security"
              description="Military-grade encryption and immutable records protect sensitive government data from tampering and unauthorized access."
            />
            <BenefitCard
              icon={<Clock className="h-10 w-10 text-[#78ec66]" />}
              title="Increased Efficiency"
              description="Automated workflows and smart contracts reduce processing times from days to minutes, eliminating bureaucratic delays."
            />
            <BenefitCard
              icon={<CheckCircle className="h-10 w-10 text-[#78ec66]" />}
              title="Enhanced Transparency"
              description="All transactions are permanently recorded and easily auditable, promoting accountability in government operations."
            />
            <BenefitCard
              icon={<DollarSign className="h-10 w-10 text-[#78ec66]" />}
              title="Cost Reduction"
              description="Streamlined processes and reduced paperwork lead to significant cost savings in administrative overhead."
            />
            <BenefitCard
              icon={<Users className="h-10 w-10 text-[#78ec66]" />}
              title="Improved Collaboration"
              description="Secure information sharing between departments enhances coordination and decision-making across government agencies."
            />
            <BenefitCard
              icon={<BarChart3 className="h-10 w-10 text-[#78ec66]" />}
              title="Data-Driven Governance"
              description="Comprehensive analytics provide insights for better resource allocation and policy development."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#f0fff0] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform government operations?</h2>
          <p className="text-xl mb-10">Experience our blockchain platform through an interactive demo.</p>
          <Link
            href="/login"
            className="bg-[#78ec66] text-black px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 ease-in-out hover:bg-[#5ee849] hover:shadow-lg hover:scale-105 inline-flex items-center uppercase"
          >
            TRY THE DEMO <ArrowRight className="ml-2 h-5 w-5" />
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
                <h3 className="font-medium mb-3 uppercase">Platform</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/features" className="text-gray-600 hover:text-[#78ec66]">
                      FEATURES
                    </Link>
                  </li>
                  <li>
                    <Link href="/security" className="text-gray-600 hover:text-[#78ec66]">
                      SECURITY
                    </Link>
                  </li>
                  <li>
                    <Link href="/overview" className="text-gray-600 hover:text-[#78ec66]">
                      OVERVIEW
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3 uppercase">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-[#78ec66]">
                      DOCUMENTATION
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-[#78ec66]">
                      API
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-[#78ec66]">
                      SUPPORT
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3 uppercase">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-[#78ec66]">
                      ABOUT
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-[#78ec66]">
                      CONTACT
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-[#78ec66]">
                      PRIVACY
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

// Transaction Flow Document Preview Component
function TransactionFlowDocumentPreview() {
  const [activeStage, setActiveStage] = useState(0)

  const stages = [
    {
      id: 0,
      name: "Initiation",
      ministry: "Ministry of Finance",
      status: "Draft",
      icon: <FileText className="h-5 w-5 text-white" />,
      description: "Budget allocation request created and submitted",
      date: "2023-06-15",
      statusColor: "bg-yellow-500",
    },
    {
      id: 1,
      name: "Primary Validation",
      ministry: "Ministry of Planning",
      status: "Under Review",
      icon: <BarChart3 className="h-5 w-5 text-white" />,
      description: "Validating alignment with national development plans",
      date: "2023-06-16",
      statusColor: "bg-blue-500",
    },
    {
      id: 2,
      name: "Legal Validation",
      ministry: "Ministry of Legal Affairs",
      status: "Under Review",
      icon: <FileText className="h-5 w-5 text-white" />,
      description: "Ensuring compliance with legal frameworks",
      date: "2023-06-17",
      statusColor: "bg-blue-500",
    },
    {
      id: 3,
      name: "Technical Validation",
      ministry: "Ministry of Digital Governance",
      status: "Under Review",
      icon: <Shield className="h-5 w-5 text-white" />,
      description: "Verifying technical aspects and system compliance",
      date: "2023-06-18",
      statusColor: "bg-blue-500",
    },
    {
      id: 4,
      name: "Final Approval",
      ministry: "Office of the President",
      status: "Approved",
      icon: <CheckCircle className="h-5 w-5 text-white" />,
      description: "Final executive approval granted",
      date: "2023-06-20",
      statusColor: "bg-green-500",
    },
    {
      id: 5,
      name: "Blockchain Recording",
      ministry: "Blockchain Ledger",
      status: "Recorded",
      icon: <Shield className="h-5 w-5 text-white" />,
      description: "Transaction permanently recorded on blockchain",
      date: "2023-06-20",
      statusColor: "bg-green-500",
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <h2 className="text-2xl font-bold text-center py-6 border-b">Transaction Flow & Document Preview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 min-h-[800px]">
        {/* Left Panel - Transaction Flow */}
        <div className="border-r">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-semibold text-lg">Transaction Stages</h3>
            <p className="text-sm text-gray-600">
              Follow a budget allocation request as it moves through the approval process
            </p>
          </div>

          <div className="overflow-y-auto max-h-[700px]">
            <div className="p-4 space-y-1">
              {stages.map((stage, index) => (
                <div key={stage.id} className="relative">
                  {/* Vertical line connecting stages */}
                  {index < stages.length - 1 && (
                    <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gray-200 z-0"></div>
                  )}

                  <button
                    onClick={() => setActiveStage(stage.id)}
                    className={`relative z-10 flex items-start w-full text-left p-3 rounded-lg transition-all ${
                      activeStage === stage.id ? "bg-[#f0fff0] border-[#78ec66] border" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`${stage.statusColor} rounded-full p-2 mr-3 flex-shrink-0`}>{stage.icon}</div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{stage.name}</h4>
                      <p className="text-sm text-gray-600">{stage.ministry}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-block w-2 h-2 rounded-full ${stage.statusColor} mr-1`}></span>
                        <span className="text-xs">{stage.status}</span>
                        <span className="text-xs text-gray-500 ml-auto">{stage.date}</span>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Document Preview */}
        <div className="col-span-2 flex flex-col">
          {/* Document Toolbar */}
          <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b">
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md hover:bg-gray-200">
                <ZoomIn className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-200">
                <ZoomOut className="h-5 w-5 text-gray-600" />
              </button>
              <div className="h-6 border-r border-gray-300 mx-1"></div>
              <button className="p-2 rounded-md hover:bg-gray-200">
                <Download className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-200">
                <Printer className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-3">
                Stage {activeStage + 1} of {stages.length}
              </span>
              <button
                className="p-2 rounded-md hover:bg-gray-200"
                onClick={() => setActiveStage(Math.max(0, activeStage - 1))}
                disabled={activeStage === 0}
              >
                <ChevronLeft className={`h-5 w-5 ${activeStage === 0 ? "text-gray-300" : "text-gray-600"}`} />
              </button>
              <button
                className="p-2 rounded-md hover:bg-gray-200"
                onClick={() => setActiveStage(Math.min(stages.length - 1, activeStage + 1))}
                disabled={activeStage === stages.length - 1}
              >
                <ChevronRight
                  className={`h-5 w-5 ${activeStage === stages.length - 1 ? "text-gray-300" : "text-gray-600"}`}
                />
              </button>
            </div>
          </div>

          {/* Document Content */}
          <div className="p-6 flex-grow overflow-y-auto">
            <div className="max-w-3xl mx-auto bg-white p-8 border border-gray-200 shadow-sm">
              {/* Document Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 bg-[#78ec66] rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">GOVERNMENT OF ZAMBIA</h2>
                <h3 className="text-xl font-semibold text-[#78ec66] mb-1">BUDGET ALLOCATION REQUEST</h3>
                <p className="text-gray-500">Reference: ZM-FIN-2023-06-15-001</p>
              </div>

              {/* Document Status Banner */}
              <div
                className={`${
                  activeStage === 0
                    ? "bg-yellow-100 border-yellow-300"
                    : activeStage >= 1 && activeStage <= 3
                      ? "bg-blue-100 border-blue-300"
                      : "bg-green-100 border-green-300"
                } border rounded-md p-3 mb-6 flex items-center justify-between`}
              >
                <div className="flex items-center">
                  {activeStage === 0 ? (
                    <Clock3 className="h-5 w-5 text-yellow-600 mr-2" />
                  ) : activeStage >= 1 && activeStage <= 3 ? (
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                  ) : activeStage === 4 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <Shield className="h-5 w-5 text-green-600 mr-2" />
                  )}
                  <span
                    className={`font-medium ${
                      activeStage === 0
                        ? "text-yellow-800"
                        : activeStage >= 1 && activeStage <= 3
                          ? "text-blue-800"
                          : "text-green-800"
                    }`}
                  >
                    Status: {stages[activeStage].status}
                  </span>
                </div>
                <span className="text-sm text-gray-600">Last Updated: {stages[activeStage].date}</span>
              </div>

              {/* Document Content - Changes based on stage */}
              <div className="space-y-6">
                {/* Basic Information - Always visible */}
                <section>
                  <h3 className="text-lg font-bold mb-3 border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Requesting Ministry</p>
                      <p className="font-medium">Ministry of Finance</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Request Date</p>
                      <p className="font-medium">June 15, 2023</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fiscal Year</p>
                      <p className="font-medium">2023-2024</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Priority Level</p>
                      <p className="font-medium">High</p>
                    </div>
                  </div>
                </section>

                {/* Budget Details - Always visible but with changes */}
                <section>
                  <h3 className="text-lg font-bold mb-3 border-b pb-2">Budget Allocation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Project Title</p>
                      <p className="font-medium">Rural Healthcare Infrastructure Development</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount Requested</p>
                      <p className="font-medium">ZMW 25,000,000.00</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Budget Category</p>
                      <p className="font-medium">Capital Expenditure</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Project Duration</p>
                      <p className="font-medium">18 months (July 2023 - December 2024)</p>
                    </div>
                  </div>
                </section>

                {/* Justification - Always visible */}
                <section>
                  <h3 className="text-lg font-bold mb-3 border-b pb-2">Justification</h3>
                  <p className="text-sm mb-3">
                    This budget allocation is requested to fund the construction and equipping of 15 rural health
                    centers across underserved provinces. The project aligns with the National Health Strategic Plan and
                    will improve healthcare access for approximately 500,000 citizens in rural areas.
                  </p>
                </section>

                {/* Planning Review - Visible from stage 1 */}
                {activeStage >= 1 && (
                  <section className={activeStage === 1 ? "animate-fadeIn bg-blue-50 p-3 rounded-md" : ""}>
                    <h3 className="text-lg font-bold mb-3 border-b pb-2">
                      Planning Review
                      {activeStage === 1 && (
                        <span className="text-blue-600 text-sm font-normal ml-2">(Currently under review)</span>
                      )}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Alignment with National Development Plan</p>
                        <p className="font-medium">
                          {activeStage >= 2 ? (
                            <span className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" /> Confirmed
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Clock3 className="h-4 w-4 text-yellow-600 mr-1" /> Under Assessment
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Budget Availability Confirmation</p>
                        <p className="font-medium">
                          {activeStage >= 2 ? (
                            <span className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" /> Confirmed
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Clock3 className="h-4 w-4 text-yellow-600 mr-1" /> Under Assessment
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {activeStage >= 2 && (
                      <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                        <p className="text-sm flex items-start">
                          <Stamp className="h-4 w-4 text-green-600 mr-1 mt-0.5" />
                          <span>
                            <span className="font-medium">Approved by:</span> Director of Planning, Ministry of Planning
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">June 16, 2023 at 14:32</p>
                      </div>
                    )}
                  </section>
                )}

                {/* Legal Review - Visible from stage 2 */}
                {activeStage >= 2 && (
                  <section className={activeStage === 2 ? "animate-fadeIn bg-blue-50 p-3 rounded-md" : ""}>
                    <h3 className="text-lg font-bold mb-3 border-b pb-2">
                      Legal Review
                      {activeStage === 2 && (
                        <span className="text-blue-600 text-sm font-normal ml-2">(Currently under review)</span>
                      )}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Compliance with Procurement Laws</p>
                        <p className="font-medium">
                          {activeStage >= 3 ? (
                            <span className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" /> Compliant
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Clock3 className="h-4 w-4 text-yellow-600 mr-1" /> Under Review
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Legal Framework Verification</p>
                        <p className="font-medium">
                          {activeStage >= 3 ? (
                            <span className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" /> Verified
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Clock3 className="h-4 w-4 text-yellow-600 mr-1" /> Under Review
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {activeStage >= 3 && (
                      <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                        <p className="text-sm flex items-start">
                          <Stamp className="h-4 w-4 text-green-600 mr-1 mt-0.5" />
                          <span>
                            <span className="font-medium">Approved by:</span> Legal Counsel, Ministry of Legal Affairs
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">June 17, 2023 at 11:15</p>
                      </div>
                    )}
                  </section>
                )}

                {/* Technical Review - Visible from stage 3 */}
                {activeStage >= 3 && (
                  <section className={activeStage === 3 ? "animate-fadeIn bg-blue-50 p-3 rounded-md" : ""}>
                    <h3 className="text-lg font-bold mb-3 border-b pb-2">
                      Technical Review
                      {activeStage === 3 && (
                        <span className="text-blue-600 text-sm font-normal ml-2">(Currently under review)</span>
                      )}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Technical Feasibility</p>
                        <p className="font-medium">
                          {activeStage >= 4 ? (
                            <span className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" /> Confirmed
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Clock3 className="h-4 w-4 text-yellow-600 mr-1" /> Under Assessment
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">System Compatibility</p>
                        <p className="font-medium">
                          {activeStage >= 4 ? (
                            <span className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" /> Compatible
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Clock3 className="h-4 w-4 text-yellow-600 mr-1" /> Under Assessment
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {activeStage >= 4 && (
                      <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                        <p className="text-sm flex items-start">
                          <Stamp className="h-4 w-4 text-green-600 mr-1 mt-0.5" />
                          <span>
                            <span className="font-medium">Approved by:</span> Director of IT, Ministry of Digital
                            Governance
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">June 18, 2023 at 16:45</p>
                      </div>
                    )}
                  </section>
                )}

                {/* Executive Approval - Visible from stage 4 */}
                {activeStage >= 4 && (
                  <section className={activeStage === 4 ? "animate-fadeIn bg-green-50 p-3 rounded-md" : ""}>
                    <h3 className="text-lg font-bold mb-3 border-b pb-2">
                      Executive Approval
                      {activeStage === 4 && (
                        <span className="text-green-600 text-sm font-normal ml-2">(Final approval granted)</span>
                      )}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Presidential Review</p>
                        <p className="font-medium">
                          <span className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" /> Approved
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Comments</p>
                        <p className="text-sm italic">
                          "This project aligns with our national priority to improve rural healthcare access. Approved
                          for immediate implementation."
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                      <p className="text-sm flex items-start">
                        <Stamp className="h-4 w-4 text-green-600 mr-1 mt-0.5" />
                        <span>
                          <span className="font-medium">Approved by:</span> Chief of Staff, Office of the President
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">June 20, 2023 at 09:30</p>
                    </div>
                  </section>
                )}

                {/* Blockchain Record - Visible only at stage 5 */}
                {activeStage >= 5 && (
                  <section className="animate-fadeIn bg-[#f0fff0] p-3 rounded-md border border-[#78ec66]">
                    <h3 className="text-lg font-bold mb-3 border-b pb-2 text-[#2e7d32]">Blockchain Record</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Transaction Hash</p>
                        <p className="font-mono text-xs bg-gray-100 p-1 rounded">
                          0x7f9e8d7c6b5a4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Timestamp</p>
                        <p className="font-medium">June 20, 2023 at 09:35:22 UTC</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Digital Signatures</p>
                        <ul className="text-xs space-y-1 mt-1">
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 text-green-600 mr-1" />
                            Ministry of Finance (Initiator)
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 text-green-600 mr-1" />
                            Ministry of Planning (Validator)
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 text-green-600 mr-1" />
                            Ministry of Legal Affairs (Validator)
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 text-green-600 mr-1" />
                            Ministry of Digital Governance (Validator)
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 text-green-600 mr-1" />
                            Office of the President (Approver)
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-green-100 rounded">
                      <p className="text-sm flex items-center font-medium text-green-800">
                        <Shield className="h-4 w-4 mr-1" />
                        This record is immutable and permanently stored on the blockchain
                      </p>
                    </div>
                  </section>
                )}
              </div>

              {/* Document Footer */}
              <div className="mt-12 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                <p>OFFICIAL GOVERNMENT DOCUMENT - ZAMBIA DIGITAL PORTAL</p>
                <p>© 2023 Government of Zambia. All rights reserved.</p>
              </div>
            </div>
          </div>

          {/* Document Navigation */}
          <div className="bg-gray-100 px-4 py-3 flex justify-between items-center border-t">
            <div className="flex items-center">
              <button className="text-sm text-gray-600 hover:text-[#78ec66] flex items-center">
                <Search className="h-4 w-4 mr-1" /> Search Document
              </button>
            </div>
            <div>
              <button className="bg-[#78ec66] text-black px-4 py-1.5 rounded-md text-sm font-medium hover:bg-[#5ee849] flex items-center">
                <Download className="h-4 w-4 mr-1" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TimelineItem({ title, description, icon, isLeft }) {
  return (
    <div className={`flex flex-col md:flex-row ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} items-center`}>
      <div className={`md:w-1/2 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"} mb-4 md:mb-0`}>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex items-center justify-center z-10 bg-[#78ec66] rounded-full h-12 w-12 shadow-lg">{icon}</div>
      <div className="md:w-1/2"></div>
    </div>
  )
}

function BenefitCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
