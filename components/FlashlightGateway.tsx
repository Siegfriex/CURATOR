
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onEnter: () => void;
}

export const FlashlightGateway: React.FC<Props> = ({ onEnter }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePos = (clientX: number, clientY: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: clientX - rect.left,
        y: clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updatePos(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    updatePos(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <motion.div 
      ref={containerRef}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 w-[280px] h-full bg-gray-950 z-50 border-l border-white/10 cursor-none overflow-hidden group hidden md:block"
      onMouseMove={handleMouseMove}
      onClick={onEnter}
    >
      {/* Base Dark Layer with Particles */}
      <div className="absolute inset-0 bg-gray-950">
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
         
         {/* Data Stream Line */}
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>

      {/* Revealed Content Layer (Masked) */}
      <div 
        className="absolute inset-0 flex items-center justify-center bg-black"
        style={{
          maskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black 100%, transparent 0%)`,
          WebkitMaskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, black 100%, transparent 0%)`
        }}
      >
         <div className="text-center">
            <h3 className="text-white font-serif text-3xl italic mb-2 animate-pulse">Enter The Timeline</h3>
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em]">Click to Sync</p>
         </div>
         
         {/* Visual Noise within Spotlight */}
         <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }}
         />
      </div>

      {/* Cursor Follower */}
      <div 
        className="fixed w-4 h-4 border border-white rounded-full pointer-events-none mix-blend-difference z-[60]"
        style={{ 
           left: containerRef.current ? containerRef.current.getBoundingClientRect().left + mousePos.x : -100,
           top: containerRef.current ? containerRef.current.getBoundingClientRect().top + mousePos.y : -100,
           transform: 'translate(-50%, -50%)'
        }}
      />
    </motion.div>
  );
};

// Mobile Version of Gateway (Bottom Bar)
export const FlashlightGatewayMobile: React.FC<Props> = ({ onEnter }) => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed bottom-0 left-0 w-full h-20 bg-gray-950 z-50 border-t border-white/10 flex items-center justify-between px-6 md:hidden"
      onClick={onEnter}
    >
       <div className="flex flex-col">
          <span className="text-white font-serif text-xl italic">Enter Timeline</span>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest">Tap to Sync</span>
       </div>
       <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center animate-pulse">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
       </div>
    </motion.div>
  );
}
