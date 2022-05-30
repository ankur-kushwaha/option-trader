import React, { useReducer } from "react";
import { getItem, setItem } from "../../utils/storage";

export interface Position {
  tradingsymbol: string;
  exchange: string;
  instrument_token: number;
  product: string;
  quantity: number;
  change:number;
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
  trailStoploss:boolean
}

export type Target = {
  value: number,
  change: number,
  step:number
}

type ProviderValue = {
  state: {
    positions: Position[],
    filteredPositions:Position[]
    stopLosses: {[key:string]:Stoploss},
    targets:{[key:string]:Target},
  },
  dispatch?: ({
    type: PositionActions,
    payload: any
  }) => void
}

export enum PositionActions {
  SET_POSITION_FILTERS="SET_POSITION_FILTERS",
  SET_STOPLOSSES="SET_STOPLOSSES",
  SET_TARGETS="SET_TARGETS",
  SET_POSITIONS="SET_POSITIONS",
}

let PositionContext = React.createContext<ProviderValue>({
  state: {
    positions: [],
    filteredPositions:[],
    stopLosses:{},
    targets:{}
  }
});

function reducerFn(state:ProviderValue["state"], action):ProviderValue["state"] {
  console.log('action',action);

  switch (action.type) {
    case PositionActions.SET_POSITIONS:{
      return {
        ...state,
        positions:action.payload
      }
    }
    case PositionActions.SET_POSITION_FILTERS:{

      let filteredPositions = state.positions.filter(item=>{
        if(action.payload.optionTypes?.ce && action.payload.optionTypes?.pe){
          return true
        }
        if(action.payload.optionTypes?.ce){
          return item.tradingsymbol.indexOf('CE')>-1
        }
        if(action.payload.optionTypes?.pe){
          return item.tradingsymbol.indexOf('PE')>-1
        }
        
        return true;
      }).filter(item=>{
        if(action.payload.transactionTypes?.buy && action.payload.transactionTypes?.sell){
          return true;
        }
        if(action.payload.transactionTypes?.buy){
          return item.quantity>0
        }
        if(action.payload.transactionTypes?.sell){
          return item.quantity<0
        }
        return true;
      })

      return {
        ...state,
        filteredPositions
      }   
    }
    case PositionActions.SET_STOPLOSSES:{
      setItem('stopLosses', action.payload)
      return {
        ...state,
        stopLosses:action.payload
      }
    }
    case PositionActions.SET_TARGETS:{
      setItem('targets', action.payload)
      return {
        ...state,
        targets:action.payload
      }
    }
    default:
      return state;
  }
}



export function PositionsProvder({ children, initialValue }) {
  let positions = initialValue.data.net.map((item)=>{return {
    ...item,
    change:((item.last_price-item.average_price)/item.average_price*100).toFixed(2)
  }})
  const [state, dispatch] = useReducer(reducerFn, {
    positions: positions,
    filteredPositions: positions,
    targets:{},
    stopLosses:{}
  });
  
  return <PositionContext.Provider value={{ state, dispatch }}>
    {children}
  </PositionContext.Provider>
}

export default PositionContext