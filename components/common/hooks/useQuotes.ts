import React from 'react'
import { Position, Quotes } from '../../position/types';


/**
 * [{
 *  tradingSymbol
 * }]
 * 
 * {
 *  "INFY":{
 *      
 *      }
 * }
 * 
 */



export interface Quote {
  instrument_token: number;
  timestamp: string;
  last_trade_time: string;
  last_price: number;
  last_quantity: number;
  buy_quantity: number;
  sell_quantity: number;
  volume: number;
  average_price: number;
  oi: number;
  oi_day_high: number;
  oi_day_low: number;
  net_change: number;
  lower_circuit_limit: number;
  upper_circuit_limit: number;
  ohlc: Ohlc;
  depth: Depth;
}
export interface Ohlc {
  open: number;
  high: number;
  low: number;
  close: number;
}
export interface Depth {
  buy?: (BuyEntityOrSellEntity)[] | null;
  sell?: (BuyEntityOrSellEntity)[] | null;
}
export interface BuyEntityOrSellEntity {
  price: number;
  quantity: number;
  orders: number;
}

type Response = {
  status: string,
  data: {
    [key: string]: Quote
  }
}

type UseQuoteResponse = {
  quotes: {
    [key: string]: Quote
  },
  depth: {
    [key: string]: {
      buy: number,
      sell: number
    }
  }
}

export async function getQuotes(instruments: Position[]) {
  let query = instruments.map(item => {
    return {
      tradingsymbol: item.tradingsymbol,
      exchange: item.product == 'NRML' ? "NFO" : "NSE"
    }
  }).map(item => {
    return `instrument=${item.exchange}:${item.tradingsymbol}`
  }).join("&")
  let response: Response = await fetch(`/api/quote?${query}`).then(res => res.json());
  return response;
}

export function processKeyQuotes(data) {
  let quotes: Quotes = {};
  let depth = {}
  for (let key of Object.keys(data)) {
    let newKey = key.split(":")[1]
    quotes[newKey] = data[key];
    depth[newKey] = {
      buy: data[key].depth.buy?.[0].price,
      sell: data[key].depth.sell?.[0].price,
    }
  }
  return {
    quotes, depth
  }
}

export default function useQuotes(instruments: Position[]): UseQuoteResponse {

  const [{ quotes, depth }, setQuotes] = React.useState({
    quotes: {},
    depth: {}
  });

  React.useEffect(() => {
    async function processQuotes() {
      let response = await getQuotes(instruments);
      let data = response.data;
      let { quotes, depth } = processKeyQuotes(data);

      console.log('setQuotes', {quotes,depth})
      setQuotes({
        quotes,
        depth
      });
    }

    processQuotes();
  }, [instruments]);

  function refreshQuotes() {

  }

  return {
    quotes,
    depth
  }

}