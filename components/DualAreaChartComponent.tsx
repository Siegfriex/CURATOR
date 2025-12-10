
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { TrajectoryDataPoint } from '../types';
import { COLORS } from '../constants';
import { generateMetricInsight } from '../services/geminiService';
import { NauticalSpinner } from '../App';
import ReactMarkdown from 'react-markdown';
import { ChartSkeleton } from './ChartSkeleton';

interface Props {
  data: TrajectoryDataPoint[];
  artist1Name: string; // Reference (Primary Blue)
  artist2Name: string; // Selected (Azure)
  color1?: string;
  color2?: string;
  birthYear1?: number;
  birthYear2?: number;
}

const METRICS = [
  { id: 'total', label: 'TOTAL AVG' },
  { id: 'institution', label: 'INSTITUTION' },
  { id: 'discourse', label: 'DISCOURSE' },
  { id: 'academy', label: 'ACADEMY' },
  { id: 'network', label: 'NETWORK' }
];

// Helper to format currency compactly
const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
};

// Logarithmic scale mapping for price (0-100 score -> $10k - $10M)
const mapScoreToPrice = (score: number) => {
  const minPrice = 10000;
  const maxPrice = 10000000;
  return Math.round(minPrice * Math.pow(maxPrice / minPrice, score / 100));
};

