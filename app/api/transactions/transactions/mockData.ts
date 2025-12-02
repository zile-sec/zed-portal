// Mock transactions data
export const mockTransactions = [
  {
    id: "t1",
    transaction_ref: "TRX-2023-001",
    department: "Finance Department",
    purpose: "Office Renovation",
    description: "Renovation of the finance department offices on the 3rd floor",
    amount: "28500",
    currency: "USD",
    sender_id: 1,
    recipient_name: "BuildRight Contractors",
    recipient_type: "Company",
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: "Phase 1 of headquarters renovation",
    blockchain_hash: "0x7d8f4b61d5f86c91d1e8b6f2e3a5c9b7e1d2f3a4b5c6d7e8f9a0b1c2d3e4f5a6",
  },
  {
    id: "t2",
    transaction_ref: "TRX-2023-002",
    department: "Health Department",
    purpose: "Medical Equipment Purchase",
    description: "Purchase of new MRI machine for the central hospital",
    amount: "145000",
    currency: "USD",
    sender_id: 4,
    recipient_name: "Medical Supplies Inc.",
    recipient_type: "Company",
    status: "approved",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    notes: "Urgent purchase for the new hospital wing",
    blockchain_hash: "0x8e9f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
  },
  {
    id: "t3",
    transaction_ref: "TRX-2023-003",
    department: "Lands Department",
    purpose: "Land Survey Equipment",
    description: "New equipment for the field survey team",
    amount: "12750",
    currency: "USD",
    sender_id: 2,
    recipient_name: "GeoTech Solutions",
    recipient_type: "Company",
    status: "rejected",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    notes: "Budget constraints - postponed to next quarter",
    blockchain_hash: "0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  },
]
