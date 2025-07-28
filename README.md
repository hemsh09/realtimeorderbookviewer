# Real-Time Orderbook Viewer

A Next.js application that displays real-time orderbook data with order simulation capabilities across multiple cryptocurrency exchanges.

## Features

- **Multi-Venue Support**: OKX, Bybit, and Deribit orderbook data
- **Real-Time Updates**: Live orderbook data with WebSocket connections (mock data for demo)
- **Order Simulation**: Simulate market and limit orders with timing controls
- **Impact Analysis**: Calculate fill percentage, market impact, and slippage
- **Market Depth Chart**: Visualize cumulative orderbook depth
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hemsh09/realtimeorderbookviewer.git
cd realtimeorderbookviewer
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Viewing Orderbooks

1. Select a venue (OKX, Bybit, or Deribit) using the tabs at the top
2. The orderbook will automatically load and update in real-time
3. Green rows represent bids, red rows represent asks
4. Connection status is shown in the top-left corner

### Simulating Orders

1. Fill out the order form on the right:
   - **Venue**: Choose the exchange
   - **Symbol**: Select the trading pair
   - **Order Type**: Market or Limit
   - **Side**: Buy or Sell
   - **Price**: For limit orders only
   - **Quantity**: Amount to trade
   - **Timing**: Delay before order placement

2. Click "Simulate Order" to place the simulated order
3. The order will be highlighted in the orderbook with a yellow border
4. Impact analysis will be displayed below

### Understanding Impact Metrics

- **Fill Percentage**: How much of your order can be filled
- **Market Impact**: Price impact of your order
- **Slippage**: Difference from expected price
- **Time to Fill**: Estimated time for complete fill

## Technical Implementation

### Architecture

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS
- **Charts**: Recharts for depth visualization
- **WebSockets**: Real-time data connections (mocked for demo)
- **TypeScript**: Full type safety

### Key Components

- `OrderBookDisplay`: Shows bid/ask levels with simulated order highlighting
- `OrderForm`: Order simulation form with validation
- `OrderImpactDisplay`: Calculates and displays order impact metrics
- `DepthChart`: Market depth visualization
- `OrderBookService`: Handles WebSocket connections and data parsing

### Data Flow

1. User selects venue and symbol
2. `useOrderBook` hook establishes connection via `OrderBookService`
3. Real-time data updates trigger re-renders
4. Order simulation overlays data on existing orderbook
5. Impact calculations run automatically

## API Integration

The application is designed to integrate with:

- **OKX API**: WebSocket orderbook feeds
- **Bybit API**: Real-time market data
- **Deribit API**: Derivatives orderbook data

*Note: For demo purposes, mock data is used instead of live API connections.*

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env.local` file for production API keys:

```
NEXT_PUBLIC_OKX_API_KEY=your_okx_key
NEXT_PUBLIC_BYBIT_API_KEY=your_bybit_key
NEXT_PUBLIC_DERIBIT_API_KEY=your_deribit_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.