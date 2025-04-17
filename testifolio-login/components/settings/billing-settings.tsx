import { Check, FileText } from "lucide-react"

export default function BillingSettings() {
  const invoices = [
    { date: "Jan 01, 2025", amount: "$49.00", status: "Paid" },
    { date: "Feb 02, 2025", amount: "$49.00", status: "Paid" },
    { date: "March 03, 2025", amount: "$49.00", status: "Paid" },
    { date: "Jan 03, 2025", amount: "$49.00", status: "Paid" },
    { date: "Feb 03, 2025", amount: "$49.00", status: "Paid" },
  ]

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Subscription & Billing</h2>

      <div className="mb-8 flex flex-col justify-between gap-6 rounded-lg border border-gray-200 p-6 md:flex-row">
        <div>
          <h3 className="text-lg font-medium">TestiFolio Pro</h3>
          <p className="text-gray-500">Monthly Plan</p>
        </div>
        <div className="text-center">
          <span className="text-3xl font-bold">$49</span>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-medium">Payment Method</h3>
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-gray-100 p-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#1A1A1A" />
                <path d="M7 15H17V9H7V15Z" fill="#1A1A1A" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <span>•••• •••• •••• 4242</span>
            <button className="text-sm text-[#7c5cff] hover:underline">Edit</button>
          </div>
        </div>
        <div>
          <button className="w-full rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
            Upgrade Plan
          </button>
        </div>
      </div>

      <h3 className="mb-4 text-lg font-medium">Billing History</h3>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice, i) => (
              <tr key={i} className="bg-white">
                <td className="px-4 py-3 text-sm text-gray-900">{invoice.date}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{invoice.amount}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <Check className="mr-1 h-3 w-3" />
                    {invoice.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button className="text-gray-500 hover:text-gray-700">
                    <FileText className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
