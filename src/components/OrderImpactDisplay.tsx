'use client';

import { OrderBook, SimulatedOrder, OrderImpact } from '@/types';

interface OrderImpactDisplayProps {
  orderbook: OrderBook | null;
  simulatedOrder?: SimulatedOrder;
}

export default function OrderImpactDisplay({ orderbook, simulatedOrder }: OrderImpactDisplayProps) {
  const calculateImpact = (): OrderImpact | null => {
    if (!orderbook || !simulatedOrder) return null;

    const { side, quantity, type, price } = simulatedOrder;
    const levels = side === 'buy' ? orderbook.asks : orderbook.bids;
    
    if (type === 'market') {
      let remainingQty = quantity;
      let totalCost = 0;
      let fillPercentage = 0;
      
      for (const level of levels) {
        if (remainingQty <= 0) break;
        
        const fillQty = Math.min(remainingQty, level.quantity);
        totalCost += fillQty * level.price;
        remainingQty -= fillQty;
        fillPercentage = ((quantity - remainingQty) / quantity) * 100;
      }
      
      const avgPrice = totalCost / (quantity - remainingQty);
      const bestPrice = levels[0]?.price || 0;
      const slippage = Math.abs((avgPrice - bestPrice) / bestPrice) * 100;
      
      return {
        fillPercentage,
        marketImpact: slippage,
        slippage,
        timeToFill: 0
      };
    } else {
      // Limit order
      if (!price) return null;
      
      let cumulativeQty = 0;
      let position = 0;
      
      for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        const priceCondition = side === 'buy' 
          ? level.price <= price 
          : level.price >= price;
          
        if (priceCondition) {
          cumulativeQty += level.quantity;
          position = i + 1;
        }
      }
      
      const fillPercentage = Math.min((cumulativeQty / quantity) * 100, 100);
      const bestPrice = levels[0]?.price || 0;
      const slippage = Math.abs((price - bestPrice) / bestPrice) * 100;
      
      return {
        fillPercentage,
        marketImpact: slippage,
        slippage,
        timeToFill: position * 2 // Rough estimate
      };
    }
  };

  const impact = calculateImpact();

  if (!impact || !simulatedOrder) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 text-white">
        <h3 className="text-lg font-semibold mb-4">Order Impact Analysis</h3>
        <div className="text-center text-gray-400">No order to analyze</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 text-white">
      <h3 className="text-lg font-semibold mb-4">Order Impact Analysis</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded p-3">
          <div className="text-sm text-gray-400">Fill Percentage</div>
          <div className="text-xl font-semibold text-green-400">
            {impact.fillPercentage.toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-gray-800 rounded p-3">
          <div className="text-sm text-gray-400">Market Impact</div>
          <div className="text-xl font-semibold text-yellow-400">
            {impact.marketImpact.toFixed(3)}%
          </div>
        </div>
        
        <div className="bg-gray-800 rounded p-3">
          <div className="text-sm text-gray-400">Slippage</div>
          <div className="text-xl font-semibold text-red-400">
            {impact.slippage.toFixed(3)}%
          </div>
        </div>
        
        <div className="bg-gray-800 rounded p-3">
          <div className="text-sm text-gray-400">Est. Time to Fill</div>
          <div className="text-xl font-semibold text-blue-400">
            {impact.timeToFill ? `${impact.timeToFill}s` : 'Instant'}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-800 rounded">
        <div className="text-sm text-gray-400 mb-2">Order Summary</div>
        <div className="text-sm">
          <div>{simulatedOrder.type.toUpperCase()} {simulatedOrder.side.toUpperCase()}</div>
          <div>{simulatedOrder.quantity} @ {simulatedOrder.price?.toFixed(2) || 'Market'}</div>
          <div className="text-gray-400">{simulatedOrder.venue.toUpperCase()} - {simulatedOrder.symbol}</div>
        </div>
      </div>
    </div>
  );
}