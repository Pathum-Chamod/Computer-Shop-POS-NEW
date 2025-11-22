import { useEffect, useState } from 'react'
import { Plus, Search, Package, Monitor, Cpu } from 'lucide-react'

// Shadcn UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

function App() {
  const [products, setProducts] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    categoryName: '',
    price: '',
    cost: ''
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

  const handleSave = async () => {
    try {
      await (window as any).api.addProduct(formData)
      await loadProducts()
      setIsOpen(false)
      setFormData({ name: '', brand: '', categoryName: '', price: '', cost: '' })
    } catch (err) {
      alert("Failed to save product")
    }
  }

  return (
    <div className="p-8 min-h-screen text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* TOP BAR */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-glow">
            NEXUS POS
          </h1>
          <p className="text-slate-400 mt-1 font-medium tracking-wide">SYSTEM STATUS: <span className="text-green-400">ONLINE</span></p>
        </div>

        {/* GLOWING ADD BUTTON */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white btn-glow px-6 py-6 text-md font-bold rounded-xl">
              <Plus className="mr-2 h-5 w-5" /> NEW ENTRY
            </Button>
          </DialogTrigger>
          
          {/* POPUP MODAL */}
          <DialogContent className="bg-slate-900 border-slate-700 text-slate-100">
            <DialogHeader>
              <DialogTitle className="text-xl text-blue-400">Add Inventory Item</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Product Name</Label>
                  <Input 
                    className="bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="e.g. RTX 4090" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Brand</Label>
                  <Input 
                    className="bg-slate-950 border-slate-800 focus:border-blue-500"
                    placeholder="e.g. ASUS" 
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400">Category</Label>
                <Input 
                  className="bg-slate-950 border-slate-800 focus:border-blue-500"
                  placeholder="e.g. GPU" 
                  value={formData.categoryName}
                  onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Selling Price ($)</Label>
                  <Input 
                    className="bg-slate-950 border-slate-800 focus:border-blue-500 text-green-400 font-mono"
                    type="number" 
                    placeholder="0.00" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Cost Price ($)</Label>
                  <Input 
                    className="bg-slate-950 border-slate-800 focus:border-blue-500 font-mono"
                    type="number" 
                    placeholder="0.00" 
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-500 btn-glow py-6 font-bold text-lg">
              CONFIRM ENTRY
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl border-l-4 border-blue-500">
          <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Stock Value</div>
          <div className="text-3xl font-black text-white">$45,200.00</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border-l-4 border-purple-500">
          <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Items in Stock</div>
          <div className="text-3xl font-black text-white">{products.length} Units</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border-l-4 border-green-500">
          <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Today's Sales</div>
          <div className="text-3xl font-black text-white">$0.00</div>
        </div>
      </div>

      {/* MAIN TABLE */}
      <Card className="glass-card border-none rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-white/5 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold tracking-wide flex items-center gap-2">
              <Monitor className="text-blue-400" /> LIVE INVENTORY
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search database..." 
                className="pl-10 bg-black/20 border-white/10 focus:border-blue-500 rounded-xl" 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-slate-400 font-bold">ITEM NAME</TableHead>
                <TableHead className="text-slate-400 font-bold">BRAND</TableHead>
                <TableHead className="text-slate-400 font-bold">CATEGORY</TableHead>
                <TableHead className="text-right text-slate-400 font-bold">PRICE</TableHead>
                <TableHead className="text-right text-slate-400 font-bold">STOCK</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center h-64 text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Cpu className="h-12 w-12 mb-4 text-slate-700 animate-pulse" />
                      <p className="text-lg font-medium">System Empty</p>
                      <p className="text-sm opacity-50">Add inventory to begin tracking</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product: any) => (
                  <TableRow key={product.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-bold text-white">{product.name}</TableCell>
                    <TableCell className="text-slate-300">{product.brand}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                        {product.category?.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-green-400 font-bold text-lg">
                      ${Number(product.price).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-slate-300">{product.stockItems?.length || 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default App