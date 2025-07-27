'use client';

import { OrderBook, SimulatedOrder } from '@/types';

interface OrderBookDisplayProps {
  orderbook: OrderBook | null;
  simulatedOrder?: SimulatedOrder;
  venue: string;
}

export default function OrderBookDisplay({ orderbook, simulatedOrder, venue }: OrderBookDisplayProps) {
  if (!orderbook) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 text-white">
        <h3 className="text-lg font-semibold mb-4">{venue.toUpperCase()} Order Book</h3>
        <div className="text-center text-gray-400">Connecting...</div>
      </div>
    );
  }

  const getSimulatedOrderPosition = () => {
    if (!simulatedOrder || simulatedOrder.type === 'market') return null;
    
    const price = simulatedOrder.price!;
    const side = simulatedOrder.side;
    
    if (side === 'buy') {
      const bidIndex = orderbook.bids.findIndex(bid => bid.price <= price);
      return { side: 'bids', index: bidIndex === -1 ? orderbook.bids.length : bidIndex };
    } else {
      const askIndex = orderbook.asks.findIndex(ask => ask.price >= price);
      return { side: 'asks', index: askIndex === -1 ? orderbook.asks.length : askIndex };
    }
  };

  const simulatedPosition = getSimulatedOrderPosition();

  const renderOrderLevel = (level: any, index: number, side: 'bids' | 'asks') => {
    const isSimulated = simulatedPosition && 
      simulatedPosition.side === side && 
      simulatedPosition.index === index;

    return (
      <div
        key={`${side}-${index}`}
        className={`flex justify-between py-1 px-2 text-sm ${
          side === 'bids' ? 'bg-green-900/20' : 'bg-red-900/20'
        } ${isSimulated ? 'border-l-4 border-yellow-400 bg-yellow-900/30' : ''}`}
      >
        <span className={side === 'bids' ? 'text-green-400' : 'text-red-400'}>
          {level.price.toFixed(2)}
        </span>
        <span className="text-gray-300">{level.quantity.toFixed(4)}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 text-white">
      <h3 className="text-lg font-semibold mb-4">{venue.toUpperCase()} Order Book</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-red-400 mb-2">Asks</h4>
          <div className="space-y-1">
            {orderbook.asks.slice(0, 15).reverse().map((ask, index) => 
              renderOrderLevel(ask, orderbook.asks.length - 1 - index, 'asks')
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-green-400 mb-2">Bids</h4>
          <div className="space-y-1">
            {orderbook.bids.slice(0, 15).map((bid, index) => 
              renderOrderLevel(bid, index, 'bids')
            )}
          </div>
        </div>
      </div>
      
      {simulatedOrder && (
        <div className="mt-4 p-2 bg-yellow-900/30 rounded border-l-4 border-yellow-400">
          <div className="text-xs text-yellow-200">
            Simulated {simulatedOrder.side} order: {simulatedOrder.quantity} @ {simulatedOrder.price?.toFixed(2) || 'Market'}
          </div>
        </div>
      )}
    </div>
  );
}