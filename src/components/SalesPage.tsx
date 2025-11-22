import { useState, useEffect, useRef } from 'react'
import { 
  ShoppingCart, Search, Plus, Trash2, Printer, FileText, 
  XCircle, ScanBarcode, User, Calendar
} from 'lucide-react'
import './SalesPage.css'

export function SalesPage() {
  // --- CART STATE ---
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now().toString().slice(-6)}`)
  const [customerName, setCustomerName] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [cartItems, setCartItems] = useState<any[]>([])

  // --- CURRENT ITEM FORM STATE ---
  const [scanInput, setScanInput] = useState("")
  const [currentItem, setCurrentItem] = useState({
    productId: null,
    itemCode: "",
    description: "",
    serialNumber: "", 
    trackSerial: false,
    warranty: "1 Year",
    qty: 1,
    costPrice: 0,      
    wholesalePrice: 0, 
    sellingPrice: 0,   
    customUnitPrice: 0, 
    priceType: 'RETAIL' 
  })

  // --- UI STATE ---
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  const scanInputRef = useRef<HTMLInputElement>(null)

  // 1. HANDLE BARCODE SCAN / SEARCH
  const handleScanOrSearch = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && scanInput.trim()) {
      try {
        // A. Try Exact Serial Match First
        const serialResult = await (window as any).api.invoke('scan-serial', scanInput.trim())
        
        if (serialResult && serialResult.type === 'SERIAL_MATCH') {
          loadItemToForm(serialResult.data.product, serialResult.data.serialNumber)
          setSearchResults([])
          return
        }

        // B. If no serial match, search by description/code
        const products = await (window as any).api.invoke('search-products-sales', scanInput.trim())
        setSearchResults(products)
        setIsSearching(true)

      } catch (err: any) {
        alert(err.message || "Scan failed")
      }
    }
  }

  // 2. LOAD ITEM DATA INTO FORM
  const loadItemToForm = (product: any, specificSerial: string = "") => {
    setCurrentItem({
      productId: product.id,
      itemCode: product.itemCode,
      description: product.name,
      serialNumber: specificSerial,
      trackSerial: product.trackSerial,
      warranty: product.warrantyType || "1 Year",
      qty: 1,
      costPrice: parseFloat(product.costPrice),
      wholesalePrice: parseFloat(product.wholesalePrice),
      sellingPrice: parseFloat(product.sellingPrice),
      customUnitPrice: parseFloat(product.sellingPrice), 
      priceType: 'RETAIL'
    })
    
    setScanInput("") 
    setIsSearching(false)
  }

  // 3. ADD TO CART LOGIC
  const addToCart = () => {
    if (!currentItem.productId) return alert("No item selected.")
    
    if (currentItem.customUnitPrice < currentItem.wholesalePrice) {
      return alert(`Error: Price cannot be lower than Wholesale Price ($${currentItem.wholesalePrice})`)
    }
    
    if (currentItem.trackSerial && !currentItem.serialNumber) {
      return alert("Error: Serial Number is required for this item.")
    }

    const newItem = {
      ...currentItem,
      total: currentItem.customUnitPrice * currentItem.qty,
      id: Date.now() 
    }

    setCartItems([...cartItems, newItem])
    
    // Reset Form
    setCurrentItem({
      productId: null, itemCode: "", description: "", serialNumber: "", trackSerial: false,
      warranty: "1 Year", qty: 1, costPrice: 0, wholesalePrice: 0, sellingPrice: 0,
      customUnitPrice: 0, priceType: 'RETAIL'
    })
    
    setTimeout(() => scanInputRef.current?.focus(), 100)
  }

  const removeFromCart = (index: number) => {
    const newCart = [...cartItems]
    newCart.splice(index, 1)
    setCartItems(newCart)
  }

  // 4. FINAL SUBMIT
  const processTransaction = async (type: 'INVOICE' | 'QUOTATION') => {
    if (cartItems.length === 0) return alert("Cart is empty")
    if (!customerName) return alert("Customer Name is required")

    const payload = {
      invoiceData: {
        invoiceNo,
        customerName,
        date,
        totalAmount: cartItems.reduce((sum, item) => sum + item.total, 0),
        type
      },
      items: cartItems.map(item => ({
        productId: item.productId,
        itemCode: item.itemCode,
        description: item.description,
        serialNumber: item.serialNumber,
        warranty: item.warranty,
        qty: item.qty,
        unitPrice: item.customUnitPrice,
        total: item.total,
        trackSerial: item.trackSerial
      }))
    }

    try {
      await (window as any).api.invoke('create-invoice', payload)
      alert(`${type} Saved Successfully!`)
      
      setCartItems([])
      setCustomerName("")
      setInvoiceNo(`INV-${Date.now().toString().slice(-6)}`)
    } catch (e) {
      console.error(e)
      alert("Transaction Failed. Check Console.")
    }
  }

  const subTotal = cartItems.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="sales-container">
      
      {/* --- LEFT SIDE: FORM & CART --- */}
      <div className="flex-1 flex flex-col p-6 gap-6 relative overflow-hidden">
        
        {/* Header */}
        <div className="shrink-0">
          <h2 className="sales-header-title">New Sale & Billing</h2>
          <p className="sales-header-subtitle">Process Transactions & Quotations</p>
        </div>

        {/* 1. Customer Details Row */}
        <div className="sales-card p-5 shrink-0">
          <div className="sales-form-row !mb-0">
            <div className="col-span-5 input-group">
               <label className="sales-label">Invoice To</label>
               <div className="relative w-full">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                 <input 
                   className="sales-input pl-10" 
                   placeholder="Customer Name / Tel"
                   value={customerName}
                   onChange={(e) => setCustomerName(e.target.value)} 
                 />
               </div>
            </div>
            <div className="col-span-4 input-group">
               <label className="sales-label">Invoice #</label>
               <input className="sales-input text-center font-mono text-blue-400 bg-blue-500/10 border-blue-500/20" value={invoiceNo} readOnly />
            </div>
            <div className="col-span-3 input-group">
               <label className="sales-label">Date</label>
               <div className="relative w-full">
                 <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4 pointer-events-none" />
                 <input type="date" className="sales-input" value={date} onChange={(e) => setDate(e.target.value)} />
               </div>
            </div>
          </div>
        </div>

        {/* 2. Item Entry Panel (UPDATED FOR ALIGNMENT) */}
        <div className="sales-card accent-blue p-5 shrink-0 overflow-visible z-20">
          
          {/* Scanner Row */}
          <div className="mb-5 input-group relative">
            <label className="sales-label text-blue-400">Scan Barcode / Search Item</label>
            <div className="relative w-full">
              <ScanBarcode className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 h-6 w-6 animate-pulse" />
              <input 
                ref={scanInputRef}
                className="sales-input scanner pl-12 shadow-lg shadow-blue-900/20"
                placeholder="Scan Serial or Type Description + Enter"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={handleScanOrSearch}
                autoFocus
              />
            </div>
            
            {/* SEARCH RESULTS DROPDOWN */}
            {isSearching && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-slate-900 border border-white/20 rounded-lg mt-1 z-50 shadow-2xl max-h-60 overflow-y-auto">
                {searchResults.map(prod => (
                  <div key={prod.id} className="p-3 hover:bg-blue-600 cursor-pointer border-b border-white/5 flex justify-between items-center" onClick={() => loadItemToForm(prod)}>
                    <div>
                      <div className="text-white font-bold">{prod.name}</div>
                      <div className="text-xs text-slate-400">{prod.itemCode}</div>
                    </div>
                    <div className="text-emerald-400 font-mono">${prod.sellingPrice}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Row 1: 2 + 5 + 3 + 2 = 12 Cols */}
          <div className="sales-form-row">
             <div className="col-span-2 input-group">
                <label className="sales-label">Code</label>
                <input className="sales-input" value={currentItem.itemCode} readOnly />
             </div>
             <div className="col-span-5 input-group">
                <label className="sales-label">Description</label>
                <input className="sales-input" value={currentItem.description} readOnly />
             </div>
             <div className="col-span-3 input-group">
                <label className="sales-label">Serial No</label>
                <input 
                  className={`sales-input ${currentItem.trackSerial && !currentItem.serialNumber ? 'border-red-500/50 bg-red-500/10' : ''}`}
                  value={currentItem.serialNumber} 
                  onChange={(e) => setCurrentItem({...currentItem, serialNumber: e.target.value})}
                  placeholder={currentItem.trackSerial ? "Required" : "Optional"}
                />
             </div>
             <div className="col-span-2 input-group">
               <label className="sales-label text-center">Qty</label>
               <input type="number" className="sales-input text-center font-bold text-white" value={currentItem.qty} onChange={(e) => setCurrentItem({...currentItem, qty: parseInt(e.target.value) || 1})} />
             </div>
          </div>

          {/* Details Row 2: 3 + 3 + 3 + 3 = 12 Cols (Symmetrical) */}
          <div className="sales-form-row !mb-0">
             <div className="col-span-3 input-group">
               <label className="sales-label">Warranty</label>
               <select className="sales-input" value={currentItem.warranty} onChange={(e) => setCurrentItem({...currentItem, warranty: e.target.value})}>
                  <option>No Warranty</option>
                  <option>1 Year</option>
                  <option>2 Years</option>
               </select>
             </div>

             <div className="col-span-3 input-group">
               <label className="sales-label">Price Type</label>
               <div className="flex gap-1 h-[3rem]">
                 <button 
                   className={`flex-1 rounded-l border text-[10px] font-bold transition-colors ${currentItem.priceType === 'RETAIL' ? 'bg-emerald-500 text-white border-emerald-500' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}
                   onClick={() => setCurrentItem({...currentItem, priceType: 'RETAIL', customUnitPrice: currentItem.sellingPrice})}
                 >
                   RETAIL
                 </button>
                 <button 
                   className={`flex-1 rounded-r border text-[10px] font-bold transition-colors ${currentItem.priceType === 'WHOLESALE' ? 'bg-blue-500 text-white border-blue-500' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}
                   onClick={() => setCurrentItem({...currentItem, priceType: 'WHOLESALE', customUnitPrice: currentItem.wholesalePrice})}
                 >
                   WHOLESALE
                 </button>
               </div>
             </div>

             <div className="col-span-3 input-group">
               <label className="sales-label">Unit Price ($)</label>
               <input 
                 type="number"
                 className="sales-input text-emerald-400 font-bold font-mono"
                 value={currentItem.customUnitPrice}
                 onChange={(e) => setCurrentItem({...currentItem, customUnitPrice: parseFloat(e.target.value), priceType: 'CUSTOM'})}
               />
             </div>

             <div className="col-span-3 input-group">
               <label className="sales-label">&nbsp;</label>
               <button onClick={addToCart} className="sales-btn sales-btn-primary shadow-lg shadow-blue-600/20">
                 <Plus className="mr-2 h-5 w-5" /> ADD TO BILL
               </button>
             </div>
          </div>
        </div>

        {/* 3. Cart Table */}
        <div className="sales-card flex-1 overflow-hidden">
          <div className="bg-slate-900/50 px-4 py-3 border-b border-white/10 grid grid-cols-12 gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-1 text-center">Qty</div>
            <div className="col-span-3 text-right">Total</div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {cartItems.length > 0 ? cartItems.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 px-4 py-3 rounded bg-white/[0.02] items-center hover:bg-white/[0.05] group transition-colors">
                <div className="col-span-1 text-slate-500">{idx + 1}</div>
                <div className="col-span-5">
                  <div className="text-sm text-white font-bold">{item.description}</div>
                  <div className="text-[10px] text-slate-500 font-mono flex gap-2">
                    <span>{item.itemCode}</span>
                    {item.serialNumber && <span className="text-blue-400">SN: {item.serialNumber}</span>}
                  </div>
                </div>
                <div className="col-span-2 text-right text-sm font-mono text-slate-300">${item.customUnitPrice.toFixed(2)}</div>
                <div className="col-span-1 text-center text-white font-bold bg-white/5 rounded">{item.qty}</div>
                <div className="col-span-3 text-right flex items-center justify-end gap-4">
                   <span className="font-bold text-emerald-400 font-mono">${item.total.toFixed(2)}</span>
                   <button onClick={() => removeFromCart(idx)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 p-1 rounded">
                     <Trash2 className="h-4 w-4" />
                   </button>
                </div>
              </div>
            )) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-600/50">
                 <ShoppingCart className="h-12 w-12 mb-3 opacity-50" />
                 <span className="text-xs font-bold uppercase tracking-widest">Cart Empty</span>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: TOTALS (UPDATED) --- */}
      <div className="w-96 shrink-0">
        <div className="sales-totals-panel">
           
           {/* 1. TOP SECTION: Details */}
           <div className="panel-header">
             <h3 className="text-white font-bold text-xl flex items-center gap-3">
               <FileText className="h-6 w-6 text-blue-500" /> 
               Payment Details
             </h3>
           </div>
           
           <div className="space-y-4">
             <div className="payment-row">
               <span>Subtotal</span>
               <span>${subTotal.toFixed(2)}</span>
             </div>
             <div className="payment-row">
               <span>Tax (0%)</span>
               <span>$0.00</span>
             </div>
             <div className="payment-row">
               <span>Discount</span>
               <span className="text-red-400">-$0.00</span>
             </div>
           </div>

           {/* 2. MIDDLE SECTION: Big Total */}
           <div className="total-section">
             <span className="total-label">Total Payable</span>
             <div className="total-display">${subTotal.toFixed(2)}</div>
           </div>

           {/* 3. BOTTOM SECTION: Buttons */}
           <div className="panel-footer">
             <button 
                onClick={() => processTransaction('INVOICE')}
                className="sales-btn sales-btn-success h-14 text-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
             >
               <Printer className="mr-2 h-5 w-5" /> PRINT & SAVE
             </button>
             
             <button onClick={() => processTransaction('QUOTATION')} className="sales-btn border border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                <FileText className="mr-2 h-4 w-4" /> SAVE QUOTATION
             </button>

             <div className="action-grid">
               <button 
                 onClick={() => setCartItems([])}
                 className="sales-btn border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white text-xs"
               >
                 CLEAR
               </button>
               <button className="sales-btn border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs">
                 CANCEL
               </button>
             </div>
           </div>

        </div>
      </div>

    </div>
  )
}