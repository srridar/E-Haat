import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';


const data = [
  { day: 'Sun', sales: 4000, orders: 24 },
  { day: 'Mon', sales: 3000, orders: 18 },
  { day: 'Tue', sales: 5000, orders: 29 },
  { day: 'Wed', sales: 2780, orders: 20 },
  { day: 'Thu', sales: 1890, orders: 12 },
  { day: 'Fri', sales: 6390, orders: 35 },
  { day: 'Sat', sales: 7490, orders: 42 },
];

const PlatformAnalytics = () => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 lg:col-span-2 transition-all">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Platform Analytics</h2>
            <span className="flex items-center gap-1 bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              <TrendingUp size={12} /> +12.5%
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Monitoring marketplace growth and transaction flow</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <Calendar size={16} className="text-slate-400 ml-2" />
          <select className="text-xs font-bold bg-transparent border-none text-slate-600 outline-none pr-4 cursor-pointer">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 12}} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
              cursor={{ stroke: '#10b981', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSales)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-50">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Sales</p>
          <p className="text-lg font-bold text-slate-800">Rs 34,500</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
          <p className="text-lg font-bold text-slate-800">190</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Order</p>
          <p className="text-lg font-bold text-slate-800">Rs 181</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Category</p>
          <p className="text-lg font-bold text-green-600 font-mono">Vegetables</p>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;