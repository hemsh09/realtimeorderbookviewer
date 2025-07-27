'use client';

import { useState } from 'react';
import { SimulatedOrder, Venue } from '@/types';
import { useOrderBook } from '@/hooks/useOrderBook';
import OrderBookDisplay from '@/components/OrderBookDisplay';
import OrderForm from '@/components/OrderForm';
import OrderImpactDisplay from '@/components/OrderImpactDisplay';
import DepthChart from '@/components/DepthChart';

export default function Home() {
  const [selectedVenue, setSelectedVenue] = useState<Venue>('okx');
  const [selectedSymbol, setSelectedSymbol] = useState('BTC-USDT');
  const [simulatedOrder, setSimulatedOrder] = useState<SimulatedOrder | undefined>(undefined);
  
  const { orderbook, isConnected } = useOrderBook(selectedVenue, selectedSymbol);

  const handleOrderSubmit = (order: SimulatedOrder) => {
    setSelectedVenue(order.venue);
    setSelectedSymbol(order.symbol);
    
    if (order.timing > 0) {
      setTimeout(() => {
        setSimulatedOrder(order);
      }, order.timing);
    } else {
      setSimulatedOrder(order);
    }
  };

  const venues: Venue[] = ['okx', 'bybit', 'deribit'];

  return (
    <div className="min-h-screen bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Real-Time Orderbook Viewer</h1>
          <p className="text-gray-400">Simulate orders across multiple cryptocurrency exchanges</p>
        </header>

        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            {venues.map(venue => (
              <button
                key={venue}
                onClick={() => {
                  setSelectedVenue(venue);
                  setSimulatedOrder(undefined);
                }}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  selectedVenue === venue
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {venue.toUpperCase()}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className={`flex items-center space-x-2 ${
              isConnected ? 'text-green-400' : 'text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-300">{selectedSymbol}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <OrderBookDisplay 
              orderbook={orderbook} 
              simulatedOrder={simulatedOrder}
              venue={selectedVenue}
            />
          </div>
          
          <div>
            <OrderForm onOrderSubmit={handleOrderSubmit} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrderImpactDisplay 
            orderbook={orderbook} 
            simulatedOrder={simulatedOrder}
          />
          
          <DepthChart orderbook={orderbook} />
        </div>
      </div>
    </div>
  );
}
