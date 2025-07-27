'use client';

import { useState } from 'react';
import { SimulatedOrder, Venue } from '@/types';
import { VENUES } from '@/services/venues';

interface OrderFormProps {
  onOrderSubmit: (order: SimulatedOrder) => void;
}

export default function OrderForm({ onOrderSubmit }: OrderFormProps) {
  const [venue, setVenue] = useState<Venue>('okx');
  const [symbol, setSymbol] = useState('BTC-USDT');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [timing, setTiming] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const order: SimulatedOrder = {
      venue,
      symbol,
      type: orderType,
      side,
      price: orderType === 'limit' ? parseFloat(price) : undefined,
      quantity: parseFloat(quantity),
      timing
    };

    onOrderSubmit(order);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Order Simulation</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Venue</label>
            <select
              value={venue}
              onChange={(e) => {
                const newVenue = e.target.value as Venue;
                setVenue(newVenue);
                setSymbol(VENUES[newVenue].symbols[0]);
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            >
              {Object.entries(VENUES).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Symbol</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            >
              {VENUES[venue].symbols.map(sym => (
                <option key={sym} value={sym}>{sym}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Order Type</label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as 'market' | 'limit')}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            >
              <option value="limit">Limit</option>
              <option value="market">Market</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Side</label>
            <select
              value={side}
              onChange={(e) => setSide(e.target.value as 'buy' | 'sell')}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
        </div>

        {orderType === 'limit' && (
          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            step="0.0001"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Timing Delay</label>
          <select
            value={timing}
            onChange={(e) => setTiming(parseInt(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
          >
            <option value={0}>Immediate</option>
            <option value={5000}>5 seconds</option>
            <option value={10000}>10 seconds</option>
            <option value={30000}>30 seconds</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Simulate Order
        </button>
      </form>
    </div>
  );
}