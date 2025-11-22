import { useState, useEffect, useRef } from 'react'
import { 
  Package, User, FileText, Calendar, Layers, 
  DollarSign, CreditCard, Box, Save, Search, 
  Monitor, Barcode, ShieldCheck, Hash, Trash2, Edit, Eye, RotateCcw, Coins
} from 'lucide-react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import './AddProductForm.css'

export function InventoryPage() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [selectedSerials, setSelectedSerials] = useState<string[]>([])
  const [isSerialModalOpen, setIsSerialModalOpen] = useState(false)
  
  // Ref for the search input to focus it easily if needed
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    id: null,
    itemCode: `ITM-${Date.now().toString().slice(-6)}`,
    supplier: '',
    billNo: '',
    billDate: new Date().toISOString().split('T')[0],
    description: '',
    qty: 1,
    warranty: '1 Year',
    costPrice: '',      
    wholesalePrice: '', 
    sellingPrice: '',   
    trackSerial: false,
    serials: ['']
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await (window as any).api.getProducts()
      setProducts(data)
    } catch (err) {
      console.error("Failed to load products", err)
    }
  }

  // --- FORM HANDLERS ---
  const handleQtyChange = (newQty: string) => {
    const qty = parseInt(newQty) || 0
    const currentSerials = [...formData.serials]
    if (qty > currentSerials.length) {
      const added = new Array(qty - currentSerials.length).fill('')
      setFormData({ ...formData, qty, serials: [...currentSerials, ...added] })
    } else {
      setFormData({ ...formData, qty, serials: currentSerials.slice(0, qty) })
    }
  }

  const handleSerialChange = (index: number, value: string) => {
    const newSerials = [...formData.serials]
    newSerials[index] = value
    setFormData({ ...formData, serials: newSerials })
  }

  const handleClearForm = () => {
    setFormData({
      id: null,
      itemCode: `ITM-${Date.now().toString().slice(-6)}`,
      supplier: '',
      billNo: '',
      billDate: new Date().toISOString().split('T')[0],
      description: '',
      qty: 1,
      warranty: '1 Year',
      costPrice: '',
      wholesalePrice: '',
      sellingPrice: '',
      trackSerial: false,
      serials: ['']
    })
    setIsEditing(false)
  }

  const handleSave = async () => {
    // --- VALIDATION LOGIC ---
    if (!formData.description.trim()) {
      alert("Error: Description is required!")
      return
    }
    if (!formData.costPrice) {
      alert("Error: Cost Price is required!")
      return
    }
    if (!formData.wholesalePrice) {
      alert("Error: Wholesale Price is required!")
      return
    }
    if (!formData.sellingPrice) {
      alert("Error: Selling Price is required!")
      return
    }

    if (formData.trackSerial && formData.serials.some(s => !s)) {
      alert("Please scan all serial numbers!")
      return
    }

    try {
      const action = formData.id ? 'update-product' : 'add-product'
      await (window as any).api.invoke(action, {
        ...formData,
        name: formData.description, 
        costPrice: formData.costPrice,
        wholesalePrice: formData.wholesalePrice,
        sellingPrice: formData.sellingPrice
      })
      
      await loadProducts()
      handleClearForm()
      
    } catch (err) {
      console.error(err)
      alert("Failed to save product")
    }
  }

  const handleEdit = (product: any) => {
    setFormData({
      id: product.id,
      itemCode: product.itemCode,
      supplier: product.supplier?.name || '',
      billNo: product.lastBillNo || '',
      billDate: product.lastBillDate ? product.lastBillDate.split('T')[0] : '',
      description: product.name,
      qty: product.qty,
      warranty: product.warrantyType || '1 Year',
      costPrice: product.costPrice,
      wholesalePrice: product.wholesalePrice,
      sellingPrice: product.sellingPrice,
      trackSerial: product.trackSerial,
      serials: product.stockItems?.map((s: any) => s.serialNumber) || []
    })
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await (window as any).api.invoke('delete-product', id)
      loadProducts()
    }
  }

  const handleViewSerials = (stockItems: any[]) => {
    setSelectedSerials(stockItems.map(s => s.serialNumber))
    setIsSerialModalOpen(true)
  }

  // --- UPDATED SEARCH LOGIC FOR BARCODE SCANNING ---
  const filteredProducts = products.filter((p: any) => {
    const term = searchTerm.toLowerCase().trim();
    
    // 1. Search Basic Info
    const matchesBasic = 
      p.name.toLowerCase().includes(term) ||
      p.itemCode?.toLowerCase().includes(term) ||
      p.supplier?.name?.toLowerCase().includes(term);

    // 2. Search Serial Numbers (Deep Search for Scanners)
    // This checks if ANY stock item attached to this product matches the scanned code
    const matchesSerial = p.stockItems?.some((s: any) => 
      s.serialNumber.toLowerCase().includes(term)
    );

    return matchesBasic || matchesSerial;
  });

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* TOP BAR (Simplified without Back Button) */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight">Billing & Inventory</h2>
        <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Manage Stock & Sales</p>
      </div>

      {/* FORM */}
      <div className={`product-form-container mb-12 ${isEditing ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isEditing ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {isEditing ? <Edit className="h-6 w-6" /> : <Box className="h-6 w-6" />}
            </div>
            <h3 className="text-xl font-bold text-white">{isEditing ? "Edit Inventory Item" : "Add New Item"}</h3>
          </div>
          <div className="flex gap-2">
             <button onClick={handleClearForm} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-400 flex items-center gap-2 transition-colors">
               <RotateCcw className="h-4 w-4" /> CLEAR FORM
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT: DETAILS */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <label className="form-label">Item #</label>
                <div className="form-input-wrapper">
                  <Hash className="form-input-icon" size={16} />
                  <input className="form-input text-slate-400 bg-black/20 cursor-not-allowed" value={formData.itemCode} readOnly />
                </div>
              </div>
              <div className="w-full">
                <label className="form-label">Date</label>
                <div className="form-input-wrapper">
                  <Calendar className="form-input-icon" size={16} />
                  <input type="date" className="form-input" value={formData.billDate} onChange={(e) => setFormData({...formData, billDate: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <label className="form-label">Supplier</label>
                <div className="form-input-wrapper">
                  <User className="form-input-icon" size={16} />
                  <input className="form-input" placeholder="Supplier Name" value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})} />
                </div>
              </div>
              <div className="w-full">
                <label className="form-label">Bill No</label>
                <div className="form-input-wrapper">
                  <FileText className="form-input-icon" size={16} />
                  <input className="form-input" placeholder="INV-001" value={formData.billNo} onChange={(e) => setFormData({...formData, billNo: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="w-full">
              <label className="form-label">Description <span className="text-red-500">*</span></label>
              <div className="form-input-wrapper">
                <Package className="form-input-icon" size={18} />
                <input className="form-input" placeholder="Item Name / Details" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
          </div>

          {/* RIGHT: PRICING & STOCK */}
          <div className="space-y-6 flex flex-col">
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <label className="form-label">Qty</label>
                <div className="form-input-wrapper">
                  <Layers className="form-input-icon" size={16} />
                  <input type="number" min="1" className="form-input font-bold text-white" value={formData.qty} onChange={(e) => handleQtyChange(e.target.value)} />
                </div>
              </div>
              <div className="w-full">
                <label className="form-label">Warranty</label>
                <div className="form-input-wrapper">
                  <ShieldCheck className="form-input-icon" size={16} />
                  <select className="form-input appearance-none" value={formData.warranty} onChange={(e) => setFormData({...formData, warranty: e.target.value})}>
                    <option>No Warranty</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3 Years</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="w-full">
                <label className="form-label text-slate-400">Cost <span className="text-red-500">*</span></label>
                <div className="form-input-wrapper">
                  <CreditCard className="form-input-icon" size={14} />
                  <input type="number" className="form-input font-mono text-sm text-slate-300 !pl-9" placeholder="0.00" value={formData.costPrice} onChange={(e) => setFormData({...formData, costPrice: e.target.value})} />
                </div>
              </div>
              <div className="w-full">
                <label className="form-label text-blue-400">Wholesale <span className="text-red-500">*</span></label>
                <div className="form-input-wrapper">
                  <Coins className="form-input-icon text-blue-500" size={14} />
                  <input type="number" className="form-input font-mono text-sm text-blue-400 !pl-9" placeholder="0.00" value={formData.wholesalePrice} onChange={(e) => setFormData({...formData, wholesalePrice: e.target.value})} />
                </div>
              </div>
              <div className="w-full">
                <label className="form-label text-emerald-400">Selling <span className="text-red-500">*</span></label>
                <div className="form-input-wrapper">
                  <DollarSign className="form-input-icon text-emerald-500" size={14} />
                  <input type="number" className="form-input font-mono text-sm text-emerald-400 !pl-9" placeholder="0.00" value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} />
                </div>
              </div>
            </div>

            {/* SERIALS */}
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 mt-2">
              <div className="flex items-center gap-3 mb-4">
                <input type="checkbox" id="trackSerial" checked={formData.trackSerial} onChange={(e) => setFormData({...formData, trackSerial: e.target.checked})} className="w-5 h-5 rounded border-slate-600 bg-slate-800" />
                <label htmlFor="trackSerial" className="text-sm font-bold text-white cursor-pointer">Track Serial Numbers</label>
              </div>
              {formData.trackSerial && (
                <div className="space-y-3 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {formData.serials.map((serial, index) => (
                    <div key={index} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                      <span className="text-xs text-slate-500 font-mono w-6 text-right">{index + 1}.</span>
                      <div className="form-input-wrapper h-10">
                        <Barcode className="form-input-icon" size={14} />
                        <input className="form-input !h-10 !text-xs !pl-10" placeholder={`Scan Serial #${index + 1}`} value={serial} onChange={(e) => handleSerialChange(index, e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-auto pt-4">
              <button onClick={handleSave} className={`form-btn ${isEditing ? '!bg-gradient-to-r !from-amber-500 !to-orange-500' : ''}`}>
                <Save className="h-5 w-5 mr-3" /> {isEditing ? "UPDATE ITEM" : "ADD STOCK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & TABLE - UPDATED FOR BARCODE SCANNING */}
      <div className="mb-6 relative max-w-md mx-auto">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-20">
          {/* Changed icon to Barcode to hint at scanning capability */}
          <Barcode className="h-5 w-5 text-blue-400" />
        </div>
        <input 
          ref={searchInputRef}
          placeholder="Search inventory or Scan Serial..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // Auto-select text on click for faster subsequent scans
          onClick={(e) => e.currentTarget.select()}
          className="form-input !h-12 !pl-12 !bg-black/40 focus:!bg-black/60" 
        />
      </div>

      <Card className="nexus-panel border-0 rounded-2xl overflow-hidden shadow-2xl">
        <CardHeader className="border-b border-white/10 bg-white/[0.02] px-8 py-6">
          <div className="flex items-center gap-3">
            <Monitor className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Current Stock</h3>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/30">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-slate-500 font-bold text-[10px] uppercase tracking-wider h-12 pl-8">Item #</TableHead>
                <TableHead className="text-slate-500 font-bold text-[10px] uppercase tracking-wider h-12">Description</TableHead>
                <TableHead className="text-slate-500 font-bold text-[10px] uppercase tracking-wider h-12">Supplier</TableHead>
                <TableHead className="text-slate-500 font-bold text-[10px] uppercase tracking-wider h-12">Bill No</TableHead>
                <TableHead className="text-slate-500 font-bold text-[10px] uppercase tracking-wider h-12">Warranty</TableHead>
                <TableHead className="text-right text-slate-500 font-bold text-[10px] uppercase tracking-wider h-12">Cost</TableHead>
                <TableHead className="text-right text-slate-500 font-bold text-[10px] uppercase tracking-wider h-12">Wholesale</TableHead>
                <TableHead className="text-right text-slate-500 font-bold text-[10px] uppercase tracking-wider h-12">Selling</TableHead>
                <TableHead className="text-right text-slate-500 font-bold text-[10px] uppercase tracking-wider h-12">Qty</TableHead>
                <TableHead className="text-right text-slate-500 font-bold text-[10px] uppercase tracking-wider h-12 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? filteredProducts.map((product: any) => (
                <TableRow key={product.id} className="border-white/5 hover:bg-white/[0.03]">
                  <TableCell className="text-slate-400 font-mono text-xs pl-8">{product.itemCode}</TableCell>
                  <TableCell className="font-bold text-white">
                    {product.name}
                    {/* Optional: Show badge if searched via serial */}
                    {searchTerm && product.stockItems?.some((s:any) => s.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())) && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-400">
                        MATCH
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs">{product.supplier?.name || '-'}</TableCell>
                  <TableCell className="text-slate-400 text-xs">{product.lastBillNo || '-'}</TableCell>
                  <TableCell className="text-slate-400 text-xs">{product.warrantyType || '-'}</TableCell>
                  <TableCell className="text-right font-mono text-slate-500 text-xs">${Number(product.costPrice).toFixed(2)}</TableCell>
                  <TableCell className="text-right font-mono text-blue-400 text-xs">${Number(product.wholesalePrice).toFixed(2)}</TableCell>
                  <TableCell className="text-right font-mono text-emerald-400 font-bold">${Number(product.sellingPrice).toFixed(2)}</TableCell>
                  <TableCell className="text-right text-white font-bold">{product.qty}</TableCell>
                  <TableCell className="pr-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleViewSerials(product.stockItems)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="View Serials">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleEdit(product)} className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                 <TableRow>
                   <TableCell colSpan={10} className="text-center py-8 text-slate-500">
                     {searchTerm ? "No products found matching that search/serial." : "No products in inventory."}
                   </TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* SERIAL NUMBERS MODAL */}
      <Dialog open={isSerialModalOpen} onOpenChange={setIsSerialModalOpen}>
        <DialogContent className="nexus-panel border-0 p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Serial Numbers</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
            {selectedSerials.length > 0 ? (
              selectedSerials.map((s, i) => (
                <div key={i} className="p-3 bg-black/40 rounded-lg border border-white/10 text-sm font-mono text-slate-300 flex justify-between">
                  <span>#{i + 1}</span>
                  <span className={searchTerm && s.toLowerCase().includes(searchTerm.toLowerCase()) ? "text-blue-400 font-bold" : "text-white"}>
                    {s}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">No serial numbers tracked for this item.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}