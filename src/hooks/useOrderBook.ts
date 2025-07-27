import { useState, useEffect, useRef } from 'react';
import { OrderBook, Venue } from '@/types';
import { OrderBookService } from '@/services/venues';

export const useOrderBook = (venue: Venue, symbol: string) => {
  const [orderbook, setOrderbook] = useState<OrderBook | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const serviceRef = useRef<OrderBookService | null>(null);

  useEffect(() => {
    if (!venue || !symbol) return;

    const handleUpdate = (newOrderbook: OrderBook) => {
      setOrderbook(newOrderbook);
      setIsConnected(true);
    };

    serviceRef.current = new OrderBookService(venue, symbol, handleUpdate);
    serviceRef.current.connect();

    return () => {
      if (serviceRef.current) {
        serviceRef.current.disconnect();
        serviceRef.current = null;
      }
      setIsConnected(false);
    };
  }, [venue, symbol]);

  return { orderbook, isConnected };
};