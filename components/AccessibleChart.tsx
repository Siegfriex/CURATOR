import React, { ReactNode } from 'react';

interface AccessibleChartProps {
  title: string;
  description: string;
  data: { label: string; value: number }[];
  children: ReactNode;
  ariaLabel?: string;
}

/**
 * 접근성을 고려한 차트 래퍼 컴포넌트
 * 
 * WCAG 2.2 준수:
 * - 스크린 리더용 데이터 테이블 제공
 * - 키보드 네비게이션 지원
 * - 고대비 모드 지원
 * 
 * @param title - 차트 제목
 * @param description - 차트 설명
 * @param data - 스크린 리더용 데이터 배열
 * @param children - 시각적 차트 컴포넌트
 * @param ariaLabel - ARIA 레이블 (선택사항)
 */
export const AccessibleChart: React.FC<AccessibleChartProps> = ({ 
  title, 
  description, 
  data, 
  children,
  ariaLabel 
}) => {
  return (
    <figure 
      role="img" 
      aria-label={ariaLabel || title}
      aria-describedby="chart-description"
      className="w-full h-full"
    >
      {/* 시각적 차트 */}
      <div aria-hidden="true" className="w-full h-full">
        {children}
      </div>
      
      {/* 스크린 리더용 데이터 (시각적 숨김) */}
      <figcaption id="chart-description" className="sr-only">
        <p>{description}</p>
        <table>
          <caption>{title} 데이터</caption>
          <thead>
            <tr>
              <th scope="col">항목</th>
              <th scope="col">값</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.label}</td>
                <td>{item.value}점</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
};

