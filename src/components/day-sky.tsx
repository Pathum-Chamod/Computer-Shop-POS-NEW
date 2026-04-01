import React from 'react';

export const DaySky = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#124b8f] via-[#2178d1] to-[#71c3ff] pointer-events-none">

      {/* --- 1. CLOUDS IN THE DEEP BACKGROUND --- */}
      <div className="absolute inset-0 opacity-40 z-0">
        <div className="absolute top-[5%] left-[-20%] w-[600px] h-[100px] bg-white rounded-[100%] blur-[40px] animate-[slideRight_160s_linear_infinite]" />
        <div className="absolute top-[40%] left-[-30%] w-[800px] h-[150px] bg-white rounded-[100%] blur-[60px] animate-[slideRight_220s_linear_infinite_20s]" />
        <div className="absolute top-[70%] left-[-40%] w-[1000px] h-[200px] bg-white rounded-[100%] blur-[80px] animate-[slideRight_180s_linear_infinite_50s]" />
      </div>

      {/* --- 2. THE SUN (FOREGROUND) --- */}
      <div className="absolute top-[10%] left-[70%] w-0 h-0 flex items-center justify-center z-10">

        {/* High-fidelity Atmospheric Glow */}
        <div className="absolute w-[800px] h-[800px] rounded-full mix-blend-screen opacity-50" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, rgba(150,210,255,0.1) 30%, transparent 60%)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[20px]" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(200,230,255,0.3) 40%, transparent 70%)' }} />

        {/* Blinding White Core (Much Smaller Now) */}
        <div className="absolute w-12 h-12 bg-white rounded-full shadow-[0_0_60px_20px_rgba(255,255,255,1),0_0_120px_40px_rgba(255,255,255,0.8),0_0_200px_80px_rgba(200,230,255,0.5)]" />

        {/* --- LIVE MOVING RAYS --- */}
        {/* Layer 1: Main Star cross - Slow Spin */}
        <div className="absolute flex items-center justify-center animate-[spin_100s_linear_infinite] mix-blend-screen">
          <div className="absolute w-[2px] h-[800px] bg-gradient-to-b from-transparent via-white to-transparent blur-[1px] opacity-90 animate-[shimmerPulse_4s_ease-in-out_infinite]" />
          <div className="absolute w-[800px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] opacity-90 animate-[shimmerPulse_4s_ease-in-out_infinite_1s]" />

          <div className="absolute w-[2px] h-[600px] bg-gradient-to-b from-transparent via-white to-transparent blur-[1px] opacity-60 animate-[shimmerPulse_3s_ease-in-out_infinite]" style={{ transform: 'rotate(45deg)' }} />
          <div className="absolute w-[2px] h-[600px] bg-gradient-to-b from-transparent via-white to-transparent blur-[1px] opacity-60 animate-[shimmerPulse_3s_ease-in-out_infinite_1.5s]" style={{ transform: 'rotate(-45deg)' }} />
        </div>

        {/* Layer 2: Fast Shimmering Thinner Rays - Reverse Spin */}
        <div className="absolute flex items-center justify-center animate-[spin_40s_linear_infinite_reverse] mix-blend-screen opacity-70">
          {[15, 30, 60, 75, 105, 120, 150, 165].map((deg, i) => (
            <div
              key={deg}
              className="absolute w-[1px] bg-gradient-to-b from-transparent via-white to-transparent"
              style={{
                height: deg % 2 === 0 ? '700px' : '400px',
                transform: `rotate(${deg}deg)`,
                animation: `shimmerPulse ${2 + (i % 3)}s ease-in-out infinite ${i * 0.5}s`
              }}
            />
          ))}
        </div>

        {/* Camera Lens Flare Artifacts */}
        <div className="absolute w-[1000px] h-[1000px] transform origin-center rotate-[35deg] pointer-events-none opacity-80">
          <div className="absolute top-[50%] left-[50%] w-[600px] h-[1px] bg-gradient-to-r from-white/30 to-transparent blur-[1px]" />

          <div className="absolute top-[50%] left-[60%] w-12 h-12 -translate-y-1/2 rounded-full border border-blue-200/20 bg-blue-300/10 backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
          <div className="absolute top-[50%] left-[65%] w-20 h-20 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[4px]" />
          <div className="absolute top-[50%] left-[75%] w-8 h-8 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 blur-[1px]" />
          <div className="absolute top-[50%] left-[85%] w-3 h-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.8)]" />
        </div>
      </div>

      <style>
        {`
          @keyframes slideRight {
            0% { transform: translateX(-50vw); }
            100% { transform: translateX(150vw); }
          }
          @keyframes shimmerPulse {
            0%, 100% { opacity: 0.8; transform: scale(1) translateZ(0); }
            50% { opacity: 0.3; transform: scale(0.9) translateZ(0); }
          }
        `}
      </style>
    </div>
  );
};

