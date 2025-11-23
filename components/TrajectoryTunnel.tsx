
import React, { useRef, useEffect, useState } from 'react';
import { ComparativeTrajectory } from '../types';
import { DualAreaChartComponent } from './DualAreaChartComponent';
import { COLORS } from '../constants';

interface Props {
  data: ComparativeTrajectory;
  artist1Name: string;
  artist2Name: string;
  birthYear1?: number;
  birthYear2?: number;
}

export const TrajectoryTunnel: React.FC<Props> = ({ data, artist1Name, artist2Name, birthYear1, birthYear2 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 1. Mouse Tracking for Spotlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
       setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 2. D3-style Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const init = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };
    init();

    const particles: {x: number, y: number, vx: number, vy: number, size: number}[] = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
       particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 2 + 1
       });
    }

    let animationFrame: number;
    const animate = () => {
       ctx.clearRect(0, 0, width, height);
       ctx.fillStyle = '#0a0a0a'; // Match background
       ctx.fillRect(0, 0, width, height);

       // Draw particles
       particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fill();

          // Connections
          for (let j = i + 1; j < particles.length; j++) {
             const p2 = particles[j];
             const dx = p.x - p2.x;
             const dy = p.y - p2.y;
             const dist = Math.sqrt(dx*dx + dy*dy);
             if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - dist/150)})`;
                ctx.stroke();
             }
          }
       });
       
       animationFrame = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
       init();
    };
    window.addEventListener('resize', handleResize);

    return () => {
       cancelAnimationFrame(animationFrame);
       window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
        
         {/* Background Canvas */}
         <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
         
         {/* Spotlight Effect (CSS Mask) */}
         <div 
            className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
            style={{
               background: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
            }}
         />
         
         {/* Header Overlay */}
         <div className="absolute top-0 left-0 w-full p-12 z-20 flex justify-between items-end pointer-events-none">
            <div>
               <span className="text-[#3B82F6] text-xs font-bold uppercase tracking-[0.2em] mb-2 block">02 — Chronological Analysis</span>
               <h2 className="text-5xl md:text-7xl font-serif text-white italic">Lifelong<br/>Trajectory</h2>
            </div>
            <div className="text-right text-[10px] uppercase tracking-widest text-gray-400">
               <p>Comparative Overlay</p>
               <p>{artist1Name} vs {artist2Name}</p>
            </div>
         </div>

         {/* Full Screen Chart Container - No Scroll, Panoramic */}
         <div className="relative z-20 w-full h-full flex items-center justify-center pt-24 pb-12 px-8 md:px-16">
              <DualAreaChartComponent 
                  data={data.data}
                  artist1Name={artist1Name}
                  artist2Name={artist2Name}
                  color1={COLORS.primary}
                  color2={COLORS.comparison}
                  birthYear1={birthYear1}
                  birthYear2={birthYear2}
              />
         </div>

         {/* Custom Ring Cursor Follower */}
         <div 
            className="fixed w-8 h-8 border border-[#3B82F6] rounded-full pointer-events-none z-50 transition-transform duration-75 ease-out mix-blend-screen hidden md:block"
            style={{ 
               left: mousePos.x, 
               top: mousePos.y,
               transform: 'translate(-50%, -50%)'
            }}
         />
    </div>
  );
};
