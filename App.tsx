
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { MOCK_ARTISTS, METRIC_DETAILS, COLORS } from './constants';
import { AppView, Artist, GroundingSource, DashboardData, Masterpiece } from './types';
import { RadarChartComponent } from './components/RadarChartComponent';
import { LineChartComponent } from './components/LineChartComponent';
import { generateMetricInsight, findSimilarArtists, generateComparativeAnalysis, fetchArtistDashboardData, fetchMasterpiecesByMetric, generateEventImage } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

// Lazy load heavy components
const DeepDiveTab = lazy(() => import('./components/DeepDiveTab'));
const ConnectedTab = lazy(() => import('./components/ConnectedTab'));

// --- Lazy Loading Component ---
const FadeInSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    });
    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-opacity duration-1000 ease-out transform w-full min-w-0 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{ minWidth: 0, minHeight: 0 }}
    >
      {children}
    </div>
  );
};

// Nautical Spinner Component
export const NauticalSpinner = ({ color = "currentColor" }: { color?: string }) => (
  <div className="relative w-24 h-24 flex items-center justify-center">
     {/* Outer Compass Ring */}
     <svg className="absolute w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="#e5e5e5" strokeWidth="1" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="4 4" />
        {[0, 90, 180, 270].map(deg => (
           <line key={deg} x1="50" y1="2" x2="50" y2="10" stroke={color} strokeWidth="2" transform={`rotate(${deg} 50 50)`} />
        ))}
     </svg>
     {/* Inner Helm */}
     <svg className="absolute w-12 h-12 animate-[spin_3s_ease-in-out_infinite]" viewBox="0 0 50 50">
        <path d="M25 0 L28 20 L45 25 L28 30 L25 50 L22 30 L5 25 L22 20 Z" fill={color} />
        <circle cx="25" cy="25" r="4" fill="white" />
     </svg>
  </div>
);

// Landing Page Component
const LandingPage = ({ onEnter }: { onEnter: (artistName?: string) => void }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnter(inputValue);
  };

  return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col items-center justify-center">
      
      {/* Brand Typography - LEFT ALIGNED */}
      <div className="absolute top-12 left-12 md:top-24 md:left-24 text-left opacity-0 animate-[fadeIn_1s_0.5s_forwards]">
        <h1 className="font-serif italic text-5xl md:text-7xl text-black leading-none mb-2">
          Curator's<br/>Odysseia
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-400">
          Est. 2025 • Data Driven Art Archive
        </p>
      </div>

      {/* Central Search / Entry */}
      <div className="w-full max-w-2xl px-8 z-10 opacity-0 animate-[slideUp_1s_1s_forwards]">
         <form onSubmit={handleSubmit} className="relative group">
            <label htmlFor="artist-search-input" className="block text-[9px] uppercase tracking-widest text-gray-400 mb-4 ml-1">
               Enter Artist Name or Keyword
            </label>
            <input 
              id="artist-search-input"
              name="artist-search"
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="SEARCH ARCHIVE..."
              className="w-full bg-transparent border-b border-gray-200 py-4 text-4xl md:text-6xl font-serif placeholder-gray-100 focus:border-black focus:outline-none transition-all text-black"
              autoFocus
            />
            <div className="flex justify-between items-center mt-6">
               <span className="text-[9px] font-mono text-gray-300">
                  INDEXING 24,912 RECORDS
               </span>
               <button 
                 type="submit"
                 className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-black hover:opacity-50 transition-opacity"
               >
                  <span>Explore</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
               </button>
            </div>
         </form>
      </div>

      {/* Subtle Background Noise */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }}
      />
    </div>
  );
};

