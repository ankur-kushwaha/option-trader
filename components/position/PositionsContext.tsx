import React, { useContext, useEffect, useReducer, useState } from "react";
import { getItem, setItem } from "../../utils/storage";
import useQuotes, { getQuotes, processKeyQuotes } from "../common/hooks/useQuotes";
import { notifyMe } from "../common/notifyMe";
import { AveragePrices, Filters, Position, PositionsTable, ProviderValue, Quotes, Stoploss, Target } from "./types";
import { usePositionData } from "./usePositionData";

let PositionContext = React.createContext<ProviderValue>({

  filters: {
    optionTypes: {},
    transactionTypes: {}
  },
  positionsTableData: [],
  stopLosses: {},
  averagePrices: {},
  targets: {},
  quotes: {}
});



export function PositionsProvder({ children, initialValue }) {

  let [positions, setPositions] = React.useState<Position[]>(initialValue.data.net);
  let [positionsTableData, setPositionsTableData] = React.useState<PositionsTable[]>([]);
  let [filters, setFilters] = React.useState<Filters>({
    optionTypes: {},
    transactionTypes: {}
  });
  let { averagePrices, setAveragePrice, setStopLoss, stopLosses, targets, setTarget } = usePositionData()
  let { quotes } = useQuotes(positions);

  const checkForAlerts = React.useCallback(() => {
    for (let item of positionsTableData) {
      let { hasStoplossHit } = item;
      if (hasStoplossHit) {
        notifyMe("Stoploss hit.. " + item.tradingsymbol)
      }
      if (item.hasTargetHit) {
        notifyMe("[Stoploss]" + item.tradingsymbol)
      }
    }
  }, [positionsTableData])

  const updateStoplosses = React.useCallback(() => {
    for (let item of positionsTableData) {
      if (item.quantity < 0) {

        let stopLoss = stopLosses[item.tradingsymbol].value;
        let current = item.change;
        let diff = stopLoss - current;
        let newStoploss = stopLoss;
        if (diff > 10) {
          newStoploss = Number(current) + 10;
          setStopLoss(item.tradingsymbol, newStoploss);
        }
      }
    }
  }, [positionsTableData, setStopLoss, stopLosses])

  const refresh = React.useCallback(async () => {
    let res = await fetch('/api/positions').then(res => res.json())
    if (res) {
      console.log('setPositions', res.data.net);

      setPositions(res.data.net)
      checkForAlerts();
      updateStoplosses()
    }
  }, [checkForAlerts, updateStoplosses])

  useEffect(() => {
    let interval = setInterval(refresh, 1000000);
    return () => {
      clearInterval(interval)
    }
  }, [refresh])

  useEffect(() => {
    let { optionTypes, transactionTypes } = filters;
    const positionsTableData: PositionsTable[] = positions?.map(item => {
      let instrument = item.tradingsymbol;

      let averagePrice = averagePrices[item.tradingsymbol]?.price || item.average_price
      let change = Number(((item.last_price - averagePrice) / item.average_price * 100).toFixed(2))
      let hasStoplossHit = !!(stopLosses[item.tradingsymbol]?.value && stopLosses[item.tradingsymbol]?.value < change)
      let hasTargetHit = !!(targets[item.tradingsymbol]?.value && targets[item.tradingsymbol]?.value > change)

      return {
        stopLoss: stopLosses[instrument],
        tradingsymbol: instrument,
        exchange: item.exchange,
        product: item.product,
        quantity: item.quantity,
        change,
        averagePrice: quotes[item.tradingsymbol]?.depth.buy?.[0].price||0,
        updatedAveragePrice: {
          price: averagePrice
        },
        lastPrice: item.last_price,
        value: item.value,
        pnl: Number(Number((item.last_price - Number(averagePrice)) * item.quantity).toFixed(2)),
        target: targets[instrument],
        hasStoplossHit,
        hasTargetHit
      }
    }).filter(item => {
      if (optionTypes?.ce && optionTypes?.pe) {
        return true
      }
      if (optionTypes?.ce) {
        return item.tradingsymbol.indexOf('CE') > -1
      }
      if (optionTypes?.pe) {
        return item.tradingsymbol.indexOf('PE') > -1
      }

      return true;
    }).filter(item => {
      if (transactionTypes?.buy && transactionTypes?.sell) {
        return true;
      }
      if (transactionTypes?.buy) {
        return item.quantity > 0
      }
      if (transactionTypes?.sell) {
        return item.quantity < 0
      }
      return true;
    });

    console.log('setPositionsTableData', positionsTableData);
    setPositionsTableData(positionsTableData)
  }, [averagePrices, filters, positions, stopLosses, targets])



  return <PositionContext.Provider value={{ refresh, quotes, setFilters, filters, positionsTableData, averagePrices, setAveragePrice, setStopLoss, stopLosses, targets, setTarget }}>
    {children}
  </PositionContext.Provider>
}

export default PositionContext