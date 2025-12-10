import React from 'react';
import { GameResult } from '../types';
import { MOCK_ARTISTS } from '../constants';

interface GameResultBannerProps {
  gameResult: GameResult;
  onExploreArtist: (artistId: string) => void;
  onDismiss?: () => void;
  onPlayAgain?: () => void;
}

export const GameResultBanner: React.FC<GameResultBannerProps> = ({
  gameResult,
  onExploreArtist,
  onDismiss,
  onPlayAgain
}) => {
  const matchedArtist = MOCK_ARTISTS.find(a => a.id === gameResult.matchedArtistId);

  if (!matchedArtist) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#28317C] to-[#3B82F6] text-white p-6 md:p-8 mb-0 border-b-4 border-black relative animate-fade-in">
      {/* Close Button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Game Result Info */}
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 mb-2 block">
              Your Journey Complete
            </span>
            <h2 className="font-serif italic text-3xl md:text-4xl mb-3">
              {gameResult.archetype}
            </h2>
            <p className="text-sm md:text-base text-white/90 leading-relaxed mb-4 line-clamp-2">
              {gameResult.narrative}
            </p>
            <div className="flex items-center gap-6 text-xs">
              <span className="text-white/70">
                Score: <strong className="text-white">{gameResult.score}</strong>
              </span>
              <span className="text-white/70">
                Artifacts: <strong className="text-white">
                  {gameResult.artifacts.t1 + gameResult.artifacts.t2 + gameResult.artifacts.t3}
                </strong>
              </span>
              <span className="text-white/70">
                Masterpieces: <strong className="text-white">{gameResult.artifacts.t1}</strong>
              </span>
            </div>
          </div>

          {/* Right: Matched Artist & Action */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="md:text-right">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 block mb-2">
                Your Archetype Match
              </span>
              <p className="font-serif italic text-2xl md:text-3xl mb-2">
                {matchedArtist.name}
              </p>
              <p className="text-xs text-white/70">
                {matchedArtist.nationality} • Rank #{matchedArtist.currentRank}
              </p>
            </div>
            <div className="flex gap-3">
              {onPlayAgain && (
                <button
                  onClick={onPlayAgain}
                  className="px-6 py-3 bg-transparent border border-white/50 text-white font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-white/10 transition-colors"
                >
                  Play Again
                </button>
              )}
              <button
                onClick={() => onExploreArtist(matchedArtist.id)}
                className="px-8 py-3 bg-white text-[#28317C] font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-gray-100 transition-colors"
              >
                Explore {matchedArtist.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResultBanner;
