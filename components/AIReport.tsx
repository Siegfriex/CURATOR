

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Artist, GroundingSource, TimelineData, AIReportResult } from '../types';
import { generateArtistReport, generateArtistTimeline } from '../services/geminiService';
import { TimelineJourney } from './TimelineJourney';

interface Props {
  artist: Artist;
}

const HighlightBox = ({ label, children, className = "" }: { label: string, children?: React.ReactNode, className?: string }) => (
  <div className={`border border-black p-6 hover:bg-gray-50 transition-colors ${className}`}>
    <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-black/10 pb-2">{label}</h4>
    {children}
  </div>
);

export const AIReport: React.FC<Props> = ({ artist }) => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<AIReportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Timeline States
  const [timelineMode, setTimelineMode] = useState(false);
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  // Drag Interaction State
  const [dragOffset, setDragOffset] = useState(0);
  const dragRef = useRef<HTMLButtonElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setReportData(null);
    try {
      const result = await generateArtistReport(artist.name);
      setReportData(result);
    } catch (err) {
      setError("Authentication Error. Please check system configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnterTimeline = async () => {
    setLoadingTimeline(true);
    try {
      if (!timelineData) {
        const data = await generateArtistTimeline(artist.name, artist.birthYear);
        setTimelineData(data);
      }
      setTimelineMode(true);
    } catch (e) {
      console.error(e);
      setError("Timeline generation failed.");
    } finally {
      setLoadingTimeline(false);
      setDragOffset(0);
    }
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const delta = startX.current - clientX;
      setDragOffset(Math.max(0, Math.min(250, delta)));
    };

    const handleEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = 'default';
      
      if (dragOffset > 120) {
        handleEnterTimeline();
      } else {
        setDragOffset(0);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [dragOffset]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (loadingTimeline) return;
    isDragging.current = true;
    startX.current = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    document.body.style.cursor = 'ew-resize';
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      
      {timelineMode && timelineData && (
         <div className="fixed inset-0 z-[200] animate-[slideInRight_0.8s_cubic-bezier(0.22,1,0.36,1)_forwards]">
            <TimelineJourney 
              data={timelineData} 
              artistName={artist.name} 
              onClose={() => setTimelineMode(false)} 
            />
         </div>
      )}

      <div className={`animate-fade-in w-full transition-transform duration-700 ${timelineMode ? '-translate-x-[20%] opacity-50 grayscale' : ''}`}>
        
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50" style={{ right: `${dragOffset}px` }}>
          {reportData && (
            <button 
              ref={dragRef}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              disabled={loadingTimeline}
              className="group relative flex items-center justify-end cursor-grab active:cursor-grabbing p-8 -mr-8" 
            >
              <span className={`absolute right-full mr-4 bg-black text-white text-[9px] uppercase tracking-widest px-3 py-2 whitespace-nowrap transition-opacity duration-300 ${dragOffset > 10 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                 {loadingTimeline ? 'INITIALIZING...' : dragOffset > 120 ? 'RELEASE TO ENTER' : '< DRAG TO EXPLORE TIMELINE'}
              </span>

              <div 
                className="relative w-0 h-0 
                border-t-[60px] border-t-transparent
                border-r-[60px] border-r-black
                border-b-[60px] border-b-transparent
                filter drop-shadow-[-4px_6px_12px_rgba(40,49,124,0.4)]
                transition-transform duration-100 ease-out
                "
                style={{ transform: `scale(${1 + (dragOffset / 300)})` }}
              >
                 <div className="absolute -right-[25px] -top-[8px] transform -rotate-45">
                    <svg className="w-6 h-6 text-white/50 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                 </div>
                 <div className="absolute -right-[60px] -top-[60px] w-0 h-0 
                   border-t-[60px] border-t-transparent
                   border-r-[60px] border-r-white/10
                   border-b-[60px] border-b-transparent
                 "></div>
              </div>
            </button>
          )}
        </div>

        <div className="border-b border-black pb-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-8 pr-12">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-6xl font-serif italic mb-4 text-black">Analysis Report</h2>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">
              Automated Curation • Gemini 2.5 Flash • Live Web Grounding
            </p>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`
              relative px-10 py-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 
              border border-black overflow-hidden group flex items-center justify-center gap-3
              ${loading ? 'bg-gray-100 text-gray-400 cursor-wait' : 'bg-white text-black hover:bg-black hover:text-white'}
            `}
          >
             {loading && (
                <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
             )}
            <span className="relative z-10">{loading ? 'PROCESSING DATA STREAM...' : 'GENERATE INTELLIGENCE'}</span>
          </button>
        </div>

        {error && (
          <div className="border border-black bg-gray-50 p-4 mb-8 flex items-center gap-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-red-600 uppercase tracking-wider">{error}</span>
          </div>
        )}

        {reportData ? (
          <div className="pr-12">
            
            <div className="mb-24 animate-fade-in">
               <div className="flex items-center gap-3 mb-8">
                   <div className="w-2 h-2 bg-black"></div>
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Curatorial Identity Matrix</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif">
                  <HighlightBox label="Curator's Note" className="md:col-span-2 bg-black text-white">
                     <p className="text-2xl italic leading-relaxed">
                       "{reportData.highlights?.curatorNotes || 'Analysis pending...'}"
                     </p>
                  </HighlightBox>
                  
                  <HighlightBox label="Archetype" className="bg-gray-50">
                     <div className="flex flex-wrap gap-2">
                        {reportData.highlights?.personalityKeywords.map((k, i) => (
                           <span key={i} className="px-3 py-1 border border-black rounded-full text-xs uppercase tracking-wide">{k}</span>
                        ))}
                     </div>
                  </HighlightBox>

                  <HighlightBox label="Key Masterpieces">
                     <ul className="list-disc list-inside space-y-2">
                        {reportData.highlights?.majorWorks.map((w, i) => (
                           <li key={i} className="text-lg">{w}</li>
                        ))}
                     </ul>
                  </HighlightBox>

                  <HighlightBox label="Style & Movement">
                     <div className="space-y-4">
                        <div>
                           <span className="text-xs text-gray-400 block mb-1">Movements</span>
                           <div className="text-lg leading-tight">{reportData.highlights?.movements.join(", ")}</div>
                        </div>
                        <div>
                           <span className="text-xs text-gray-400 block mb-1">Visual Identifiers</span>
                           <div className="text-lg leading-tight">{reportData.highlights?.style.join(" • ")}</div>
                        </div>
                     </div>
                  </HighlightBox>

                  <HighlightBox label="Contextual Peers">
                     <div className="grid grid-cols-2 gap-2">
                        {reportData.highlights?.relatedArtists.map((a, i) => (
                           <div key={i} className="border-b border-gray-200 py-1">{a}</div>
                        ))}
                     </div>
                  </HighlightBox>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-black pt-12">
               <div className="lg:col-span-8">
                 <div className="flex items-center gap-3 mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Comprehensive Analysis</span>
                 </div>
                 <div className="prose prose-lg max-w-none 
                   prose-headings:font-sans prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-wider prose-headings:text-xl prose-headings:mt-16 prose-headings:mb-6 prose-headings:text-black
                   prose-h1:text-4xl prose-h1:font-serif prose-h1:italic prose-h1:capitalize
                   prose-p:font-serif prose-p:font-light prose-p:text-gray-900 prose-p:leading-[2.4] prose-p:text-lg prose-p:tracking-wide
                   prose-strong:font-bold prose-strong:text-black
                   prose-li:font-serif prose-li:text-gray-800
                   prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-6 prose-blockquote:italic
                   text-justify
                   ">
                   <ReactMarkdown>{reportData.text}</ReactMarkdown>
                 </div>
                 <div className="mt-16 pt-8 border-t border-gray-200 text-[10px] uppercase tracking-widest text-gray-400">
                   End of Report • Generated via Curator Protocol
                 </div>
               </div>

               <div className="lg:col-span-4">
                 <div className="sticky top-32">
                   <div className="flex items-center gap-2 mb-6 border-b border-black pb-2">
                     <span className="w-1.5 h-1.5 bg-black"></span>
                     <h3 className="text-xs font-bold uppercase tracking-widest">References</h3>
                   </div>
                   
                   {reportData.sources && reportData.sources.length > 0 ? (
                     <ul className="space-y-6">
                       {reportData.sources.map((source, idx) => (
                         source.web && (
                           <li key={idx} className="group">
                             <a 
                               href={source.web.uri} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="block opacity-60 hover:opacity-100 transition-opacity"
                             >
                               <div className="text-lg font-serif leading-tight underline decoration-1 underline-offset-4 decoration-gray-300 group-hover:decoration-black mb-2 text-black">
                                 {source.web.title}
                               </div>
                               <div className="text-[9px] font-mono uppercase tracking-wider text-gray-500 break-all">
                                 {new URL(source.web.uri).hostname}
                               </div>
                             </a>
                           </li>
                         )
                       ))}
                     </ul>
                   ) : (
                     <p className="text-xs font-serif italic text-gray-400">No citations available.</p>
                   )}
                 </div>
               </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="h-[40vh] flex flex-col items-center justify-center border border-dashed border-gray-300 bg-gray-50/50 mr-12">
              <span className="font-serif text-3xl italic text-gray-300 mb-4">Awaiting Generation</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Select an artist to begin analysis</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};