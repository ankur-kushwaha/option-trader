import React, { useContext, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { API_KEY } from '../lib/constants'
import PositionContext, { Position, PositionActions, Stoploss, Target } from './context/PositionsContext'
import useQuotes from './hooks/useQuotes';

function Positions() {

  let { state,dispatch} = useContext(PositionContext);
  const {stopLosses,targets} = state;

  // const {depth} = useQuotes(state.positions);
  
  // console.log(1,depth);  
  

  let positions = state.filteredPositions?.map(item => {
    let stoploss = stopLosses?.[item.tradingsymbol];
    let target = targets?.[item.tradingsymbol];
    let hasStoplossHit;
    let hasTargetHit;

    if(item.quantity > 0){
      if(stoploss?.change && Number(stoploss?.change) > Number(item.change)){
        hasStoplossHit = true
      }
      if(target?.change && Number(target?.change) < Number(item.change)){
        hasTargetHit = true;
      }
    }

    if(item.quantity < 0 ){
      if(stoploss?.change && Number(stoploss?.change) < Number(item.change)){
        hasStoplossHit = true
      }
      if(target?.change && Number(target?.change) > Number(item.change)){
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
      change: ((item.last_price - item.average_price) / item.average_price * 100).toFixed(2),
      hasStoplossHit,
      hasTargetHit
    }
  }) || [];


  function handleTrailStoplossChange(position,checked){
    let newStoplosses = {
      ...stopLosses,
      [position.instrument]: {
        ...stopLosses[position.instrument],
        trailStoploss:checked
      }
    }
    dispatch && dispatch({
      type:PositionActions.SET_STOPLOSSES,
      payload:newStoplosses
    });
  }

  function handleStoplossChange(position, change) {
    let newStoplosses = {
      ...stopLosses,
      [position.instrument]: {
        ...stopLosses[position.instrument],
        change,
        value: (position.average + change/100*position.average).toFixed(2),
      }
    }
    // setStopLosses(newStoplosses)
    
    dispatch && dispatch({
      type:PositionActions.SET_STOPLOSSES,
      payload:newStoplosses
    });
  }

  function handleTargetChange(position, change) {
    let newTargets = {
      ...targets,
      [position.instrument]: {
        change,
        value: (position.average + change/100*position.average).toFixed(2),
      }
    }
    // setTargets(newTargets)
    dispatch && dispatch({
      type:PositionActions.SET_TARGETS,
      payload:newTargets
    })
  }

  return (
    <div className="pt-100" style={{ fontSize: "12px" }}>
      <Table className='table' bordered size={"sm"}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Instrument</th>
            <th>Qty</th>
            
            <th>Buy</th>
            
            <th>Target</th>
            <th>Change</th>
            <th>Stoploss</th>
            <th>P&L</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(position => <tr
            className={position.pnl > 0 ? 'text-success' : "text-danger"}
            key={position.instrument}>
            <td>{position.product}</td>
            <td>{position.instrument}</td>
            <td>{position.qty}</td>
            <td>{position.average}</td>
            <td><div>
              <input type="number"
              value={targets?.[position.instrument]?.change}
              onChange={(e) => handleTargetChange(position, e.target.value)} /><br/>
              {targets?.[position.instrument]?.value}

              </div>
              {position.hasTargetHit && "(target hit)"}
            </td>
            <td>{position.change}%<br/>
            {position.ltp}
            </td>
            <td><div>
              <input type="number"
              value={stopLosses?.[position.instrument]?.change}
              onChange={(e) => handleStoplossChange(position, e.target.value)} />
              &nbsp;
              <input type="checkbox" checked={stopLosses?.[position.instrument]?.trailStoploss} onChange={(e)=>handleTrailStoplossChange(position,e.target.checked)} />
              <br/>
              
              {stopLosses?.[position.instrument]?.value}

              </div>
              {position.hasStoplossHit && "(stoploss hit)"}
            </td>
            <td>{position.pnl.toFixed(2)}</td>
            
          </tr>)}
        </tbody>
      </Table>
    </div>
  )
}

export default Positions