export const DualAreaChartComponent: React.FC<Props> = ({ 
  data, 
  artist1Name, 
  artist2Name,
  color1 = COLORS.primary, // #28317C
  color2 = COLORS.comparison, // #3B82F6
  birthYear1,
  birthYear2
}) => {
  // Safety check for data with skeleton
  if (!data || data.length === 0) {
    return <ChartSkeleton variant="dual" height={400} />;
  }

  const [activeMetric, setActiveMetric] = useState('total');
  const [insightData, setInsightData] = useState<{ age: number, metric: string, text: string } | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Dynamic Keys based on selection
  const key1 = `a1_${activeMetric}`;
  const key2 = `a2_${activeMetric}`;
  const ctx1 = `a1_context`;
  const ctx2 = `a2_context`;

  const activeMetricColor = COLORS.metrics[activeMetric as keyof typeof COLORS.metrics] || '#ffffff';
  const isTotal = activeMetric === 'total';

  // Process data for chart
  const processedData = useMemo(() => {
    if (!data) return [];
    return data.map(point => {
      const v1 = (point as any)[key1] as number;
      const v2 = (point as any)[key2] as number;
      
      return {
        ...point,
        gap_range: [Math.min(v1, v2), Math.max(v1, v2)],
        price1: mapScoreToPrice(v1),
        price2: mapScoreToPrice(v2),
        delta: Math.abs(v1 - v2)
      };
    });
  }, [data, key1, key2]);

  const handlePointClick = async (data: any) => {
    if (!data) return;
    setLoadingInsight(true);
    setInsightData({ age: data.age, metric: activeMetric, text: '' });
    
    const yearHint = birthYear1 ? `(Approx Year: ${birthYear1 + data.age})` : '';
    const metricName = METRICS.find(m => m.id === activeMetric)?.label || activeMetric;
    const promptLabel = `Why was there a score of ${data[key1]}/100 for ${artist1Name} vs ${data[key2]}/100 for ${artist2Name} in ${metricName} at Age ${data.age} ${yearHint}?`;

    try {
      const text = await generateMetricInsight(artist1Name, promptLabel, data[key1]); 
      setInsightData(prev => prev ? { ...prev, text } : null);
    } catch (e) {
      setInsightData(prev => prev ? { ...prev, text: "Insight unavailable." } : null);
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col min-w-0">
      {/* HEADER & TOGGLES */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white hidden md:block">Trajectory Overlay</h3>
        <div className="flex flex-col gap-2">
          {METRICS.map(m => {
            const mColor = COLORS.metrics[m.id as keyof typeof COLORS.metrics] || '#ffffff';
            const isActive = activeMetric === m.id;
            
            return (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id)}
                style={{ 
                   borderColor: isActive ? mColor : 'rgba(255,255,255,0.2)',
                   color: isActive ? '#000' : '#9ca3af',
                   backgroundColor: isActive ? mColor : 'transparent'
                }}
                className={`
                  px-3 py-1 text-[8px] uppercase tracking-widest border transition-all rounded-full hover:text-white hover:border-white text-left md:text-center
                  ${isActive ? 'font-bold' : ''}
                `}
              >
                {m.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* CHART CONTAINER */}
      <div 
        className="flex-grow relative min-w-0" 
        style={{ 
          minHeight: '400px', 
          height: '400px',
          width: '100%',
          position: 'relative'
        }}
      >
        <ResponsiveContainer 
          width="100%" 
          height="100%" 
          minHeight={400} 
          minWidth={600}
        >
          <AreaChart 
            data={processedData} 
            margin={{ top: 10, right: 50, left: 0, bottom: 0 }}
            onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length) {
                    handlePointClick(e.activePayload[0].payload);
                }
            }}
            style={{ cursor: 'pointer' }}
          >
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isTotal ? color1 : activeMetricColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isTotal ? color1 : activeMetricColor} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isTotal ? color2 : activeMetricColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isTotal ? color2 : activeMetricColor} stopOpacity={0}/>
              </linearGradient>
              
              {/* Refined Tension Field Gradient for Gap */}
              <linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color1} stopOpacity={0.15} />
                <stop offset="50%" stopColor="#ffffff" stopOpacity={0.35} />
                <stop offset="95%" stopColor={color2} stopOpacity={0.15} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            
            <XAxis 
              dataKey="age" 
              stroke="#666" 
              tick={{fill: '#666', fontSize: 10}} 
              tickLine={false}
              axisLine={false}
              label={{ value: 'AGE (YEARS)', position: 'insideBottomRight', offset: -5, fill: '#444', fontSize: 9 }}
            />
            
            <YAxis 
              yAxisId="left"
              stroke="#666" 
              tick={false} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 100]}
            />

            {isTotal && (
                <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#444"
                tick={{fill: '#888', fontSize: 9, fontFamily: 'monospace'}}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]} 
                ticks={[20, 40, 60, 80, 100]}
                tickFormatter={(val) => mapScoreToPrice(val) >= 1000000 ? `$${(mapScoreToPrice(val)/1000000).toFixed(0)}M` : `$${(mapScoreToPrice(val)/1000).toFixed(0)}k`}
                label={{ value: 'EST. MARKET VALUATION', angle: -90, position: 'insideRight', offset: 10, fill: '#444', fontSize: 9, letterSpacing: '0.1em' }}
                />
            )}

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  const estYear = birthYear1 ? birthYear1 + d.age : null;
                  return (
                    <div className="bg-black/90 border border-white/20 p-4 rounded-none shadow-xl max-w-xs backdrop-blur-md">
                      <div className="flex justify-between items-baseline mb-2">
                        <p className="text-[10px] text-gray-400 font-mono">AGE {label}</p>
                        {estYear && <p className="text-[10px] text-gray-500 font-mono">~{estYear}</p>}
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-xs font-bold text-white mb-1">
                          <span style={{ color: color1 }}>{artist1Name}</span>
                          <span className="font-mono">{d[key1]}/100</span>
                        </div>
                        {isTotal && <p className="text-[9px] text-gray-400 text-right mb-1">Est. {formatCurrency(d.price1)}</p>}
                        <p className="text-[9px] text-gray-400 leading-tight">{d[ctx1] || "No data"}</p>
                      </div>

                      <div className="border-t border-white/10 pt-2">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span style={{ color: color2 }}>{artist2Name}</span>
                          <span className="font-mono">{d[key2]}/100</span>
                        </div>
                        {isTotal && <p className="text-[9px] text-gray-400 text-right mb-1">Est. {formatCurrency(d.price2)}</p>}
                        <p className="text-[9px] text-gray-400 leading-tight">{d[ctx2] || "No data"}</p>
                      </div>

                      {isTotal && (
                          <div className="mt-2 pt-2 border-t border-white/10 text-[9px] text-white flex flex-col gap-1">
                              <div className="flex justify-between">
                                 <span>Score Delta:</span>
                                 <span className="font-bold text-white">{d.delta.toFixed(1)} pts</span>
                              </div>
                              <div className="flex justify-between text-gray-400">
                                 <span>Valuation Gap:</span>
                                 <span>{formatCurrency(Math.abs(d.price1 - d.price2))}</span>
                              </div>
                          </div>
                      )}
                      <div className="mt-2 text-[8px] text-center text-[#3B82F6] uppercase tracking-widest animate-pulse">
                         Click to Analyze
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {isTotal && (
               <Area
                 yAxisId="left"
                 type="monotone" 
                 dataKey="gap_range"
                 stroke="none"
                 fill="url(#gapGradient)"
                 activeDot={false}
                 isAnimationActive={true}
                 animationDuration={1500}
               />
            )}
            
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey={key1} 
              stroke="none"
              fillOpacity={isTotal ? 0.15 : 0.1} 
              fill={isTotal ? "url(#grad1)" : activeMetricColor} 
            />
            
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey={key2} 
              stroke="none" 
              fillOpacity={isTotal ? 0.15 : 0.1} 
              fill={isTotal ? "url(#grad2)" : activeMetricColor} 
            />

            {isTotal && (
                <>
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey={key1}
                    stroke={color1}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6, fill: color1, stroke: '#fff', strokeWidth: 2 }}
                />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey={key2}
                    stroke={color2}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6, fill: color2, stroke: '#fff', strokeWidth: 2 }}
                />
                </>
            )}

             {!isTotal && (
                <>
                 <Line yAxisId="left" type="monotone" dataKey={key1} stroke={activeMetricColor} strokeWidth={2} dot={false} />
                 <Line yAxisId="left" type="monotone" dataKey={key2} stroke={activeMetricColor} strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </>
             )}

          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* INSIGHT MODAL */}
      {insightData && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          onClick={(e) => { e.stopPropagation(); setInsightData(null); }}
        >
          <div 
             className="bg-black border border-white/20 p-8 max-w-lg w-full shadow-2xl relative"
             onClick={(e) => e.stopPropagation()}
          >
             <h3 className="text-white font-serif text-2xl italic mb-4">
               Contextual Insight: Age {insightData.age}
             </h3>
             <div className="w-12 h-1 bg-[#3B82F6] mb-6"></div>
             
             {loadingInsight ? (
                <div className="flex flex-col items-center py-8">
                   <NauticalSpinner color="#3B82F6" />
                   <span className="mt-4 text-[10px] text-gray-400 uppercase tracking-widest animate-pulse">Consulting Archive...</span>
                </div>
             ) : (
                <div className="prose prose-invert prose-sm">
                   <ReactMarkdown>{insightData.text}</ReactMarkdown>
                </div>
             )}
             
             <button 
               onClick={() => setInsightData(null)}
               className="mt-8 w-full py-3 bg-white text-black text-[9px] uppercase tracking-widest font-bold hover:bg-gray-200"
             >
               Close Analysis
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
