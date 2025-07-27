'use client';

import { OrderBook } from '@/types';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface DepthChartProps {
  orderbook: OrderBook | null;
}

export default function DepthChart({ orderbook }: DepthChartProps) {
  if (!orderbook) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 text-white h-64 flex items-center justify-center">
        <div className="text-gray-400">Loading depth chart...</div>
      </div>
    );
  }

  const prepareDepthData = () => {
    const bids = orderbook.bids.slice(0, 20);
    const asks = orderbook.asks.slice(0, 20);
    
    let bidCumulative = 0;
    let askCumulative = 0;
    
    const bidData = bids.map(bid => {
      bidCumulative += bid.quantity;
      return {
        price: bid.price,
        cumulative: bidCumulative,
        side: 'bid'
      };
    }).reverse();
    
    const askData = asks.map(ask => {
      askCumulative += ask.quantity;
      return {
        price: ask.price,
        cumulative: askCumulative,
        side: 'ask'
      };
    });
    
    return [...bidData, ...askData].sort((a, b) => a.price - b.price);
  };

  const data = prepareDepthData();
  const midPrice = data.length > 0 ? (data[Math.floor(data.length / 2)]?.price || 0) : 0;

  return (
    <div className="bg-gray-900 rounded-lg p-4 text-white">
      <h3 className="text-lg font-semibold mb-4">Market Depth</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis 
              dataKey="price" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              tickFormatter={(value) => value.toFixed(2)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#F9FAFB'
              }}
              formatter={(value: any, name: string) => [
                `${parseFloat(value).toFixed(4)}`,
                'Cumulative Volume'
              ]}
              labelFormatter={(price: any) => `Price: ${parseFloat(price).toFixed(2)}`}
            />
            <Area
              type="stepAfter"
              dataKey="cumulative"
              stroke="#10B981"
              fill="url(#depthGradient)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="depthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-center text-sm text-gray-400">
        Mid Price: ${midPrice.toFixed(2)}
      </div>
    </div>
  );
}