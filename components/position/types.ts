export interface Position {
  tradingsymbol: string;
  exchange: string;
  instrument_token: number;
  product: string;
  quantity: number;
  change: number;
  overnight_quantity: number;
  multiplier: number;
  average_price: number;
  close_price: number;
  last_price: number;
  value: number;
  pnl: number;
  m2m: number;
  unrealised: number;
  realised: number;
  buy_quantity: number;
  buy_price: number;
  buy_value: number;
  buy_m2m: number;
  sell_quantity: number;
  sell_price: number;
  sell_value: number;
  sell_m2m: number;
  day_buy_quantity: number;
  day_buy_price: number;
  day_buy_value: number;
  day_sell_quantity: number;
  day_sell_price: number;
  day_sell_value: number;
}

export type Stoploss = {
  value: number,
  change: number,
  trailStoploss: boolean
}

export type Target = {
  value: number,
  change: number,
  step: number
}

export type PositionsTable = {
  tradingsymbol: string;
  exchange: string;
  product: string;
  quantity: number;
  change: number;
  averagePrice:number;
  updatedAveragePrice:AveragePrice
  lastPrice: number;
  value: number;
  pnl: number;
  stopLoss: Stoploss,
  target: Target,
  hasStoplossHit:boolean,
  hasTargetHit:boolean
}

export type Filters = {
  optionTypes: {
    ce?:boolean,
    pe?:boolean
  },
  transactionTypes: {
    buy?:boolean,
    sell?:boolean
  }
}


export type ProviderValue = {
  positionsTableData: PositionsTable[],
  averagePrices: AveragePrices,
  setAveragePrice?: (instrument, price) => void,
  targets: { [key: string]: Target },
  setTarget?: (instrument, price) => void,
  stopLosses: { [key: string]: Stoploss },
  setStopLoss?: (instrument, price) => void,
  filters:Filters,
  setFilters?:(filters:Filters)=>void
}


export type AveragePrice = {
  price: number
}

export type AveragePrices = {
  [key: string]: AveragePrice
}