
import React, { useState, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis, Legend, LabelList } from 'recharts';
import { AxisData } from '../types';
import { COLORS, METRIC_DETAILS } from '../constants';

type RadarVariant = 'default' | 'mini';

interface Props {
  data: AxisData[];
  data2?: AxisData[]; // Secondary dataset for comparison
  color1?: string;
  color2?: string;
  name1?: string;
  name2?: string;
  onAxisClick?: (axis: string) => void;
  onPointClick?: (data: { artist: string; metric: string; value: number }) => void;
  highlightedAxis?: string;
  variant?: RadarVariant; 
  showLegend?: boolean;
}

// Custom tick component
const CustomTick = ({ payload, x, y, onClick, highlighted, variant, mostSimilarAxis, mostDiffAxis }: any) => {
  const isMini = variant === 'mini';
  const fontSize = isMini ? 7 : 10;
  const hitAreaSize = isMini ? 40 : 120;
  
  // Highlight logic: Explicit highlight prop OR automatically detected 'Most Similar' axis
  const isMostSimilar = mostSimilarAxis === payload.value;
  // const isMostDiff = mostDiffAxis === payload.value; // Optional: Could highlight divergent axis differently

  // BOLD styling for similar axes
  const fontWeight = highlighted || isMostSimilar ? 700 : 400;
  const fillColor = highlighted || isMostSimilar ? COLORS.primary : isMini ? "#9ca3af" : "#666";
  const activeFill = highlighted || isMostSimilar ? "#3B82F6" : fillColor;

  return (
    <g transform={`translate(${x},${y})`}>
      <rect 
        x={-hitAreaSize/2} 
        y={-10} 
        width={hitAreaSize} 
        height={20} 
        fill="white" 
        fillOpacity={0}
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick(payload.value);
        }}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      />
      <text
        x={0}
        y={0}
        dy={isMini ? 3 : 4}
        textAnchor="middle"
        fill={activeFill}
        fontSize={fontSize}
        fontFamily="Inter"
        fontWeight={fontWeight}
        letterSpacing={isMini ? "0.02em" : "0.05em"}
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick(payload.value);
        }}
        style={{ 
          cursor: onClick ? 'pointer' : 'default', 
          textTransform: 'uppercase', 
          userSelect: 'none',
          textDecoration: highlighted || isMostSimilar ? 'underline' : 'none'
        }}
        className={(!isMini && onClick) ? "hover:font-bold transition-all hover:fill-black dark:hover:fill-white" : ""}
      >
        {payload.value}
      </text>
      {isMostSimilar && !isMini && (
        <circle cx={0} cy={14} r={3} fill={COLORS.primary} />
      )}
    </g>
  );
};

// Custom Dot
const CustomDot = (props: any) => {
  const { cx, cy, payload, onClick, artistName, stroke, variant, dataKey } = props;
  const isMini = variant === 'mini';
  
  if (!cx || !cy) return null;

  const handleInteraction = (e: any) => {
    e.stopPropagation();
    if (onClick && !isMini) {
      onClick({
        artist: artistName,
        metric: payload.axis,
        value: payload[dataKey || 'value']
      });
    }
  };

  return (
    <g 
      transform={`translate(${cx},${cy})`} 
      onClick={handleInteraction} 
      style={{ cursor: (!isMini && onClick) ? 'pointer' : 'default' }}
    >
      {!isMini && <circle r={10} fill="transparent" />}
      <circle
        r={isMini ? 1.5 : 3}
        stroke={stroke}
        strokeWidth={1}
        fill="white"
        className={!isMini ? "transition-all duration-300 hover:fill-black hover:scale-125 origin-center" : ""}
      />
    </g>
  );
};

