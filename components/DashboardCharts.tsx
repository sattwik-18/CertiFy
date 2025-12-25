
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

const data = [
  { name: 'Jun', value: 400 },
  { name: 'Jul', value: 300 },
  { name: 'Aug', value: 500 },
  { name: 'Sep', value: 800 },
  { name: 'Oct', value: 700 },
  { name: 'Nov', value: 1100 },
  { name: 'Dec', value: 1300 },
];

export const MainAreaChart = () => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D4FF3F" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#D4FF3F" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#666', fontSize: 12 }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#666', fontSize: 12 }} 
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
          itemStyle={{ color: '#D4FF3F' }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#D4FF3F" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorValue)" 
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const SecurityGauge = ({ value }: { value: number }) => {
  return (
    <div className="relative flex items-center justify-center h-[200px]">
      <div className="text-center z-10">
        <div className="text-4xl font-bold text-brand">{value}%</div>
        <div className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Network Integrity</div>
      </div>
      <svg className="absolute w-48 h-48 transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="80"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="12"
          fill="transparent"
        />
        <circle
          cx="96"
          cy="96"
          r="80"
          stroke="#D4FF3F"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={502}
          strokeDashoffset={502 - (502 * value) / 100}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
    </div>
  );
};
