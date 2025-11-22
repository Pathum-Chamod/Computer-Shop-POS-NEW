import { useEffect, useState } from 'react'
import { FileText, Calendar, User, Search, ArrowUpRight, Package } from 'lucide-react'
import { Card } from "@/components/ui/card"

export function HistoryPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const data = await (window as any).api.invoke('get-sales-history')
      setInvoices(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = invoices.filter((inv) => 
    inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Transaction History</h2>
          <p className="text-slate-500 text-sm mt-1">View past sales and quotations</p>
        </div>
        
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input 
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Search Invoice # or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading history...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No transactions found.</p>
          </div>
        ) : (
          filteredInvoices.map((inv) => (
            <div key={inv.id} className="group nexus-panel p-0 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all">
              
              {/* INVOICE HEADER ROW */}
              <div className="p-5 flex items-center gap-6 bg-white/[0.02]">
                <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <FileText className="h-6 w-6" />
                </div>
                
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Invoice #</div>
                    <div className="text-white font-mono font-bold">{inv.invoiceNo}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 flex items-center gap-1">
                      <User className="h-3 w-3" /> Customer
                    </div>
                    <div className="text-white">{inv.customerName || 'Walk-in'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Date
                    </div>
                    <div className="text-slate-300">{new Date(inv.date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Total Amount</div>
                    <div className="text-emerald-400 font-mono font-bold text-lg">
                      ${Number(inv.totalAmount).toFixed(2)}
                    </div>
                  </div>
                </div>

                <button className="p-2 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors">
                  <ArrowUpRight className="h-5 w-5" />
                </button>
              </div>

              {/* EXPANDABLE ITEMS LIST (Simple view for now) */}
              <div className="bg-black/20 px-5 py-3 border-t border-white/5 flex flex-wrap gap-3">
                {inv.items?.map((item: any, idx: number) => (
                  <span key={idx} className="inline-flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/5 text-xs text-slate-400">
                    <Package className="h-3 w-3" />
                    {item.qty}x {item.description}
                  </span>
                ))}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}