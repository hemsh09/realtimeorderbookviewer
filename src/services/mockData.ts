import { OrderBook } from '@/types';

export const generateMockOrderBook = (symbol: string): OrderBook => {
  const basePrice = symbol.includes('BTC') ? 45000 : symbol.includes('ETH') ? 3000 : 150;
  const spread = basePrice * 0.001; // 0.1% spread
  
  const bids = [];
  const asks = [];
  
  // Generate 20 bid levels
  for (let i = 0; i < 20; i++) {
    const price = basePrice - spread/2 - (i * spread * 0.1);
    const quantity = Math.random() * 10 + 0.1;
    bids.push({ price, quantity });
  }
  
  // Generate 20 ask levels
  for (let i = 0; i < 20; i++) {
    const price = basePrice + spread/2 + (i * spread * 0.1);
    const quantity = Math.random() * 10 + 0.1;
    asks.push({ price, quantity });
  }
  
  return {
    bids: bids.sort((a, b) => b.price - a.price),
    asks: asks.sort((a, b) => a.price - b.price),
    timestamp: Date.now()
  };
};

export const updateMockOrderBook = (orderbook: OrderBook): OrderBook => {
  const updateLevel = (level: any) => ({
    ...level,
    quantity: Math.max(0.01, level.quantity + (Math.random() - 0.5) * 2)
  });
  
  return {
    bids: orderbook.bids.map(updateLevel),
    asks: orderbook.asks.map(updateLevel),
    timestamp: Date.now()
  };
};