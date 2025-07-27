export interface OrderBookLevel {
  price: number;
  quantity: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: number;
}

export interface SimulatedOrder {
  venue: Venue;
  symbol: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  price?: number;
  quantity: number;
  timing: number;
}

export interface OrderImpact {
  fillPercentage: number;
  marketImpact: number;
  slippage: number;
  timeToFill?: number;
}

export type Venue = 'okx' | 'bybit' | 'deribit';

export interface VenueConfig {
  name: string;
  wsUrl: string;
  restUrl: string;
  symbols: string[];
}