export const RadarChartComponent: React.FC<Props> = ({ 
  data, 
  data2, 
  color1 = COLORS.primary,
  color2 = COLORS.comparison,
  name1 = 'Series 1',
  name2 = 'Series 2',
  onAxisClick,
  onPointClick,
  highlightedAxis,
  variant = 'default',
  showLegend = true
}) => {
  // Data safety check
  if (!data || data.length === 0) return null;

  const isMini = variant === 'mini';
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const outerRadius = isMini ? '45%' : '65%'; 

  const { mostSimilarAxis, mostDiffAxis } = useMemo(() => {
    if (!data2) return { mostSimilarAxis: null, mostDiffAxis: null };
    
    let minDiff = 100;
    let maxDiff = -1;
    let simAxis = null;
    let diffAxis = null;

    data.forEach((d1) => {
      const d2 = data2.find(d => d.axis === d1.axis);
      if (d2) {
        const diff = Math.abs(d1.value - d2.value);
        if (diff < minDiff) {
           minDiff = diff;
           simAxis = d1.axis;
        }
        if (diff > maxDiff) {
           maxDiff = diff;
           diffAxis = d1.axis;
        }
      }
    });

    return { mostSimilarAxis: simAxis, mostDiffAxis: diffAxis };
  }, [data, data2]);
  
  // Merge data for RadarChart if data2 exists
  const chartData = useMemo(() => {
    if (!data2) return data;
    return data.map(d1 => {
      const d2 = data2.find(d => d.axis === d1.axis);
      return {
        ...d1,
        value2: d2 ? d2.value : undefined
      };
    });
  }, [data, data2]);

  const handleAxisInteraction = (axis: string) => {
    setSelectedMetric(axis);
    if (onAxisClick) {
      onAxisClick(axis);
    }
  };

  const metricDetail = selectedMetric ? METRIC_DETAILS[selectedMetric] : null;

  let dynamicContext = metricDetail?.context;
  if (selectedMetric === mostSimilarAxis && data2) {
     dynamicContext = "Primary Intersection: This metric represents the strongest conceptual alignment between the two artists.";
  } else if (selectedMetric === mostDiffAxis && data2) {
     dynamicContext = "Primary Divergence: This metric highlights the most significant structural difference in their career trajectories.";
  }

  return (
    <div className="w-full h-full min-h-[150px] relative min-w-0">
      {selectedMetric && metricDetail && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedMetric(null);
          }}
        >
          <div 
            className="bg-white border border-black shadow-xl p-6 max-w-xs w-full animate-fade-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedMetric(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-black"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h4 className="font-serif text-xl italic mb-2 text-black">{selectedMetric}</h4>
            <p className="text-[10px] font-light leading-relaxed text-gray-600 mb-4">
              {metricDetail.description}
            </p>
            <div className="border-t border-gray-100 pt-2">
              <span className="text-[8px] uppercase tracking-widest text-gray-400 block mb-1">Context Indicator</span>
              <p className="text-[9px] font-mono text-black">
                {dynamicContext}
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ width: '100%', height: '100%', minHeight: '300px', minWidth: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius={outerRadius} data={chartData}>
          <PolarGrid stroke={COLORS.grid} strokeWidth={isMini ? 0.5 : 1} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          
          <Radar
            name={name1}
            dataKey="value"
            stroke={color1}
            strokeWidth={isMini ? 0.5 : 2}
            fill={color1}
            fillOpacity={data2 ? 0.3 : 0.4}
            isAnimationActive={true}
            dot={(props) => <CustomDot {...props} artistName={name1} stroke={color1} onClick={onPointClick} variant={variant} dataKey="value" />}
          >
            {!isMini && (
              <LabelList 
                dataKey="value" 
                position="outside" 
                fill={color1} 
                fontSize={9} 
                fontWeight={700}
                formatter={(val: number) => val}
              />
            )}
          </Radar>
          
          {data2 && (
            <Radar
              name={name2}
              dataKey="value2" 
              stroke={color2}
              strokeWidth={isMini ? 0.5 : 2}
              fill={color2}
              fillOpacity={0.4} 
              strokeDasharray="0"
              dot={(props) => <CustomDot {...props} artistName={name2} stroke={color2} onClick={onPointClick} variant={variant} dataKey="value2" />}
            >
              {!isMini && (
                <LabelList 
                  dataKey="value2" 
                  position="outside" 
                  fill={color2} 
                  fontSize={9} 
                  fontWeight={700}
                  formatter={(val: number) => val}
                />
              )}
            </Radar>
          )}

          <PolarAngleAxis 
            dataKey="axis" 
            tick={(props) => (
              <CustomTick 
                {...props} 
                onClick={handleAxisInteraction} 
                highlighted={highlightedAxis && props.payload.value === highlightedAxis}
                variant={variant}
                mostSimilarAxis={mostSimilarAxis}
                mostDiffAxis={mostDiffAxis}
              />
            )}
          />

          {!isMini && showLegend && (
            <Legend 
              wrapperStyle={{ 
                fontFamily: 'Inter', 
                fontSize: '10px', 
                fontWeight: 700,
                textTransform: 'uppercase', 
                letterSpacing: '0.2em',
                paddingTop: '10px',
                color: '#000'
              }}
              iconType="rect"
              iconSize={8}
            />
          )}
        </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
