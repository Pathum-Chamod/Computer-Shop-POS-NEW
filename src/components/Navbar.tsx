import { ShoppingCart, Monitor, History, Home, LogOut } from 'lucide-react'

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onExit: () => void;
}

export function Navbar({ activePage, onNavigate, onExit }: NavbarProps) {
  const navItems = [
    { id: 'sales', label: 'Billing', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Monitor },
    { id: 'history', label: 'History', icon: History },
  ]

  return (
    <div className="w-24 fixed left-0 top-0 h-screen bg-[#020617] border-r border-white/10 flex flex-col items-center py-6 z-50 shadow-2xl">
      
      {/* DASHBOARD EXIT BUTTON */}
      <button 
        onClick={onExit}
        className="mb-8 p-3 rounded-xl bg-white/5 text-slate-400 hover:bg-blue-600 hover:text-white transition-all group relative"
      >
        <Home className="w-6 h-6" />
        <span className="absolute left-16 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
          Back to Dashboard
        </span>
      </button>

      <div className="w-10 h-[1px] bg-white/10 mb-8" />

      {/* NAVIGATION ITEMS */}
      <div className="space-y-6 flex flex-col w-full px-2">
        {navItems.map((item) => {
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative group flex flex-col items-center gap-2 py-3 rounded-xl transition-all duration-300
                ${isActive ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon className={`h-6 w-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wide ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-auto">
        {/* Optional Bottom Actions */}
      </div>
    </div>
  )
}