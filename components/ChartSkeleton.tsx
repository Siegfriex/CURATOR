import React from 'react';
import { motion } from 'framer-motion';

interface ChartSkeletonProps {
  variant?: 'radar' | 'line' | 'dual';
  height?: number;
}

/**
 * 차트 로딩 중 스켈레톤 UI 컴포넌트
 * 
 * @param variant - 차트 유형 ('radar', 'line', 'dual')
 * @param height - 최소 높이 (px)
 */
export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ 
  variant = 'radar', 
  height = 300 
}) => {
  const baseAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (variant === 'radar') {
    return (
      <div 
        className="w-full h-full flex items-center justify-center relative"
        style={{ minHeight: `${height}px`, minWidth: '300px' }}
      >
        <div className="relative w-[300px] h-[300px]">
          {/* 원형 그리드 스켈레톤 */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-gray-200"
              style={{
                width: `${100 - i * 25}%`,
                height: `${100 - i * 25}%`,
                top: `${i * 12.5}%`,
                left: `${i * 12.5}%`,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
          {/* 축 스켈레톤 */}
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i * 72 - 90) * (Math.PI / 180);
            const x = 150 + 120 * Math.cos(angle);
            const y = 150 + 120 * Math.sin(angle);
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-20 bg-gray-200 origin-bottom"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `rotate(${i * 72 - 90}deg)`,
                  transformOrigin: 'bottom center',
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            );
          })}
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <span className="text-[9px] uppercase tracking-widest text-gray-400">
            Loading Chart...
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'line') {
    return (
      <div 
        className="w-full h-full relative"
        style={{ minHeight: `${height}px`, minWidth: '300px' }}
      >
        {/* 그리드 라인 */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-full h-px bg-gray-200"
              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        {/* 라인 스켈레톤 */}
        <svg className="absolute inset-0 w-full h-full">
          <motion.path
            d="M 0 200 Q 150 100, 300 150 T 600 120"
            stroke="#e5e5e5"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            animate={{
              pathLength: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </svg>
      </div>
    );
  }

  // dual variant
  return (
    <div 
      className="w-full h-full relative"
      style={{ minHeight: `${height}px`, minWidth: '600px' }}
    >
      {/* 듀얼 차트 스켈레톤 */}
      <div className="absolute inset-0 flex flex-col justify-between">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-full h-px bg-gray-200"
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      {/* 두 개의 영역 스켈레톤 */}
      <svg className="absolute inset-0 w-full h-full">
        <motion.path
          d="M 0 300 Q 200 200, 400 250 T 800 220"
          stroke="#28317C"
          strokeWidth="2"
          fill="rgba(40, 49, 124, 0.1)"
          animate={{
            pathLength: [0, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <motion.path
          d="M 0 250 Q 200 150, 400 200 T 800 180"
          stroke="#3B82F6"
          strokeWidth="2"
          fill="rgba(59, 130, 246, 0.1)"
          animate={{
            pathLength: [0, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
      </svg>
    </div>
  );
};

