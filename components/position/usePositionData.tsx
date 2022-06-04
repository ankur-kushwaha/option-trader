import React, { useState } from "react";
import { getItem, setItem } from "../../utils/storage";
import { AveragePrices, Stoploss, Target } from "./types";

export function usePositionData() {
  const [averagePrices, setAveragePrices] = React.useState<AveragePrices>({});
  const [stopLosses, setStopLosses] = useState<{ [key: string]: Stoploss }>({});
  const [targets, setTargets] = useState<{ [key: string]: Target }>({});

  const STOPLOSS = "position_stopLosses";
  const AVERAGE_PRICES = "position_averagePrices";
  const TARGETS = "position_targets";

  React.useEffect(() => {
    let averagePrices = getItem(AVERAGE_PRICES) || {}
    let targets = getItem(TARGETS) || {}
    let stopLosses = getItem(STOPLOSS) || {}

    if (averagePrices) {
      console.log('setAveragePrices', averagePrices);
      setAveragePrices(averagePrices)
    }
    if (stopLosses) {
      console.log('setStopLosses', stopLosses);
      setStopLosses(stopLosses)
    }
    if (targets) {
      console.log('setTargets', targets);
      setTargets(targets)
    }
  }, [])

  React.useEffect(() => {
    if (Object.keys(stopLosses).length) {
      setItem(STOPLOSS, stopLosses)
    }
  }, [stopLosses])


  React.useEffect(() => {
    if (Object.keys(averagePrices).length) {
      setItem(AVERAGE_PRICES, averagePrices)
    }
  }, [averagePrices])

  React.useEffect(() => {
    if (Object.keys(targets).length) {
      setItem(TARGETS, targets)
    }
  }, [targets])


  const setStopLoss = React.useCallback((instrument, price) => {
    console.log('setStopLosses', instrument, price);
    setStopLosses(prev => {
      return {
        ...prev,
        [instrument]: {
          value: price
        }
      }
    })
  }, [])

  function setTarget(instrument, price) {
    console.log('setTarget', instrument, price);
    setTargets(prev => {
      return {
        ...prev,
        [instrument]: {
          value: price
        }
      }
    })
  }

  function setAveragePrice(instrument, price) {
    console.log('setAveragePrice', instrument, price);
    setAveragePrices(prev => {
      return {
        ...prev,
        [instrument]: {
          price: price
        }
      }
    })
  }

  return {
    averagePrices, setAveragePrice, setStopLoss, stopLosses, targets, setTarget
  }
}