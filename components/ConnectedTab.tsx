
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Artist, AIReportResult, ComparativeTrajectory, Masterpiece } from '../types';
import { RadarChartComponent } from './RadarChartComponent';
import { generateComparativeAnalysis, generateDetailedTrajectory, fetchMasterpiecesByMetric } from '../services/geminiService';
import { COLORS } from '../constants';
import { NauticalSpinner } from '../App';
import ReactMarkdown from 'react-markdown';
import { TrajectoryTunnel } from './TrajectoryTunnel';

interface Props {
  artists: Artist[];
  onDeepDive: (artistId: string) => void;
  currentOverviewArtist: Artist;
}

export const ConnectedTab: React.FC<Props> = ({ artists, onDeepDive, currentOverviewArtist }) => {
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  
  // Data States
  const [comparisonResult, setComparisonResult] = useState<AIReportResult | null>(null);
  const [trajectoryData, setTrajectoryData] = useState<ComparativeTrajectory | null>(null);
  const [masterpieces, setMasterpieces] = useState<Masterpiece[]>([]);
  
  // Loading States
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [loadingTrajectory, setLoadingTrajectory] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);

  const selectedArtist = artists.find(a => a.id === selectedArtistId);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Trigger Data Fetching on Selection
  useEffect(() => {
    if (selectedArtist && currentOverviewArtist) {
      const fetchData = async () => {
        setLoadingComparison(true);
        setLoadingTrajectory(true);
        setLoadingGallery(true);
        
        try {
          // 1. Text Analysis
          const compRes = await generateComparativeAnalysis(
            currentOverviewArtist.name, 
            selectedArtist.name, 
            "Artistic Trajectory & Market Positioning"
          );
          setComparisonResult(compRes);
        } catch(e) { console.error(e) } finally { setLoadingComparison(false) }

        try {
          // 2. Trajectory Data
          const trajData = await generateDetailedTrajectory(currentOverviewArtist.name, selectedArtist.name);
          setTrajectoryData(trajData);
        } catch(e) { console.error(e) } finally { setLoadingTrajectory(false) }

        try {
          // 3. Masterpieces Gallery
          const gallery = await fetchMasterpiecesByMetric(selectedArtist.name, "Representative Works");
          setMasterpieces(gallery);
        } catch(e) { console.error(e) } finally { setLoadingGallery(false) }
      };
      
      fetchData();
    }
  }, [selectedArtistId, currentOverviewArtist]);

  return (
    <div className="w-full min-h-screen bg-white">
      {/* FILTER BAR (Visible only in Grid Mode) */}
      {!selectedArtistId && (
        <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
             <button className="text-[9px] uppercase tracking-widest whitespace-nowrap transition-colors text-black font-bold border-b border-black">ALL</button>
             <button className="text-[9px] uppercase tracking-widest whitespace-nowrap transition-colors text-gray-400 hover:text-black">HIGH MARKET VALUE</button>
             <button className="text-[9px] uppercase tracking-widest whitespace-nowrap transition-colors text-gray-400 hover:text-black">TOP DISCOURSE</button>
             <button className="text-[9px] uppercase tracking-widest whitespace-nowrap transition-colors text-gray-400 hover:text-black">INSTITUTIONAL</button>
          </div>
          <div className="hidden md:block text-[9px] font-mono text-gray-400">
             COMPARING AGAINST: <span className="text-black font-bold">{currentOverviewArtist.name.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* 5-COLUMN GRID */}
      {!selectedArtistId && (
        <div className="p-6 md:p-12 pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
            {artists.map((artist) => (
              <motion.div
                key={artist.id}
                layoutId={`artist-card-${artist.id}`}
                onClick={() => setSelectedArtistId(artist.id)}
                className="aspect-[3/4] relative cursor-pointer group overflow-hidden bg-gray-100"
                whileHover={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.img 
                  layoutId={`artist-image-${artist.id}`}
                  src={artist.imageUrl} 
                  alt={artist.name} 
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
                
                {/* Refined Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  
                  {/* Header */}
                  <div className="mb-6 border-b border-white/20 pb-4">
                    <div className="flex justify-between items-end">
                      <h3 className="text-white font-serif text-3xl italic leading-none">
                        {artist.name}
                      </h3>
                      <span className="text-[9px] font-mono text-white/60 bg-white/10 px-1.5 py-0.5 rounded">
                        #{artist.currentRank}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-6">
                    <p className="text-[11px] text-gray-300 font-light leading-relaxed line-clamp-2">
                      {artist.description}
                    </p>
                    
                    <div className="w-full h-32 relative text-white/10">
                       {/* Container for Mini Radar */}
                       <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 h-full">
                          <RadarChartComponent 
                            data={artist.radarData} 
                            variant="mini"
                            color1="#ffffff"
                            name1={artist.name}
                          />
                       </div>
                    </div>

                    <div className="mt-2">
                       <button className="w-full py-3 border border-white/20 hover:bg-white hover:text-black text-white text-[9px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                          View Comparison
                          <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* STICKY STACKING EXPANDED VIEW */}
      <AnimatePresence>
        {selectedArtistId && selectedArtist && (
          <motion.div
            layoutId={`artist-card-${selectedArtistId}`}
            className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              ref={containerRef} 
              // id="expanded-view-container" // ID Removed as complex scrolling logic is deprecated
              className="w-full h-full overflow-y-auto scroll-smooth relative"
            >
              
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedArtistId(null); }}
                className="fixed top-8 right-8 z-[150] text-white hover:text-gray-300 text-[10px] uppercase tracking-widest flex items-center gap-3 mix-blend-difference font-bold group"
              >
                Close View <span className="text-xl leading-none border border-white/30 rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">&times;</span>
              </button>

              {/* HERO SECTION (Static Background / Intro) - z-0 */}
              <div className="sticky top-0 h-screen w-full z-0 flex items-end relative">
                 <motion.img
                   layoutId={`artist-image-${selectedArtistId}`}
                   src={selectedArtist.imageUrl}
                   alt={selectedArtist.name}
                   className="absolute inset-0 w-full h-full object-cover opacity-50"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
                 <div className="relative p-12 md:p-24 w-full max-w-7xl mx-auto pb-32">
                    <div className="mb-6 flex items-center gap-3">
                       <span className="px-2 py-1 bg-[#3B82F6] text-white text-[9px] uppercase tracking-widest font-bold">Target Artist</span>
                       <span className="h-[1px] w-12 bg-white/30"></span>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-serif text-white italic leading-none mb-10 drop-shadow-2xl">
                      {selectedArtist.name}
                    </h1>
                    <div className="max-w-3xl border-l-2 border-[#3B82F6] pl-10">
                       <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Curatorial Note</span>
                       <p className="text-2xl md:text-3xl text-gray-100 font-light leading-relaxed">
                          {selectedArtist.description}
                       </p>
                    </div>
                 </div>
              </div>

              {/* SECTION 1: DUAL RADAR (z-10) */}
              <div className="sticky top-0 h-screen w-full z-10 bg-[#0a0a0a]/95 backdrop-blur-md flex items-center justify-center border-t border-white/10">
                 <div className="max-w-7xl w-full px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center h-full">
                    <div className="lg:col-span-5 flex flex-col justify-center">
                       <span className="text-[#3B82F6] text-xs font-bold uppercase tracking-[0.2em] mb-6 block border-b border-[#3B82F6]/30 pb-2 inline-block w-fit">01 — Comparative Metrics</span>
                       <h2 className="text-5xl md:text-6xl font-serif text-white italic mb-8 leading-tight">Structural<br/>Divergence</h2>
                       <p className="text-gray-400 font-light leading-relaxed mb-10 text-lg">
                          A direct comparison of quantitative metrics reveals distinct institutional and market positionings.
                          The <strong className="text-white font-semibold">{currentOverviewArtist.name}</strong> (Reference) baseline highlights specific strengths in {selectedArtist.name}'s profile.
                       </p>
                       
                       <div className="space-y-4 border-l border-white/10 pl-6 mt-4">
                          <div className="flex items-center justify-between group">
                             <div className="flex items-center gap-4">
                                <span className="w-2 h-2 bg-[#28317C] rounded-full ring-2 ring-[#28317C]/50 shadow-[0_0_10px_rgba(40,49,124,0.5)]"></span>
                                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{currentOverviewArtist.name}</span>
                             </div>
                             <span className="text-[9px] text-gray-500 uppercase tracking-widest">Reference</span>
                          </div>
                          <div className="flex items-center justify-between group">
                             <div className="flex items-center gap-4">
                                <span className="w-2 h-2 bg-[#3B82F6] rounded-full ring-2 ring-[#3B82F6]/50 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                                <span className="text-xs font-bold text-white uppercase tracking-wider">{selectedArtist.name}</span>
                             </div>
                             <span className="text-[9px] text-[#3B82F6] uppercase tracking-widest">Target</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="lg:col-span-7 h-full max-h-[60vh] flex items-center justify-center">
                       <div className="w-full aspect-square max-w-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-xl p-8 md:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
                           <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
                           </div>

                           <RadarChartComponent 
                              data={currentOverviewArtist.radarData} 
                              data2={selectedArtist.radarData}
                              color1={COLORS.primary}
                              color2={COLORS.comparison}
                              name1={currentOverviewArtist.name}
                              name2={selectedArtist.name}
                              variant="default"
                              showLegend={false} 
                           />
                       </div>
                    </div>
                 </div>
              </div>

              {/* SECTION 2: DUAL TRAJECTORY (z-20) - PANORAMIC FULL SCREEN */}
              {loadingTrajectory ? (
                 <div className="sticky top-0 h-screen w-full z-20 bg-[#0a0a0a] flex items-center justify-center">
                     <div className="flex flex-col items-center gap-4">
                        <NauticalSpinner color="#3B82F6" />
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 animate-pulse">Calculating Lifelong Trajectory...</span>
                     </div>
                 </div>
              ) : trajectoryData ? (
                 <div className="relative z-20">
                    <TrajectoryTunnel 
                       data={trajectoryData}
                       artist1Name={currentOverviewArtist.name}
                       artist2Name={selectedArtist.name}
                       birthYear1={currentOverviewArtist.birthYear}
                       birthYear2={selectedArtist.birthYear}
                    />
                 </div>
              ) : (
                 <div className="sticky top-0 h-screen w-full z-20 bg-[#0a0a0a] flex items-center justify-center text-gray-500 font-serif italic">
                    Trajectory unavailable.
                 </div>
              )}

              {/* SECTION 3: TEXT ANALYSIS (z-30) */}
              <div className="sticky top-0 h-screen w-full z-30 bg-[#050505] flex items-center justify-center border-t border-white/10">
                 <div className="max-w-7xl w-full px-12">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
                       <div>
                          <span className="text-[#3B82F6] text-xs font-bold uppercase tracking-[0.2em] mb-4 block border-b border-[#3B82F6]/30 pb-2 inline-block">03 — Curatorial Synthesis</span>
                          <h2 className="text-4xl md:text-5xl font-serif text-white italic">Comparative Intelligence</h2>
                       </div>
                       <button 
                         onClick={() => onDeepDive(selectedArtist.id)} 
                         className="group relative px-10 py-4 text-white text-[10px] uppercase tracking-[0.25em] font-bold overflow-hidden border border-white/30 hover:border-white transition-colors duration-500"
                       >
                          <span className="relative z-10 group-hover:text-black transition-colors duration-500">Generate Full Report</span>
                          <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0"></div>
                       </button>
                    </div>
                    
                    {loadingComparison ? (
                       <div className="flex flex-col items-center justify-center py-24 gap-8 text-gray-500 border border-white/5 bg-white/5 rounded-lg">
                          <NauticalSpinner color="#ffffff" /> 
                          <span className="animate-pulse text-xs tracking-[0.3em] uppercase font-bold text-gray-400">Synthesizing Curatorial Insight...</span>
                       </div>
                    ) : comparisonResult ? (
                       <div className="prose prose-invert prose-xl max-w-none">
                          <div className="font-serif font-light text-gray-300 leading-loose text-justify text-lg md:text-xl columns-1 md:columns-2 gap-20 border-t border-white/10 pt-12">
                             <ReactMarkdown>{comparisonResult.text}</ReactMarkdown>
                          </div>
                          
                          {comparisonResult.sources && comparisonResult.sources.length > 0 && (
                            <div className="mt-20 pt-8 border-t border-white/10">
                               <span className="block text-[9px] uppercase tracking-widest text-gray-500 mb-6">Verified Grounding Sources</span>
                               <div className="flex flex-wrap gap-3">
                                  {comparisonResult.sources.map((s, i) => (
                                     <a key={i} href={s.web?.uri} target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 hover:text-[#3B82F6] hover:border-[#3B82F6] border border-white/10 px-4 py-2 rounded-full transition-all font-mono uppercase tracking-wide bg-white/5">
                                        {s.web?.title}
                                     </a>
                                  ))}
                               </div>
                            </div>
                          )}
                       </div>
                    ) : null}
                 </div>
              </div>

              {/* FOOTER: MASONRY GALLERY (z-40) */}
              <div className="relative z-40 bg-black min-h-screen py-32 border-t border-white/10">
                 <div className="max-w-7xl mx-auto px-12">
                    <div className="text-center mb-24">
                       <h2 className="font-serif text-5xl md:text-6xl text-white italic mb-8">Selected Works</h2>
                       <div className="w-24 h-1 bg-[#3B82F6] mx-auto mb-6"></div>
                       <p className="text-gray-500 text-sm font-light tracking-wide">Representative masterpieces from the archive</p>
                    </div>
                    
                    {loadingGallery ? (
                       <div className="flex justify-center py-20"><NauticalSpinner color="#ffffff" /></div>
                    ) : (
                       <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                          {masterpieces.map((work, i) => (
                             <div 
                               key={i} 
                               className="break-inside-avoid relative group cursor-pointer overflow-hidden bg-gray-900"
                               onClick={scrollToTop}
                             >
                                <img 
                                  src={`https://picsum.photos/seed/${work.title}/600/${Math.floor(Math.random() * 300 + 400)}?grayscale`} 
                                  alt={work.title} 
                                  className="w-full h-auto grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
                                   <span className="text-[#3B82F6] text-[9px] uppercase tracking-widest mb-6 border border-[#3B82F6] px-4 py-1 rounded-full hover:bg-[#3B82F6] hover:text-white transition-colors">Return to Top</span>
                                   <h4 className="font-serif text-3xl text-white italic mb-3">{work.title}</h4>
                                   <span className="text-[10px] font-mono text-gray-300">{work.year || 'Date Unknown'}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}

                    <div className="mt-32 border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-gray-600 font-mono">
                       <span>Curator's Odysseia • Visual Archive 2025</span>
                       <span>Powered by Gemini 2.5 Flash</span>
                    </div>
                 </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
