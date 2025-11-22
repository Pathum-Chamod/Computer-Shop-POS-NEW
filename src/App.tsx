import { useState } from 'react'
import { Receipt, PackageCheck, BarChart3, ShieldCheck } from 'lucide-react'

// Components
import { InventoryPage } from "./components/InventoryPage"
import { SalesPage } from "./components/SalesPage"
import { HistoryPage } from "./components/HistoryPage" // Import the new page
import { Navbar } from "./components/Navbar"
import { ShootingStars } from "./components/ShootingStars"
import { StarsBackground } from "./components/stars-background"

function App() {
  // VIEW MODES: 'dashboard' (Landing) | 'workspace' (App Interface)
  const [viewMode, setViewMode] = useState<'dashboard' | 'workspace'>('dashboard')
  
  // WORKSPACE PAGES: 'sales' | 'inventory' | 'history'
  const [activePage, setActivePage] = useState('sales')

  // Navigation Handlers
  const enterWorkspace = (page: string) => {
    setActivePage(page)
    setViewMode('workspace')
  }

  const exitWorkspace = () => {
    setViewMode('dashboard')
  }

  // Define Dashboard Cards
  const mainCards = [
    { 
      title: "Billing", 
      desc: "New Sales & Invoices", 
      icon: Receipt, 
      color: "text-blue-400", 
      bg: "bg-blue-500/10", 
      border: "border-blue-500/20",
      action: () => enterWorkspace('sales') 
    },
    { 
      title: "Inventory", 
      desc: "Stock In & Adjustments", 
      icon: PackageCheck, 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10", 
      border: "border-emerald-500/20",
      action: () => enterWorkspace('inventory')
    },
    { 
      title: "Analyzer", 
      desc: "Reports & Analytics", 
      icon: BarChart3, 
      color: "text-purple-400", 
      bg: "bg-purple-500/10", 
      border: "border-purple-500/20",
      action: () => console.log("Navigate to Analyzer")
    },
    { 
      title: "Warranty", 
      desc: "RMA & Claims", 
      icon: ShieldCheck, 
      color: "text-orange-400", 
      bg: "bg-orange-500/10", 
      border: "border-orange-500/20",
      action: () => console.log("Navigate to Warranty")
    }
  ]

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-blue-500/30 relative overflow-hidden flex flex-col">
      
      {/* --- GLOBAL BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#030712]">
        <StarsBackground 
          starDensity={0.0003} 
          allStarsTwinkle={true} 
          twinkleProbability={0.8} 
          minTwinkleSpeed={0.8} 
          maxTwinkleSpeed={1.2}
        />
        <ShootingStars 
          minSpeed={15} 
          maxSpeed={40} 
          minDelay={3000} 
          maxDelay={8000}
          starColor="#60a5fa" 
          trailColor="#3b82f6"
        />
      </div>

      {/* =========================================
          MODE 1: DASHBOARD (LANDING)
         ========================================= */}
      {viewMode === 'dashboard' && (
        <div className="relative z-10 flex-1 flex flex-col p-12 animate-in fade-in zoom-in-95 duration-500">
          
          {/* HEADER */}
          <div className="flex justify-between items-center mb-16">
            <div>
              <h1 className="text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                CODEWAVE <span className="text-blue-500">POS</span>
              </h1>
              <div className="flex items-center gap-2 mt-4 pl-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <p className="text-slate-400 font-bold text-xs tracking-[0.3em] uppercase">System Online & Ready</p>
              </div>
            </div>
          </div>

          {/* CARDS */}
          <div className="flex-1 flex items-center justify-center pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
              {mainCards.map((card, i) => (
                <div 
                  key={i} 
                  onClick={card.action}
                  className={`nexus-panel h-80 p-8 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all cursor-pointer border ${card.border} hover:border-opacity-100 hover:-translate-y-4 hover:shadow-2xl flex flex-col justify-between backdrop-blur-md`}
                >
                  <div className={`p-5 rounded-2xl w-fit ${card.bg} transition-transform group-hover:scale-110 duration-500`}>
                    <card.icon className={`h-12 w-12 ${card.color}`} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-4xl font-bold text-white tracking-tight mb-2">{card.title}</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{card.desc}</p>
                  </div>

                  <card.icon className={`absolute -right-12 -bottom-12 h-64 w-64 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-500 ${card.color} rotate-12`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* =========================================
          MODE 2: WORKSPACE (NAVBAR + CONTENT)
         ========================================= */}
      {viewMode === 'workspace' && (
        <div className="relative z-10 flex-1 flex animate-in slide-in-from-right-10 duration-500">
          
          {/* NAVBAR */}
          <Navbar 
            activePage={activePage} 
            onNavigate={setActivePage} 
            onExit={exitWorkspace} 
          />

          {/* CONTENT AREA */}
          <div className="flex-1 ml-24 overflow-y-auto h-screen">
            
            {activePage === 'sales' && (
              <div className="min-h-full">
                <SalesPage />
              </div>
            )}

            {activePage === 'inventory' && (
              <div className="p-8 min-h-full">
                <InventoryPage onBack={exitWorkspace} />
              </div>
            )}

            {activePage === 'history' && (
              <div className="min-h-full">
                 {/* THIS IS THE NEW PAGE */}
                 <HistoryPage />
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

export default App