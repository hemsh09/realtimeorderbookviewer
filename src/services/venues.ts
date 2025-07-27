import { VenueConfig, OrderBook } from '@/types';
import { generateMockOrderBook, updateMockOrderBook } from './mockData';

export const VENUES: Record<string, VenueConfig> = {
  okx: {
    name: 'OKX',
    wsUrl: 'wss://ws.okx.com:8443/ws/v5/public',
    restUrl: 'https://www.okx.com/api/v5',
    symbols: ['BTC-USDT', 'ETH-USDT', 'SOL-USDT']
  },
  bybit: {
    name: 'Bybit',
    wsUrl: 'wss://stream.bybit.com/v5/public/spot',
    restUrl: 'https://api.bybit.com/v5',
    symbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT']
  },
  deribit: {
    name: 'Deribit',
    wsUrl: 'wss://www.deribit.com/ws/api/v2',
    restUrl: 'https://www.deribit.com/api/v2',
    symbols: ['BTC-PERPETUAL', 'ETH-PERPETUAL']
  }
};

export class OrderBookService {
  private interval: NodeJS.Timeout | null = null;
  private venue: string;
  private symbol: string;
  private onUpdate: (orderbook: OrderBook) => void;
  private currentOrderbook: OrderBook | null = null;

  constructor(venue: string, symbol: string, onUpdate: (orderbook: OrderBook) => void) {
    this.venue = venue;
    this.symbol = symbol;
    this.onUpdate = onUpdate;
  }

  connect() {
    // Generate initial mock orderbook
    this.currentOrderbook = generateMockOrderBook(this.symbol);
    this.onUpdate(this.currentOrderbook);
    
    // Update orderbook every 500ms with mock data
    this.interval = setInterval(() => {
      if (this.currentOrderbook) {
        this.currentOrderbook = updateMockOrderBook(this.currentOrderbook);
        this.onUpdate(this.currentOrderbook);
      }
    }, 500);
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}