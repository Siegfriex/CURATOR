
import React, { useEffect, useRef, useState } from 'react';
import { TimelineData, TimelineEvent, TimelineContext, Masterpiece } from '../types';
import { generateEventImage } from '../services/geminiService';

interface Props {
  data: TimelineData;
  artistName: string;
  onClose: () => void;
}

// --- Internal Components ---

const ContextBar = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-2">
    <div className="flex justify-between text-[8px] uppercase tracking-widest text-gray-400 mb-1">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="w-full h-[2px] bg-white/10">
      <div className="h-full bg-white transition-all duration-1000" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const LoadingVisual = () => {
  const [text, setText] = useState("INITIALIZING");
  const words = ["RETRIEVING DATA", "SCANNING ARCHIVE", "RECONSTRUCTING IMAGE", "RENDERING", "PROCESSING"];
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(words[i % words.length]);
      i++;
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 space-y-3">
       <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin"></div>
       <span className="text-[9px] font-mono tracking-widest text-white/70 animate-pulse">{text}</span>
    </div>
  );
};

// Enhanced Lake/Ripple Effect using simple Wave Equation on Canvas
const RippleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, moved: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let tick = 0;
    let animationFrameId: number;
    
    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const draw = () => {
      // Clear with a slight trail effect or just clear
      ctx.clearRect(0, 0, width, height);
      tick += 0.02;

      // Create a gradient background first
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#000000');
      grad.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Optimization: Only animate heavily if mouse moved recently or just keep base wave
      // Draw "Liquid" lines
      ctx.lineWidth = 1;
      const lineCount = 15; // Reduced from 20 for performance
      
      for(let i = 0; i < lineCount; i++) {
         ctx.beginPath();
         const yBase = (height / lineCount) * i;
         
         // Optimization: Pre-calculate alpha
         const alpha = 0.03 + (i/lineCount)*0.05;
         ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
         
         // Increase step size for performance (from 30 to 40)
         for(let x = 0; x <= width; x += 40) {
            // Distance from mouse effect
            const dx = x - mouseRef.current.x;
            
            // Optimization: Skip expensive Math.sqrt/sin calculations if far from mouse
            let interaction = 0;
            if (Math.abs(dx) < 300) {
                const dy = yBase - mouseRef.current.y;
                // Only calculate exact dist if within vertical range roughly
                if (Math.abs(dy) < 300) {
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const maxDist = 300;
                    if (dist < maxDist) {
                        interaction = Math.sin(dist * 0.05 - tick * 2) * ((maxDist - dist)/5);
                    }
                }
            }
            
            // Base wave
            const wave = Math.sin(x * 0.01 + tick + i) * 10;
            
            const y = yBase + wave + interaction;
            
            if(x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
         }
         ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
       // No complex logic here, just update refs
       mouseRef.current.x = e.clientX;
       mouseRef.current.y = e.clientY;
       mouseRef.current.moved = true;
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    draw();

    return () => {
       window.removeEventListener('resize', init);
       window.removeEventListener('mousemove', handleMouseMove);
       cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[15]" />;
};

interface TimelineCardProps {
  event: TimelineEvent; 
  yPos: number; 
  xPercent: number; 
}

const TimelineCard: React.FC<TimelineCardProps> = ({ event, yPos, xPercent }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'VISUAL' | 'CONTEXT'>('VISUAL');
  const [locked, setLocked] = useState(false); 
  const [isHovered, setIsHovered] = useState(false);

  const handleGenerate = async () => {
    if (imgUrl || loading || !event.visualPrompt) return;
    setLoading(true);
    try {
      const url = await generateEventImage(event.visualPrompt);
      if (url) {
        setImgUrl(url);
      } else {
        setImgUrl(`https://picsum.photos/seed/${event.year}/800/600?grayscale`);
      }
    } catch (e) {
      setImgUrl(`https://picsum.photos/seed/${event.year}/800/600?grayscale`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((isHovered || locked) && !imgUrl && !loading) {
      handleGenerate();
    }
  }, [isHovered, locked]);

  const isActive = locked || isHovered;

  const screenH = window.innerHeight;
  const isLow = yPos > (screenH * 0.6);

  return (
    <div 
      className="absolute z-30"
      style={{ top: `${yPos}px`, left: `${xPercent}%` }}
    >
      <div 
         className="relative flex items-center justify-center cursor-pointer group -translate-x-1/2 -translate-y-1/2 w-32 h-32" 
         onClick={(e) => { e.stopPropagation(); setLocked(!locked); }}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
         <div className={`absolute w-full h-full bg-white/5 rounded-full blur-xl transition-all duration-500 pointer-events-none ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
         <div className={`w-2 h-2 bg-white rounded-full transition-all duration-300 z-40 relative shadow-[0_0_10px_white] ${isActive ? 'bg-white border-[2px] border-black scale-[1.5]' : 'group-hover:scale-150'}`}></div>
      </div>

      <div 
        className={`
          absolute w-72 bg-[#0a0a0a] border border-white/20 backdrop-blur-xl
          transform transition-all duration-500 cubic-bezier(0.19, 1, 0.22, 1)
          ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'}
          ${isLow ? 'bottom-12 translate-y-4' : 'top-12 -translate-y-4'} -left-36
          z-50 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden rounded-sm
        `}
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
         <button 
            onClick={(e) => { e.stopPropagation(); setLocked(false); setIsHovered(false); }}
            className="absolute top-2 right-2 z-[60] text-white/30 hover:text-white p-2 transition-colors"
         >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
         </button>

         <div className="flex border-b border-white/10 pr-8">
            <button 
              onMouseEnter={() => setViewMode('VISUAL')}
              className={`flex-1 py-3 text-[8px] uppercase tracking-[0.2em] transition-colors ${viewMode === 'VISUAL' ? 'bg-white text-black font-bold' : 'bg-transparent text-gray-500 hover:text-white'}`}
            >
              Visual
            </button>
            <button 
              onMouseEnter={() => setViewMode('CONTEXT')}
              className={`flex-1 py-3 text-[8px] uppercase tracking-[0.2em] transition-colors ${viewMode === 'CONTEXT' ? 'bg-white text-black font-bold' : 'bg-transparent text-gray-500 hover:text-white'}`}
            >
              Context
            </button>
         </div>

         <div className="h-40 relative bg-[#050505]">
            {viewMode === 'VISUAL' ? (
               <>
                 {imgUrl ? (
                   <img src={imgUrl} alt="Generated" className="w-full h-full object-cover opacity-90 animate-fade-in" />
                 ) : (
                   loading ? <LoadingVisual /> : (
                     <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-600 uppercase tracking-widest">
                        Awaiting Visualization...
                     </div>
                   )
                 )}
               </>
            ) : (
               <div className="p-6 h-full overflow-y-auto custom-scrollbar bg-gradient-to-br from-gray-900 to-black">
                 {event.context ? (
                   <div className="space-y-3">
                      <ContextBar label="Market Value" value={event.context.marketValue} />
                      <ContextBar label="Critical Acclaim" value={event.context.criticalAcclaim} />
                      <ContextBar label="Historical" value={event.context.historical} />
                      <ContextBar label="Social Impact" value={event.context.socialImpact} />
                      <ContextBar label="Institutional" value={event.context.institutional} />
                   </div>
                 ) : (
                   <div className="flex items-center justify-center h-full text-gray-600 text-[9px]">NO DATA</div>
                 )}
               </div>
            )}
         </div>

         <div className="p-4 bg-[#0a0a0a] border-t border-white/10">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-serif text-xl text-white italic">{event.year}</span>
              <span className="text-[7px] uppercase tracking-widest text-gray-400 border border-white/20 px-1.5 py-0.5">
                {event.category}
              </span>
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-white mb-1 line-clamp-1">{event.title}</h4>
            <p className="text-[9px] leading-relaxed text-gray-400 font-light line-clamp-2 break-keep">
              {event.description}
            </p>
         </div>
      </div>
    </div>
  );
};

interface GalleryItemProps {
  artwork: Masterpiece;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ artwork }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const url = await generateEventImage(artwork.visualPrompt);
        if (mounted) {
           if (url) {
             setSrc(url);
           } else {
             setSrc(`https://picsum.photos/seed/${artwork.title.length}/800/800?grayscale`);
           }
        }
      } catch (e) {
         if (mounted) setSrc(`https://picsum.photos/seed/${artwork.title.length}/800/800?grayscale`);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [artwork]);

  return (
    <div className="flex-shrink-0 w-[300px] h-[300px] relative border border-white/10 group overflow-hidden">
       {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
             <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
       ) : (
          <img src={src!} alt={artwork.title} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
       )}
       <div className="absolute bottom-0 left-0 w-full bg-black/80 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h4 className="font-serif text-lg text-white">{artwork.title}</h4>
          <span className="text-[9px] font-mono text-gray-400">{artwork.year}</span>
       </div>
    </div>
  );
}

export const TimelineJourney: React.FC<Props> = ({ data, artistName, onClose }) => {
  // Safety check for data
  if (!data || !data.eras || data.eras.length === 0) {
    return (
        <div className="fixed inset-0 z-[200] bg-black text-white flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-serif italic mb-4">Timeline Data Unavailable</h2>
                <button onClick={onClose} className="text-xs uppercase tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-black">Close</button>
            </div>
        </div>
    );
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const bgGradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };
    
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollX = container.scrollLeft;
          if (bgGradientRef.current) {
            bgGradientRef.current.style.transform = `translateX(${scrollX * 0.6}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToStart = () => {
    if (containerRef.current) {
       containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  const HEADER_HEIGHT_PX = 160; 
  const FOOTER_HEIGHT_PX = 120; 
  const BOTTOM_BUFFER_PX = 250; 
  
  const calculateY = (score: number, screenHeight: number) => {
    const availableHeight = screenHeight - HEADER_HEIGHT_PX - FOOTER_HEIGHT_PX - BOTTOM_BUFFER_PX;
    const minVisScore = 60;
    const maxVisScore = 100;
    const clampedScore = Math.max(minVisScore, Math.min(maxVisScore, score));
    const normalizedRatio = (clampedScore - minVisScore) / (maxVisScore - minVisScore);
    return HEADER_HEIGHT_PX + ((1 - normalizedRatio) * availableHeight);
  };

  const generateAreaPath = (totalWidthPixels: number, screenHeight: number) => {
    if (!data.eras || data.eras.length === 0) return '';
    const points: {x: number, highY: number, lowY: number}[] = [];
    const screenW = window.innerWidth;

    data.eras.forEach((era, eraIndex) => {
      const eraDuration = era.endYear - era.startYear;
      era.events.forEach((event) => {
        const yearOffset = event.year - era.startYear;
        const percentThroughEra = eraDuration > 0 ? yearOffset / eraDuration : 0.5;
        const activeWidth = screenW * 0.8;
        const paddingLeft = screenW * 0.1;
        const x = (eraIndex * screenW) + paddingLeft + (percentThroughEra * activeWidth);
        
        const highVal = event.auctionHigh ?? (event.impactScore + 5);
        const lowVal = event.auctionLow ?? (event.impactScore - 5);
        
        points.push({
          x, 
          highY: calculateY(highVal, screenHeight),
          lowY: calculateY(lowVal, screenHeight)
        });
      });
    });

    points.sort((a, b) => a.x - b.x);

    if (points.length > 1) {
      let d = `M ${points[0].x} ${points[0].highY}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cp = (p1.x - p0.x) / 2;
        d += ` C ${p0.x + cp} ${p0.highY}, ${p1.x - cp} ${p1.highY}, ${p1.x} ${p1.highY}`;
      }
      for (let i = points.length - 1; i > 0; i--) {
         const p1 = points[i];
         const p0 = points[i - 1];
         const cp = (p1.x - p0.x) / 2;
         d += ` L ${p1.x} ${p1.lowY}`;
         d += ` C ${p1.x - cp} ${p1.lowY}, ${p0.x + cp} ${p0.lowY}, ${p0.x} ${p0.lowY}`;
      }
      d += ` Z`;
      return d;
    }
    return '';
  };

  const totalEras = data.eras.length;

  return (
    <div className="fixed inset-0 z-[200] bg-black text-white overflow-hidden animate-fade-in font-sans selection:bg-white selection:text-black">
      
      <RippleBackground />

      <div className="fixed top-0 left-0 z-[150] p-8 w-full flex justify-between items-start pointer-events-none mix-blend-difference h-[120px]">
         <div>
           <h2 className="font-serif text-4xl italic tracking-tight text-white">{artistName}</h2>
           <div className="flex items-center gap-3 mt-2">
             <div className="w-8 h-[1px] bg-white"></div>
             <p className="text-[9px] uppercase tracking-[0.3em] text-white">Chronological Impact Analysis</p>
           </div>
         </div>
      </div>

      <button 
        onClick={onClose}
        className="fixed top-8 right-8 z-[200] px-6 py-3 bg-white text-black border border-transparent hover:border-white hover:bg-black hover:text-white transition-all duration-300 text-[10px] uppercase tracking-widest"
      >
        Close Timeline [ESC]
      </button>

      <div className="fixed bottom-0 left-0 z-[150] w-full border-t border-white/10 bg-black/80 backdrop-blur-md h-[120px] px-8 flex justify-between items-center text-[9px] uppercase tracking-widest text-gray-400 pointer-events-none">
         <div className="flex gap-4">
            <span className="text-white font-bold">Sources:</span>
            {(data as any).sources && (data as any).sources.length > 0 
               ? (data as any).sources.map((s: string, i: number) => <span key={i}>{s}</span>)
               : <span>Historical Auctions • Institutional Archives • Gemini AI</span>
            }
         </div>
         <div className="animate-pulse">
            <span>SCROLL TO NAVIGATE ERA</span>
         </div>
      </div>

      <div 
        ref={containerRef}
        className="w-full h-full overflow-x-auto overflow-y-hidden flex items-stretch relative scroll-smooth cursor-grab active:cursor-grabbing"
      >
        {/* Background Text Layer */}
        <div 
           className="absolute top-0 left-0 h-full flex pointer-events-none z-0"
           style={{ width: `${(totalEras + 2) * 100}vw` }}
        >
            {data.eras.map((era, index) => (
              <div key={index} className="w-[100vw] h-full relative">
                 <div className="absolute bottom-[20%] right-[10%] opacity-10 mix-blend-overlay">
                    <span className="font-serif text-[20vw] leading-none text-white whitespace-nowrap blur-sm">
                       {era.ageRange}
                    </span>
                 </div>
              </div>
           ))}
        </div>

        {/* Background Gradient Layer */}
        <div 
           ref={bgGradientRef}
           className="absolute top-0 left-0 h-full flex pointer-events-none z-0"
           style={{ width: `${(totalEras + 2) * 100}vw`, willChange: 'transform' }}
        >
           {data.eras.map((era, index) => (
              <div key={index} className="w-[100vw] h-full relative border-r border-white/5">
                 <div 
                   className="absolute inset-0 opacity-20"
                   style={{ background: `radial-gradient(circle at 50% 50%, ${era.moodColor}44 0%, transparent 70%)` }}
                 />
              </div>
           ))}
           <div className="w-[200vw] h-full bg-black relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black to-[#050505]"></div>
           </div>
        </div>

        {/* Chart Layer - AREA GRAPH */}
        <div className="absolute top-0 left-0 h-full pointer-events-none z-20" style={{ width: `${totalEras * 100}vw` }}>
          <svg width="100%" height="100%" preserveAspectRatio="none" style={{ maskImage: 'linear-gradient(to right, black 90%, transparent 100%)' }}>
            <defs>
               <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="white" stopOpacity="0.05" />
               </linearGradient>
            </defs>
            
            <path 
              d={generateAreaPath(window.innerWidth * totalEras, window.innerHeight)} 
              fill="url(#areaGradient)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1"
              className="drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            />

            {data.eras.map((era, eraIndex) => (
              era.events.map((event, i) => {
                 const screenW = window.innerWidth;
                 const eraDuration = era.endYear - era.startYear;
                 const yearOffset = event.year - era.startYear;
                 const percent = eraDuration > 0 ? yearOffset / eraDuration : 0.5;
                 const x = (eraIndex * screenW) + (screenW * 0.1) + (percent * (screenW * 0.8));
                 
                 // Vertical Indicator Line
                 const highY = calculateY(event.auctionHigh ?? event.impactScore, window.innerHeight);
                 const lowY = calculateY(event.auctionLow ?? event.impactScore, window.innerHeight);
                 
                 return (
                   <line 
                     key={`${eraIndex}-${i}`}
                     x1={x} y1={highY} x2={x} y2={lowY} 
                     stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" 
                   />
                 );
              })
            ))}
          </svg>
        </div>

        {data.eras.map((era, index) => (
          <div key={index} className="w-[100vw] h-full flex-shrink-0 relative z-30">
            <div className="absolute top-[18%] left-[10%] max-w-lg z-10 pointer-events-none">
               <div className="flex items-center gap-4 mb-6">
                  <div className="px-3 py-1 border border-white/30 text-[10px] uppercase tracking-widest backdrop-blur-sm text-white">
                    Chapter {index + 1}
                  </div>
                  <span className="text-white/50 text-xs font-mono">{era.startYear} — {era.endYear}</span>
               </div>
               <h3 className="font-serif text-5xl mb-4 text-white leading-tight">{era.eraLabel}</h3>
               <p className="text-sm font-light leading-relaxed text-gray-400 border-l border-white/30 pl-6 break-keep">
                 {era.summary}
               </p>
            </div>

            {era.events.map((event, evtIdx) => {
               const screenH = window.innerHeight;
               // Re-calculate X percent for React rendering to match SVG logic
               // Note: This duplicates logic from generateAreaPath, ideally refactor to shared helper
               const eraDuration = era.endYear - era.startYear;
               const yearOffset = event.year - era.startYear;
               const percentRaw = eraDuration > 0 ? yearOffset / eraDuration : 0.5;
               // Map 0-1 to 10-90% of screen width
               const xPercent = 10 + (percentRaw * 80); 
               
               const yVal = calculateY(event.auctionHigh ?? event.impactScore, screenH);

               return (
                 <TimelineCard 
                   key={evtIdx} 
                   event={event} 
                   yPos={yVal} 
                   xPercent={xPercent} 
                 />
               );
            })}
          </div>
        ))}

        {/* Final Sections */}
        <div className="w-[100vw] h-full flex-shrink-0 relative z-30 flex items-center justify-center bg-black border-l border-white/5">
           <div className="max-w-6xl w-full px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                 <h2 className="font-serif text-5xl text-white mb-6">Legacy &<br/>Critical Reception</h2>
                 <div className="w-12 h-1 bg-white mb-8"></div>
              </div>
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                 {data.critiques && data.critiques.length > 0 ? (
                   data.critiques.map((quote, i) => (
                     <div key={i} className="border border-white/20 p-8 backdrop-blur-sm hover:bg-white/5 transition-colors">
                        <div className="mb-4 text-4xl font-serif text-white/20">“</div>
                        <p className="text-lg font-serif italic text-gray-300 mb-6 leading-relaxed break-keep">
                          {quote.text}
                        </p>
                        <div className="flex flex-col text-[9px] uppercase tracking-widest">
                           <span className="text-white font-bold">{quote.author}</span>
                           <span className="text-gray-500">{quote.source}</span>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="col-span-2 flex items-center justify-center text-gray-500 italic font-serif">
                      Awaiting critical data aggregation.
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="w-[100vw] h-full flex-shrink-0 relative z-30 flex flex-col items-center justify-center bg-[#050505] border-l border-white/5">
           <div className="w-full max-w-[1600px] px-12">
              <h2 className="font-serif text-4xl text-white mb-12 text-center">Masterpiece Archive</h2>
              <div className="flex overflow-x-auto gap-12 pb-12 justify-center custom-scrollbar">
                 {data.masterpieces?.map((artwork, i) => (
                   <GalleryItem key={i} artwork={artwork} />
                 ))}
              </div>
              <div className="flex justify-center mt-12">
                 <button 
                    onClick={scrollToStart}
                    className="px-8 py-4 border border-white/20 text-white text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
                 >
                    Return to Beginning
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
