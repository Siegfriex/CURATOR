import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, Label } from 'recharts';
import { TimeSeriesPoint } from '../types';
import { COLORS } from '../constants';

interface Props {
  data: TimeSeriesPoint[];
}

export const LineChartComponent: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-[250px] min-w-0 min-h-[250px]" style={{ minHeight: '250px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="0" vertical={false} stroke={COLORS.grid} />
          <XAxis 
            dataKey="date" 
            stroke="#000" 
            tick={{fontSize: 10, fontFamily: 'Inter', letterSpacing: '1px'}} 
            tickLine={false}
            axisLine={{ stroke: '#000', strokeWidth: 1 }}
            tickMargin={12}
            padding={{ left: 20, right: 20 }}
          >
            <Label value="YEAR (TIME)" offset={-10} position="insideBottomRight" style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.1em', fill: '#a3a3a3' }} />
          </XAxis>
          <YAxis 
            hide={false}
            axisLine={false}
            tickLine={false}
            tick={{fontSize: 9, fontFamily: 'Inter'}}
            domain={['dataMin - 5', 'dataMax + 5']} 
            width={40}
          >
             <Label value="VALUE INDEX" angle={-90} position="insideLeft" style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.1em', fill: '#a3a3a3', textAnchor: 'middle' }} />
          </YAxis>
          <Tooltip 
            cursor={{ stroke: '#e5e5e5', strokeWidth: 1 }}
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #000000', 
              borderRadius: '0px',
              fontFamily: 'Inter',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              boxShadow: 'none'
            }}
            itemStyle={{ color: '#000' }}
            labelStyle={{ color: '#666', marginBottom: '4px' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={COLORS.primary} 
            strokeWidth={1} 
            dot={false}
            activeDot={{ r: 4, fill: '#000', stroke: '#fff', strokeWidth: 1 }}
          />
          
          {/* Render Event Markers */}
          {data.map((entry, index) => (
            entry.event ? (
              <ReferenceDot 
                key={index} 
                x={entry.date} 
                y={entry.value} 
                r={3} 
                fill="#fff" 
                stroke="#000"
                strokeWidth={1}
              />
            ) : null
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};