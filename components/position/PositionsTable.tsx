import React, { useContext, useEffect } from 'react'

import { API_KEY } from '../../lib/constants'
import PositionContext, { Position, PositionActions, Stoploss, Target } from './PositionsContext'
import useQuotes from '../common/hooks/useQuotes';
import Table, { Column } from '../common/Table';

type AveragePrices = {
  [key: string]: {
    price: number
  }
}

function Positions() {

  let { state, dispatch } = useContext(PositionContext);
  const [averagePrices, setAveragePrice] = React.useState<AveragePrices>({});

  const { stopLosses, targets, optionTypesState, transactionTypesState } = state;

  // const {depth} = useQuotes(state.positions);

  // console.log(1,depth);  
  let filteredPositions = state.positions.filter(item => {
    if (optionTypesState?.ce && optionTypesState?.pe) {
      return true
    }
    if (optionTypesState?.ce) {
      return item.tradingsymbol.indexOf('CE') > -1
    }
    if (optionTypesState?.pe) {
      return item.tradingsymbol.indexOf('PE') > -1
    }

    return true;
  }).filter(item => {
    if (transactionTypesState?.buy && transactionTypesState?.sell) {
      return true;
    }
    if (transactionTypesState?.buy) {
      return item.quantity > 0
    }
    if (transactionTypesState?.sell) {
      return item.quantity < 0
    }
    return true;
  })


  let positions = filteredPositions?.map(item => {
    let stoploss = stopLosses?.[item.tradingsymbol];
    let target = targets?.[item.tradingsymbol];
    let hasStoplossHit;
    let hasTargetHit;

    if (item.quantity > 0) {
      if (stoploss?.change && Number(stoploss?.change) > Number(item.change)) {
        hasStoplossHit = true
      }
      if (target?.change && Number(target?.change) < Number(item.change)) {
        hasTargetHit = true;
      }
    }

    if (item.quantity < 0) {
      if (stoploss?.change && Number(stoploss?.change) < Number(item.change)) {
        hasStoplossHit = true
      }
      if (target?.change && Number(target?.change) > Number(item.change)) {
        hasTargetHit = true
      }
    }

    return {
      product: item.product,
      instrument: item.tradingsymbol,
      qty: item.quantity,
      ltp: item.last_price,
      average: item.average_price,
      pnl: item.pnl,
      change: ((Number(item.last_price) - Number(item.average_price)) / Number(item.average_price) * 100).toFixed(2),
      hasStoplossHit,
      hasTargetHit
    }
  }) || [];


  function handleTrailStoplossChange(position, checked) {
    let newStoplosses = {
      ...stopLosses,
      [position.instrument]: {
        ...stopLosses[position.instrument],
        trailStoploss: checked
      }
    }
    dispatch && dispatch({
      type: PositionActions.SET_STOPLOSSES,
      payload: newStoplosses
    });
  }

  function handleStoplossChange(position, change) {
    let newStoplosses = {
      ...stopLosses,
      [position.instrument]: {
        ...stopLosses[position.instrument],
        change,
        value: (position.average + change / 100 * position.average).toFixed(2),
      }
    }
    // setStopLosses(newStoplosses)

    dispatch && dispatch({
      type: PositionActions.SET_STOPLOSSES,
      payload: newStoplosses
    });
  }

  function handleTargetChange(position, change) {
    let newTargets = {
      ...targets,
      [position.instrument]: {
        change,
        value: (Number(position.average) + change / 100 * Number(position.average)).toFixed(2),
      }
    }
    // setTargets(newTargets)
    dispatch && dispatch({
      type: PositionActions.SET_TARGETS,
      payload: newTargets
    })
  }

  useEffect(() => {
    
    let averagePrices = positions.reduce<AveragePrices>((a, b) => {
      a[b.instrument] = {
        price: b.average
      }
      return a;
    }, {})
    setAveragePrice(averagePrices)
  }, [])

  function updatePrice(instrument,price){
    setAveragePrice({
      ...averagePrices,
      [instrument]:{
        price
      }
    })
  }


  return (
    <div className="pt-100" style={{ fontSize: "12px" }}>
      <Table data={positions}>
        <Column selector='instrument'></Column>
        <Column selector='product'></Column>
        <Column selector='qty'></Column>
        <Column selector='average'>
          {position => (
            <>
              <input type="number" onChange={(e)=>updatePrice(position.instrument,e.target.value)} value={averagePrices[position.instrument]?.price} />
            </>
          )}
        </Column>
        <Column selector='product'>
          {position => (<><div>
            <input type="number"
              value={targets?.[position.instrument]?.change}
              onChange={(e) => handleTargetChange(position, e.target.value)} /><br />
            {targets?.[position.instrument]?.value}

          </div>
            {position.hasTargetHit && "(target hit)"}
          </>
          )}

        </Column>
        <Column selector='change'>
          {position => (<>{position.change}%<br />
            {position.ltp}</>)}
        </Column>

        <Column selector='product'>
          {position => (<><div>
            <input type="number"
              value={stopLosses?.[position.instrument]?.change}
              onChange={(e) => handleStoplossChange(position, e.target.value)} />
            &nbsp;
            <input type="checkbox" checked={stopLosses?.[position.instrument]?.trailStoploss} onChange={(e) => handleTrailStoplossChange(position, e.target.checked)} />
            <br />

            {stopLosses?.[position.instrument]?.value}

          </div>
            {position.hasStoplossHit && "(stoploss hit)"}</>)}
        </Column>
        <Column selector='pnl'></Column>

      </Table>
    </div>
  )
}

export default Positions