// --- Masterpiece Carousel Item ---
const CarouselItem: React.FC<{ masterpiece: Masterpiece }> = ({ masterpiece }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImg = async () => {
      const url = await generateEventImage(masterpiece.visualPrompt);
      setSrc(url || `https://picsum.photos/seed/${masterpiece.title}/800/600?grayscale`);
      setLoading(false);
    };
    fetchImg();
  }, [masterpiece]);

  return (
    <div className="min-w-[300px] md:min-w-[400px] h-[400px] relative group overflow-hidden border border-white/10 bg-gray-900 flex-shrink-0 snap-center">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center"><NauticalSpinner color="white"/></div>
      ) : (
        <img src={src!} alt={masterpiece.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
        <h4 className="text-white font-serif text-xl italic">{masterpiece.title}</h4>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest">{masterpiece.year}</p>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  // Init with Landing View
  const [activeView, setActiveView] = useState<AppView>(AppView.LANDING);
  const [landingExiting, setLandingExiting] = useState(false);

  const [selectedArtistId, setSelectedArtistId] = useState<string>(MOCK_ARTISTS[0].id);
  const [showRankModal, setShowRankModal] = useState(false);

  // Real-time Dashboard Data State
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  
  // State for Deep Dive Analysis (Single Metric) - Used for Point Click
  const [insightData, setInsightData] = useState<{ artist: string, metric: string, value: number, text: string } | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // State for Masterpiece Carousel Modal (Axis Click)
  const [carouselData, setCarouselData] = useState<{ metric: string; works: Masterpiece[] } | null>(null);
  const [loadingCarousel, setLoadingCarousel] = useState(false);

  // Base artist info for dropdown
  const baseArtistInfo = MOCK_ARTISTS.find(a => a.id === selectedArtistId) || MOCK_ARTISTS[0];

  // Fetch Real Data when artist changes
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      if (activeView === AppView.OVERVIEW) {
        // Skip if already have data for this artist
        if (dashboardData?.name === baseArtistInfo.name) {
          return;
        }

        setLoadingDashboard(true);
        try {
          const data = await fetchArtistDashboardData(baseArtistInfo.name);
          if (mounted) setDashboardData(data);
        } catch (e) {
          console.error("Dashboard Fetch Error, using mock", e);
        } finally {
          if (mounted) setLoadingDashboard(false);
        }
      }
    };
    
    loadData();
    return () => { mounted = false; };
  }, [selectedArtistId, activeView, baseArtistInfo.name]);

  const handleEnterApp = (initialSearch?: string) => {
    setLandingExiting(true);
    setTimeout(() => {
      setActiveView(AppView.OVERVIEW);
      if (initialSearch) {
         const found = MOCK_ARTISTS.find(a => a.name.toLowerCase().includes(initialSearch.toLowerCase()));
         if (found) setSelectedArtistId(found.id);
      }
    }, 800);
  };

  // Trigger Masterpiece Carousel on Axis Click
  const handleAxisClick = async (axis: string) => {
    setLoadingCarousel(true);
    setCarouselData({ metric: axis, works: [] }); 
    try {
      const works = await fetchMasterpiecesByMetric(baseArtistInfo.name, axis);
      setCarouselData({ metric: axis, works });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCarousel(false);
    }
  };

  const handlePointClick = async (data: { artist: string, metric: string, value: number }) => {
    setLoadingInsight(true);
    setInsightData({
      artist: data.artist,
      metric: data.metric,
      value: data.value,
      text: ''
    });

    try {
      const text = await generateMetricInsight(data.artist, data.metric, data.value);
      setInsightData(prev => prev ? { ...prev, text } : null);
    } catch (e) {
      setInsightData(prev => prev ? { ...prev, text: "Failed to retrieve insight." } : null);
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleConnectedDeepDive = (artistId: string) => {
    setSelectedArtistId(artistId);
    setActiveView(AppView.DEEP_DIVE);
  };

  const displayArtist = dashboardData ? {
    ...baseArtistInfo,
    nationality: dashboardData.nationality,
    birthYear: dashboardData.birthYear,
    description: dashboardData.description,
    imageUrl: dashboardData.imageUrl,
    radarData: dashboardData.radarData,
    trajectory: dashboardData.trajectory,
    currentRank: dashboardData.rank
  } : baseArtistInfo;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white flex flex-col relative overflow-x-hidden">
      
      {/* Landing View Logic */}
      {activeView === AppView.LANDING && (
        <div className={`fixed inset-0 z-[300] transition-opacity duration-800 ease-out ${landingExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <LandingPage onEnter={handleEnterApp} />
        </div>
      )}

      {/* Rank Explanation Modal */}
      {showRankModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/90 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setShowRankModal(false)}
        >
          <div className="bg-white border border-black p-12 max-w-xl w-full shadow-2xl relative animate-fade-in" onClick={e => e.stopPropagation()}>
             <button onClick={() => setShowRankModal(false)} className="absolute top-6 right-6 text-2xl leading-none hover:text-gray-500">&times;</button>
             <div className="w-8 h-1 bg-black mb-6"></div>
             <h3 className="font-serif text-3xl mb-4">Curatorial Ranking Methodology</h3>
             <p className="font-light leading-relaxed text-sm mb-6">
                The Global Rank is calculated based on <strong>27 Narrative Combinations</strong> derived from biographical trajectory analysis. 
             </p>
             <ul className="list-disc pl-5 space-y-2 text-xs font-mono uppercase tracking-widest text-gray-600 mb-8">
                <li>Early Career Volatility (Scandal vs. Recognition)</li>
                <li>Institutional Acceptance (Biennials & Museums)</li>
                <li>Market Resilience (Secondary Market Recovery)</li>
             </ul>
          </div>
        </div>
      )}

      {/* Masterpiece Carousel Modal (Triggered by Axis Click) */}
      {carouselData && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
          onClick={() => setCarouselData(null)}
        >
          <div className="w-full max-w-[90vw] relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setCarouselData(null)}
              className="absolute -top-12 right-0 text-white text-[10px] uppercase tracking-widest hover:opacity-70"
            >
              Close [ESC]
            </button>
            
            <div className="mb-8 text-center">
               <span className="text-gray-400 text-[10px] uppercase tracking-[0.3em]">Selected Metric</span>
               <h2 className="text-4xl font-serif italic text-white mt-2">{carouselData.metric}</h2>
            </div>

            {loadingCarousel || carouselData.works.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                 <NauticalSpinner color="white" />
                 <span className="text-white/50 text-[10px] uppercase tracking-widest mt-4 animate-pulse">Retrieving Masterpieces...</span>
              </div>
            ) : (
              <div className="flex overflow-x-auto gap-8 pb-8 snap-x custom-scrollbar justify-start md:justify-center">
                 {carouselData.works.map((work, idx) => (
                   <CarouselItem key={idx} masterpiece={work} />
                 ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Insight Modal (Single Metric - Point Click) */}
      {insightData && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/10 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => {
            if (!loadingInsight) {
               setInsightData(null);
               setLoadingInsight(false);
            }
          }}
        >
          <div 
            className="bg-white border border-black p-10 lg:p-16 max-w-3xl w-full shadow-[20px_20px_0px_0px_rgba(40,49,124,1)] relative animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
             <div className="flex justify-between items-start mb-10 border-b border-black pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                     <span className={`w-2 h-2 rounded-full ${loadingInsight ? 'bg-black animate-ping' : 'bg-black'}`}></span>
                     <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
                        {loadingInsight ? 'ANALYZING DATA STREAM...' : 'ANALYSIS COMPLETE'}
                     </span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl text-black mt-2">
                    {insightData.artist}
                  </h2>
                </div>
                <div className="text-right">
                   <span className="block text-[9px] uppercase tracking-widest text-gray-400 mb-1">{insightData.metric}</span>
                   <span className="font-serif text-4xl md:text-5xl">{insightData.value}<span className="text-lg text-gray-400 italic">/100</span></span>
                </div>
             </div>
             <div className="min-h-[200px] flex flex-col">
               {loadingInsight ? (
                 <div className="flex-grow flex flex-col justify-center items-center space-y-4 opacity-50">
                   <NauticalSpinner color={COLORS.primary} />
                   <span className="font-serif text-lg italic text-gray-400 animate-pulse mt-4">Processing Global Data Stream...</span>
                 </div>
               ) : (
                 <div className="prose prose-lg max-w-none">
                    <div className="font-serif text-xl leading-relaxed text-gray-900 text-justify">
                       <ReactMarkdown>{insightData.text}</ReactMarkdown>
                    </div>
                    <div className="mt-8 pt-6 border-t border-dashed border-gray-300 flex justify-between items-center">
                       <span className="text-[9px] font-mono uppercase text-gray-400">Generated by Gemini 2.5 Flash + Search Grounding</span>
                       <button 
                          onClick={() => setInsightData(null)}
                          className="px-6 py-2 bg-black text-white text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
                       >
                          CLOSE INSIGHT
                       </button>
                    </div>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}

      {/* ================= DESKTOP HEADER (hidden on mobile) ================= */}
      <header className="hidden md:block sticky top-0 z-50 bg-white border-b border-black shadow-sm">
        <div className="max-w-[1920px] mx-auto px-0">
          <div className="grid grid-cols-12 h-16 items-center">
            
            {/* BRAND */}
            <div className="col-span-2 pl-6 border-r border-gray-200 h-full flex items-center bg-white">
               <div className="flex items-center justify-start h-full w-full cursor-pointer" onClick={() => setActiveView(AppView.LANDING)}>
                  <div className="text-left leading-tight">
                     <span className="font-serif italic text-2xl block -mb-1">Curator's</span>
                     <span className="font-serif italic text-xl block text-gray-500">Odysseia</span>
                  </div>
               </div>
            </div>

            {/* NAVIGATION */}
            <nav className="col-span-8 h-full flex items-center justify-center space-x-12 border-r border-gray-200 bg-white">
              <div className="flex w-full justify-center h-full">
                {[
                  { id: AppView.OVERVIEW, label: 'Overview' },
                  { id: AppView.CONNECTED, label: 'Connected' },
                  { id: AppView.DEEP_DIVE, label: 'Deep Dive' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`relative h-full px-4 text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 flex items-center whitespace-nowrap
                      ${activeView === item.id ? 'text-black' : 'text-gray-400 hover:text-black'}
                    `}
                  >
                    {item.label}
                    {activeView === item.id && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#28317C]"></span>
                    )}
                  </button>
                ))}
              </div>
            </nav>

            {/* ARTIST SELECTOR */}
            <div className="col-span-2 h-full flex items-center justify-end pr-6 bg-black text-white relative">
               {activeView !== AppView.CONNECTED ? (
                 <>
                   <select 
                    value={selectedArtistId}
                    onChange={(e) => setSelectedArtistId(e.target.value)}
                    className="appearance-none bg-transparent border-none text-right font-serif text-sm italic focus:ring-0 cursor-pointer pr-6 z-10 w-full text-white outline-none"
                  >
                    {MOCK_ARTISTS.map(artist => (
                      <option key={artist.id} value={artist.id} className="text-black bg-white">
                        {artist.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </div>
                 </>
               ) : (
                 <div className="w-full text-right text-[10px] uppercase tracking-widest text-gray-400">
                    AI Cluster Mode
                 </div>
               )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE HEADER (hidden on desktop) ================= */}
      <header className="md:hidden sticky top-0 z-50 bg-white shadow-sm">
        {/* Top Row: Brand + Artist Selector */}
        <div className="flex justify-between items-center h-14 px-4 border-b border-gray-200 bg-white">
           {/* Brand */}
           <div className="flex flex-col" onClick={() => setActiveView(AppView.LANDING)}>
              <span className="font-serif italic text-lg leading-none">Curator's</span>
              <span className="font-serif italic text-sm text-gray-500 leading-none">Odysseia</span>
           </div>
           
           {/* Artist Selector (Compact) */}
           <div className="relative">
              {activeView !== AppView.CONNECTED ? (
                 <div className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-sm shadow-md">
                    <select 
                        value={selectedArtistId}
                        onChange={(e) => setSelectedArtistId(e.target.value)}
                        className="appearance-none bg-transparent border-none text-xs font-serif italic focus:ring-0 outline-none pr-4 w-[110px] text-right truncate"
                    >
                        {MOCK_ARTISTS.map(artist => (
                        <option key={artist.id} value={artist.id} className="text-black">
                            {artist.name}
                        </option>
                        ))}
                    </select>
                    <div className="absolute right-2 pointer-events-none">
                        <svg className="w-2 h-2 text-white fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                 </div>
              ) : (
                 <div className="text-[9px] uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1">Cluster Mode</div>
              )}
           </div>
        </div>

        {/* Bottom Row: Tabs */}
        <div className="flex border-b border-black bg-gray-50 overflow-x-auto no-scrollbar">
           {[
              { id: AppView.OVERVIEW, label: 'Overview' },
              { id: AppView.CONNECTED, label: 'Connected' },
              { id: AppView.DEEP_DIVE, label: 'Deep Dive' },
           ].map(item => (
              <button
                 key={item.id}
                 onClick={() => setActiveView(item.id)}
                 className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap text-center transition-colors relative
                    ${activeView === item.id ? 'bg-white text-[#28317C]' : 'text-gray-400 hover:text-black'}
                 `}
              >
                 {item.label}
                 {activeView === item.id && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#28317C]"></div>}
              </button>
           ))}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow w-full max-w-[1920px] mx-auto border-l border-r border-gray-200">
        
        {/* ========================== OVERVIEW VIEW ========================== */}
        {activeView === AppView.OVERVIEW && (
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-64px)] animate-fade-in">
            <div className="lg:col-span-5 relative border-b lg:border-b-0 lg:border-r border-black h-[50vh] lg:h-auto overflow-hidden group">
              <div className="absolute inset-0 bg-gray-100">
                <img 
                  src={displayArtist.imageUrl} 
                  alt={displayArtist.name} 
                  className={`w-full h-full object-cover grayscale contrast-125 mix-blend-multiply opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ${loadingDashboard ? 'blur-sm' : ''}`}
                />
              </div>
              {loadingDashboard && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                    <NauticalSpinner color={COLORS.primary} />
                 </div>
              )}
              <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-black p-6 flex justify-between items-end">
                <div 
                  onClick={() => setShowRankModal(true)} 
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                >
                  <span className="block text-[9px] uppercase tracking-[0.3em] mb-2 text-gray-500 flex items-center gap-2">
                    Global Rank 
                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </span>
                  <span className="font-serif text-4xl underline decoration-1 underline-offset-4">#{displayArtist.currentRank}</span>
                </div>
                <div className="text-right">
                   <span className="block text-[9px] uppercase tracking-[0.3em] mb-2 text-gray-500">Born</span>
                   <span className="font-sans text-xl font-light">{displayArtist.birthYear}</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col">
              <div className="p-8 lg:p-16 border-b border-gray-200 flex-grow-0">
                <h1 className="text-5xl lg:text-7xl font-serif mb-8 leading-[0.9] tracking-tight text-black">
                  {displayArtist.name}
                </h1>
                <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                  <div className="w-full md:w-1/3 shrink-0">
                    <div className="h-[1px] w-12 bg-black mb-4"></div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Nationality</span>
                    <p className="text-lg mt-1 text-black">{displayArtist.nationality}</p>
                  </div>
                  <div className="w-full">
                    <div className="h-[1px] w-12 bg-black mb-4"></div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Curatorial Note</span>
                    <p className="text-sm font-light leading-relaxed mt-2 text-gray-800 max-w-md">
                      {displayArtist.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
                <div className="border-b md:border-b-0 md:border-r border-gray-200 p-8 flex flex-col relative hover:bg-gray-50 transition-colors">
                   <div className="absolute top-4 left-4 text-[9px] uppercase tracking-widest font-bold border border-black px-2 py-1">Valuation Matrix</div>
                   <div className="flex-grow flex flex-col justify-center mt-8 relative w-full h-full">
                     <FadeInSection className="w-full h-full">
                       {loadingDashboard ? <NauticalSpinner color={COLORS.primary} /> : (
                          <RadarChartComponent 
                             data={displayArtist.radarData} 
                             name1={displayArtist.name} 
                             onAxisClick={handleAxisClick}
                             onPointClick={handlePointClick}
                             variant="default"
                             color1={COLORS.primary}
                          />
                       )}
                     </FadeInSection>
                   </div>
                   <div className="absolute bottom-4 right-4 text-[9px] text-gray-400">Click Axis for Masterpieces</div>
                </div>
                <div className="p-8 flex flex-col relative hover:bg-gray-50 transition-colors">
                   <div className="absolute top-4 left-4 text-[9px] uppercase tracking-widest font-bold border border-black px-2 py-1">Trajectory Index</div>
                   <div className="flex-grow flex flex-col justify-center mt-8 w-full h-full">
                      <FadeInSection className="w-full h-full">
                        {loadingDashboard ? <NauticalSpinner color={COLORS.primary} /> : (
                          <LineChartComponent data={displayArtist.trajectory} />
                        )}
                      </FadeInSection>
                   </div>
                </div>
              </div>
              <div className="border-t border-black py-3 px-6 bg-black text-white flex justify-between text-[9px] uppercase tracking-widest font-mono">
                 <span>System Status: Online</span>
                 <span>Data Updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* CONNECTED VIEW (Visual Archive) */}
        {activeView === AppView.CONNECTED && (
          <div className="animate-fade-in min-h-[calc(100vh-64px)]">
            <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-64px)]"><NauticalSpinner /></div>}>
              <ConnectedTab 
                artists={MOCK_ARTISTS} 
                onDeepDive={handleConnectedDeepDive} 
                currentOverviewArtist={displayArtist}
              />
            </Suspense>
          </div>
        )}

        {/* DEEP DIVE VIEW (Narrative Sync) */}
        {activeView === AppView.DEEP_DIVE && (
          <div className="animate-fade-in">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><NauticalSpinner /></div>}>
              <DeepDiveTab artist={displayArtist} />
            </Suspense>
          </div>
        )}
      </main>
    </div>
  );
};
