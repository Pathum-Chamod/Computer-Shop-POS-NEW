import React from 'react';

export const DaySky = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-sky-400 via-sky-200 to-amber-50 pointer-events-none">
      {/* Sun glow effect */}
      <div className="absolute top-[10%] right-[15%] w-64 h-64 bg-yellow-200/40 rounded-full blur-[60px]" />
      
      {/* Sun */}
      <div className="absolute top-[15%] right-[20%] w-32 h-32 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full shadow-[0_0_80px_30px_rgba(253,224,71,0.6)] flex items-center justify-center">
        {/* Sun rays rotating */}
        <div className="absolute inset-[-60%] rounded-full animate-[spin_40s_linear_infinite] opacity-60">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-[3px] h-[100%] bg-gradient-to-t from-transparent via-yellow-100 to-transparent origin-center -translate-x-1/2 -translate-y-1/2 blur-[2px]"
              style={{ transform: `translate(-50%, -50%) rotate(${i * 30}deg)` }}
            />
          ))}
        </div>
      </div>

      {/* Animated Clouds */}
      <div className="absolute top-[20%] left-[-20%] animate-[slideRight_60s_linear_infinite]">
        <div className="w-[300px] h-[80px] bg-white rounded-full opacity-70 blur-2xl" />
        <div className="absolute top-[-30px] left-[50px] w-[200px] h-[100px] bg-white rounded-full opacity-80 blur-2xl" />
      </div>

      <div className="absolute top-[50%] left-[-30%] animate-[slideRight_80s_linear_infinite_10s]">
        <div className="w-[400px] h-[120px] bg-white rounded-full opacity-50 blur-3xl" />
      </div>

      <div className="absolute top-[10%] left-[-10%] animate-[slideRight_45s_linear_infinite_20s]">
        <div className="w-[200px] h-[60px] bg-white rounded-full opacity-60 blur-xl" />
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
