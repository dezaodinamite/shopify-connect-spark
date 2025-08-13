import React from 'react';

const FloatingJabuticabas = () => {
  // Generate random positions and durations for each jabuticaba
  const jabuticabas = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 20,
    animationDuration: 15 + Math.random() * 10,
    size: 0.5 + Math.random() * 1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {jabuticabas.map((jabuticaba) => (
        <div
          key={jabuticaba.id}
          className="absolute opacity-10 animate-float"
          style={{
            left: `${jabuticaba.left}%`,
            animationDelay: `${jabuticaba.animationDelay}s`,
            animationDuration: `${jabuticaba.animationDuration}s`,
            transform: `scale(${jabuticaba.size})`,
          }}
        >
          {/* Jabuticaba shape */}
          <div className="relative">
            {/* Main fruit body */}
            <div 
              className="w-6 h-6 bg-gradient-to-br from-purple-800 to-purple-950 rounded-full shadow-lg"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #6B46C1, #3C1B6B, #1E0B36)',
              }}
            >
              {/* Shine effect */}
              <div 
                className="absolute top-1 left-1 w-2 h-2 bg-white/30 rounded-full blur-[0.5px]"
              />
            </div>
            {/* Small crown/stem */}
            <div 
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingJabuticabas;