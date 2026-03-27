import React from 'react';

export const DaySky = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#124b8f] via-[#2178d1] to-[#71c3ff] pointer-events-none">
      
      {/* --- REALISTIC CAMERA LENS SUN --- */}
      <div className="absolute top-[20%] left-[25%] w-0 h-0 flex flex-col items-center justify-center z-10">
        
        {/* Deep Atmospheric Glow */}
        <div className="absolute w-[1400px] h-[1400px] rounded-full mix-blend-screen opacity-60" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, rgba(150,210,255,0.1) 30%, transparent 65%)' }} />
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[20px]" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(200,230,255,0.2) 40%, transparent 70%)' }} />
        
        {/* Blinding White Core */}
        <div className="absolute w-28 h-28 bg-white rounded-full shadow-[0_0_80px_40px_rgba(255,255,255,1),0_0_200px_80px_rgba(255,255,255,0.8),0_0_400px_150px_rgba(200,230,255,0.5)]" />

        {/* Crisp Starburst Rays */}
        <div className="absolute flex items-center justify-center animate-[spin_200s_linear_infinite]">
          {/* Main vertical/horizontal */}
          <div className="absolute w-[4px] h-[1200px] bg-gradient-to-b from-transparent via-white to-transparent blur-[1px] opacity-90" />
          <div className="absolute w-[1200px] h-[4px] bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] opacity-90" />
          
          {/* Diagonals */}
          <div className="absolute w-[3px] h-[900px] bg-gradient-to-b from-transparent via-white to-transparent blur-[1px] opacity-70" style={{ transform: 'rotate(45deg)' }} />
          <div className="absolute w-[3px] h-[900px] bg-gradient-to-b from-transparent via-white to-transparent blur-[1px] opacity-70" style={{ transform: 'rotate(-45deg)' }} />

          {/* Sub-diagonals */}
          {[15, 30, 60, 75, 105, 120, 150, 165].map(deg => (
            <div key={deg} className="absolute w-[1px] h-[600px] bg-gradient-to-b from-transparent via-white to-transparent opacity-40" style={{ transform: `rotate(${deg}deg)` }} />
          ))}
        </div>

        {/* Camera Lens Flare Artifacts (Hexagons/Circles) */}
        <div className="absolute w-[2000px] h-[2000px] transform origin-center rotate-[35deg] pointer-events-none">
          {/* Ray extending opposite */}
          <div className="absolute top-[50%] left-[50%] w-[1000px] h-[2px] bg-gradient-to-r from-white/30 to-transparent blur-[1px]" />
          
          {/* Circular Flares bouncing off the lens */}
          <div className="absolute top-[50%] left-[60%] w-20 h-20 -translate-y-1/2 rounded-full border border-blue-200/20 bg-blue-300/10 backdrop-blur-sm" />
          <div className="absolute top-[50%] left-[70%] w-32 h-32 -translate-y-1/2 rounded-full bg-blue-400/10 blur-[4px]" />
          <div className="absolute top-[50%] left-[80%] w-12 h-12 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 blur-[1px]" />
          <div className="absolute top-[50%] left-[90%] w-4 h-4 -translate-y-1/2 rounded-full bg-white shadow-[0_0_15px_4px_rgba(255,255,255,0.8)]" />
        </div>
      </div>

      {/* Subtle Wispy Sky Clouds */}
      <div className="absolute inset-0 opacity-50 z-0">
        <div className="absolute top-[10%] left-[-20%] w-[1000px] h-[200px] bg-white rounded-[100%] blur-[100px] animate-[slideRight_120s_linear_infinite]" />
        <div className="absolute top-[60%] left-[-40%] w-[1200px] h-[300px] bg-white rounded-[100%] blur-[120px] animate-[slideRight_180s_linear_infinite_20s]" />
      </div>

      <style>
        {`
          @keyframes slideRight {
            0% { transform: translateX(-50vw); }
            100% { transform: translateX(150vw); }
          }
        `}
      </style>
    </div>
  );
};
