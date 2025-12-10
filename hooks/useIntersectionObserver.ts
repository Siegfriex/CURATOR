import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Intersection Observer를 사용한 요소 가시성 감지 훅
 * 
 * 차트 지연 로딩, 무한 스크롤 등에 사용
 * 
 * @param options - Intersection Observer 옵션
 * @returns [ref, isIntersecting] - 요소 ref와 교차 상태
 * 
 * @example
 * ```tsx
 * const [containerRef, isVisible] = useIntersectionObserver({
 *   threshold: 0.1,
 *   rootMargin: '100px',
 *   triggerOnce: true
 * });
 * 
 * return (
 *   <div ref={containerRef}>
 *     {isVisible ? <Chart /> : <Skeleton />}
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<T>, boolean] {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;
  const elementRef = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && triggerOnce) {
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [elementRef, isIntersecting];
}

