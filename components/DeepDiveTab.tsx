
import React, { useState, useEffect, useRef } from 'react';
import { Artist, AIReportResult, TimelineData } from '../types';
import { generateArtistReport, generateArtistTimeline } from '../services/geminiService';
import { audioService } from '../services/audioService';
import { FlashlightGateway, FlashlightGatewayMobile } from './FlashlightGateway';
import { DeepDiveChat } from './DeepDiveChat';
import { TimelineJourney } from './TimelineJourney';
import { NauticalSpinner } from '../App';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface Props {
  artist: Artist;
}

type ViewState = 'FETCHING' | 'TYPING' | 'HUD_ACTIVE' | 'TIMELINE_ACTIVE';

export const DeepDiveTab: React.FC<Props> = ({ artist }) => {
  const [viewState, setViewState] = useState<ViewState>('FETCHING');
  const [reportData, setReportData] = useState<AIReportResult | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  // Fetch Report on Mount
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await generateArtistReport(artist.name);
        setReportData(result);
        setViewState('TYPING');
      } catch (e) {
        console.error("Report generation failed", e);
        // Fallback?
      }
    };
    fetchReport();
  }, [artist.name]);

  // Typing Engine
  useEffect(() => {
    if (viewState === 'TYPING' && reportData) {
      let index = 0;
      const fullText = reportData.text;
      const totalLength = fullText.length;
      
      // Variable Speed Logic
      const typeChar = () => {
        if (index < totalLength) {
          setDisplayedText(fullText.substring(0, index + 1));
          index++;
          
          let delay = 20; // Default slow
          const progress = index / totalLength;
          
          // Acceleration in body (20% - 80%)
          if (progress > 0.2 && progress < 0.8) {
             delay = 2; // Very fast
          } else if (progress >= 0.8) {
             // Instant finish
             setDisplayedText(fullText);
             setViewState('HUD_ACTIVE');
             return; 
          }
          
          setTimeout(typeChar, delay);
        } else {
          setViewState('HUD_ACTIVE');
        }
      };
      
      typeChar();
    }
  }, [viewState, reportData]);

  // Audio Start on Timeline Entry
  const handleEnterTimeline = async () => {
    setLoadingTimeline(true);
    try {
      if (!timelineData) {
        const data = await generateArtistTimeline(artist.name, artist.birthYear);
        setTimelineData(data);
      }
      // Initialize Audio
      await audioService.initialize();
      audioService.playAmbient(artist.radarData);
      
      setViewState('TIMELINE_ACTIVE');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTimeline(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white text-black overflow-hidden font-sans">
      
      {/* TIMELINE LAYER */}
      {viewState === 'TIMELINE_ACTIVE' && timelineData && (
         <div className="fixed inset-0 z-[200] animate-[fadeIn_1s_ease-in-out_forwards]">
            <TimelineJourney 
               data={timelineData} 
               artistName={artist.name} 
               onClose={() => {
                  audioService.stop();
                  setViewState('HUD_ACTIVE');
               }} 
            />
         </div>
      )}

      {/* CONTENT LAYER */}
      <div className={`w-full h-full transition-all duration-1000 ease-out ${viewState === 'HUD_ACTIVE' ? 'scale-95 opacity-80 grayscale-[30%]' : ''}`}>
         
         <div className="max-w-4xl mx-auto pt-20 md:pt-24 px-6 md:px-12 pb-32 md:pb-48">
            {/* Header */}
            <div className="mb-8 md:mb-12">
               <h1 className="font-serif text-4xl md:text-6xl italic mb-4">{artist.name}</h1>
               <div className="h-[1px] w-16 md:w-24 bg-black mb-4"></div>
               <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-gray-500">Narrative Sync • Gemini 2.5 Intelligence</span>
            </div>

            {/* Typing Area */}
            <div className="min-h-[50vh]">
               {viewState === 'FETCHING' ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-50">
                     <NauticalSpinner color="#28317C" />
                     <span className="mt-4 text-xs uppercase tracking-widest animate-pulse">Synthesizing Narrative...</span>
                  </div>
               ) : (
                  <div className="prose prose-base md:prose-lg max-w-none text-justify font-serif font-light leading-loose text-gray-900">
                     <ReactMarkdown>{displayedText}</ReactMarkdown>
                     {viewState === 'TYPING' && <span className="inline-block w-2 h-5 bg-black ml-1 animate-pulse"></span>}
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* HUD OVERLAYS */}
      {viewState === 'HUD_ACTIVE' && (
         <>
            {/* Zone B: Chat */}
            <DeepDiveChat artistName={artist.name} />
            
            {/* Zone C: Gateway (Desktop) */}
            <FlashlightGateway onEnter={handleEnterTimeline} />
            
            {/* Zone C: Gateway (Mobile) */}
            <FlashlightGatewayMobile onEnter={handleEnterTimeline} />
         </>
      )}
      
      {/* Loading Overlay for Timeline */}
      {loadingTimeline && (
         <div className="fixed inset-0 z-[250] bg-black text-white flex flex-col items-center justify-center">
            <NauticalSpinner color="white" />
            <span className="mt-6 text-xs uppercase tracking-[0.5em] animate-pulse">Synchronizing Temporal Data...</span>
         </div>
      )}

    </div>
  );
};
