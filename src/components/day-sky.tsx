import React from 'react';

export const DaySky = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#4facfe] to-[#00f2fe] pointer-events-none">
      {/* Hyper-Realistic 3D Sun */}
      <div className="absolute top-[8%] right-[15%] w-40 h-40 flex items-center justify-center z-0">
        
        {/* Massive atmospheric lens flare/glow extending outwards */}
        <div 
          className="absolute inset-[-400%] rounded-full mix-blend-screen animate-pulse"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 255, 200, 0.4) 0%, rgba(255, 180, 50, 0.2) 20%, transparent 60%)',
            filter: 'blur(30px)',
            animationDuration: '6s'
          }}
        />

        {/* Outer Corona / Sun rays dynamically spinning */}
        <div
          className="absolute inset-[-150%] rounded-full opacity-70 animate-[spin_60s_linear_infinite]"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,200,50,0.4) 30deg, transparent 60deg, rgba(255,180,0,0.5) 150deg, transparent 180deg, rgba(255,220,100,0.3) 240deg, transparent 270deg)',
            filter: 'blur(20px)'
          }}
        />
        <div
          className="absolute inset-[-120%] rounded-full opacity-60 animate-[spin_45s_linear_infinite_reverse]"
          style={{
            background: 'conic-gradient(from 90deg, transparent 0deg, rgba(255,150,0,0.3) 45deg, transparent 90deg, rgba(255,250,150,0.4) 200deg, transparent 250deg)',
            filter: 'blur(15px)'
          }}
        />

        {/* 3D Sun Body */}
        <div 
          className="absolute inset-0 rounded-full overflow-hidden shadow-[0_0_120px_40px_rgba(255,210,50,0.8),_0_0_200px_80px_rgba(255,120,0,0.6)]"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #ffffff 0%, #fffacc 15%, #ffcc00 45%, #ff6600 85%, #b32400 100%)',
          }}
        >
          {/* Surface Plasma Details */}
          <div 
            className="absolute inset-[-50%] opacity-50 mix-blend-overlay animate-[spin_40s_linear_infinite]"
            style={{
              background: 'repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(255,140,0,0.5) 8%, transparent 15%)',
              filter: 'blur(2px)'
            }}
          />
          <div 
            className="absolute inset-[-50%] opacity-40 mix-blend-color-dodge animate-[spin_30s_linear_infinite_reverse]"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 20%), radial-gradient(circle at 70% 60%, rgba(255,200,0,0.6) 0%, transparent 30%)',
              filter: 'blur(4px)'
            }}
          />
        </div>
      </div>

      {/* Animated Clouds */}
      <div className="absolute top-[20%] left-[-20%] animate-[slideRight_60s_linear_infinite]">
        <div className="w-[300px] h-[80px] bg-white rounded-full opacity-80 blur-[40px]" />
        <div className="absolute top-[-30px] left-[50px] w-[200px] h-[100px] bg-white rounded-full opacity-90 blur-[40px]" />
      </div>

      <div className="absolute top-[50%] left-[-30%] animate-[slideRight_90s_linear_infinite_10s]">
        <div className="w-[450px] h-[120px] bg-white rounded-full opacity-60 blur-[60px]" />
      </div>

      <div className="absolute top-[10%] left-[-10%] animate-[slideRight_50s_linear_infinite_20s]">
        <div className="w-[250px] h-[60px] bg-white rounded-full opacity-70 blur-[30px]" />
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
