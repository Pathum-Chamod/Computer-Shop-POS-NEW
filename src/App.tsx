import { useState } from 'react'
import { Receipt, PackageCheck, BarChart3, ShieldCheck, Sun, Moon, Settings, Wrench } from 'lucide-react'

// Components
import { InventoryPage } from "./components/InventoryPage"
import { SalesPage } from "./components/SalesPage"
import { HistoryPage } from "./components/HistoryPage" // Import the new page
import { Navbar } from "./components/Navbar"
import { ShootingStars } from "./components/ShootingStars"
import { StarsBackground } from "./components/stars-background"
import { DaySky } from "./components/day-sky"

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)

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
    },
    { 
      title: "Manage", 
      desc: "Users & Settings", 
      icon: Settings, 
      color: "text-rose-400", 
      bg: "bg-rose-500/10", 
      border: "border-rose-500/20",
      action: () => console.log("Navigate to Manage")
    },
    { 
      title: "Repair", 
      desc: "Service Tickets", 
      icon: Wrench, 
      color: "text-amber-400", 
      bg: "bg-amber-500/10", 
      border: "border-amber-500/20",
      action: () => console.log("Navigate to Repair")
    }
  ]

  return (
    <div className={`h-screen font-sans selection:bg-blue-500/30 relative overflow-hidden flex flex-col transition-colors duration-500 ${isDarkMode ? 'text-slate-100 dark bg-[#030712]' : 'text-slate-800 bg-sky-50'}`}>
      
      {/* --- GLOBAL BACKGROUND --- */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-1000 ${isDarkMode ? 'bg-[#030712]' : ''}`}>
        {isDarkMode ? (
          <>
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
          </>
        ) : (
          <DaySky />
        )}
      </div>

      {/* THEME TOGGLE (Dashboard Only) */}
      {viewMode === 'dashboard' && (
        <div className="fixed top-6 right-8 z-50">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${isDarkMode ? 'bg-white/10 text-yellow-300 hover:bg-white/20' : 'bg-white/50 text-amber-500 hover:bg-white/80 shadow-sky-300'}`}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      )}

      {/* =========================================
          MODE 1: DASHBOARD (LANDING)
         ========================================= */}
      {viewMode === 'dashboard' && (
        <div className="relative z-10 flex-1 flex flex-col p-6 md:p-8 lg:p-12 overflow-y-auto animate-in fade-in zoom-in-95 duration-500">
          
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8 shrink-0">
            <div>
              <h1 className={`text-5xl md:text-7xl font-black tracking-tighter drop-shadow-[0_0_30px_rgba(59,130,246,0.4)] ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                ALFASOFT <span className="text-blue-500">SYSTEMS</span>
              </h1>
              <div className="flex items-center gap-2 mt-4 pl-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <p className={`font-bold text-xs tracking-[0.3em] uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>System Online & Ready</p>
              </div>
            </div>
          </div>

          {/* CARDS */}
          <div className="flex-1 flex items-center justify-center pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
              {mainCards.map((card, i) => (
                <div 
                  key={i} 
                  onClick={card.action}
                  className={`${isDarkMode ? 'nexus-panel border ' + card.border + ' hover:bg-white/[0.05]' : 'bg-white/80 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:bg-white/95'} h-56 p-6 rounded-3xl relative overflow-hidden group transition-all cursor-pointer hover:border-opacity-100 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between backdrop-blur-md`}                >
                  <div className={`p-4 rounded-xl w-fit ${card.bg} transition-transform group-hover:scale-110 duration-500`}>
                    <card.icon className={`h-8 w-8 md:h-10 md:w-10 ${card.color}`} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className={`text-2xl md:text-3xl font-bold tracking-tight mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{card.title}</h3>
                    <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>{card.desc}</p>
                  </div>

                  <card.icon className={`absolute -right-8 -bottom-8 h-48 w-48 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-500 ${card.color} rotate-12`} />
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
          <div className="flex-1 ml-24 h-screen flex flex-col relative overflow-hidden">
            
            {activePage === 'sales' && (
              <div className="flex-1 h-full overflow-hidden container-query-adjustments">
                <SalesPage />
              </div>
            )}

            {activePage === 'inventory' && (
              <div className="p-8 flex-1 h-full overflow-y-auto">
                <InventoryPage onBack={exitWorkspace} />
              </div>
            )}

            {activePage === 'history' && (
              <div className="flex-1 h-full overflow-y-auto">
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