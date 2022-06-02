import React from 'react'


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
  out: {
    [key: string]: Quote
  },
  depth: {
    [key: string]: {
      buy: number,
      sell: number
    }
  }
}

type Instrument = {
  product:string,
  tradingsymbol:string
}

export default function useQuotes(instruments:Instrument[]): UseQuoteResponse {

  const [quotes,setQuotes] = React.useState({
    out:{},
    depth:{}
  });

  React.useEffect(()=>{
    async function getQuotes(){
      let query = instruments.map(item=>{
        return {
          tradingsymbol:item.tradingsymbol,
          exchange:item.product=='NRML'?"NFO":"NSE"
        }
      }).map(item => {
        return `instrument=${item.exchange}:${item.tradingsymbol}`
      }).join("&")
      let response: Response = await fetch(`/api/quote?${query}`).then(res => res.json());
    
      let data = response.data;
      let out = {};
      let depth = {}
      for (let key of Object.keys(data)) {
        let newKey = key.split(":")[1]
        out[newKey] = data[key];
        depth[newKey] = {
          buy: data[key].depth.buy?.[0].price,
          sell: data[key].depth.sell?.[0].price,
        }
      }

      setQuotes({
        out,
        depth
      })
    }

    getQuotes();
  },[instruments])

  return quotes

}