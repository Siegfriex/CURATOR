import { useState, useEffect } from 'react';

interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

const defaultBreakpoints: Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/**
 * 반응형 브레이크포인트 감지 훅
 * 
 * 윈도우 크기에 따라 브레이크포인트 상태를 제공
 * 
 * @param breakpoints - 커스텀 브레이크포인트 (선택사항)
 * @returns 반응형 상태 객체
 * 
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop, width } = useResponsive();
 * 
 * const chartSize = isMobile ? 250 : isTablet ? 300 : 350;
 * ```
 */
export function useResponsive(breakpoints: Breakpoints = defaultBreakpoints) {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 크기 설정

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...dimensions,
    isSm: dimensions.width >= breakpoints.sm,
    isMd: dimensions.width >= breakpoints.md,
    isLg: dimensions.width >= breakpoints.lg,
    isXl: dimensions.width >= breakpoints.xl,
    isMobile: dimensions.width < breakpoints.md,
    isTablet: dimensions.width >= breakpoints.md && dimensions.width < breakpoints.lg,
    isDesktop: dimensions.width >= breakpoints.lg,
  };
}

