import React, { useContext } from 'react'

import Table, { Column } from '../common/Table';
import { PositionsTable } from './types';
import PositionContext from './PositionsContext';

function Positions() {

  let { positionsTableData, targets, setTarget, stopLosses, setStopLoss, averagePrices, setAveragePrice } = useContext(PositionContext);


  // const {depth} = useQuotes(state.positions);

  // console.log(1,depth);  
  // let filteredPositions = state.positions


  // let positions = filteredPositions?.map(item => {
  //   let stoploss = stopLosses?.[item.tradingsymbol];
  //   let target = targets?.[item.tradingsymbol];
  //   let hasStoplossHit;
  //   let hasTargetHit;

  //   if (item.quantity > 0) {
  //     if (stoploss?.change && Number(stoploss?.change) > Number(item.change)) {
  //       hasStoplossHit = true
  //     }
  //     if (target?.change && Number(target?.change) < Number(item.change)) {
  //       hasTargetHit = true;
  //     }
  //   }

  //   if (item.quantity < 0) {
  //     if (stoploss?.change && Number(stoploss?.change) < Number(item.change)) {
  //       hasStoplossHit = true
  //     }
  //     if (target?.change && Number(target?.change) > Number(item.change)) {
  //       hasTargetHit = true
  //     }
  //   }

  //   return {
  //     product: item.product,
  //     instrument: item.tradingsymbol,
  //     qty: item.quantity,
  //     ltp: item.last_price,
  //     average: item.average_price,
  //     pnl: item.pnl,
  //     change: ((Number(item.last_price) - Number(item.average_price)) / Number(item.average_price) * 100).toFixed(2),
  //     hasStoplossHit,
  //     hasTargetHit
  //   }
  // }) || [];

  return (
    <div className="pt-100" style={{ fontSize: "12px" }}>
      <Table data={positionsTableData}>
        <Column<PositionsTable> selector='tradingsymbol'></Column>
        <Column selector='product'></Column>
        <Column selector='quantity'></Column>
        <Column<PositionsTable> selector='averagePrice'>
          {(position) => (
            <>
              <input type="number" onChange={(e) => setAveragePrice && setAveragePrice(position.tradingsymbol, e.target.value)} value={position.updatedAveragePrice.price} />
              <br />
              {position.averagePrice}
            </>
          )}
        </Column>
        <Column<PositionsTable> selector='target'>
          {position => (<><div>
            <input type="number"
              value={targets?.[position.tradingsymbol]?.value}
              onChange={(e) => setTarget && setTarget(position.tradingsymbol, e.target.value)} />
          </div>
            {position.hasTargetHit && "(target hit)"}
          </>
          )}

        </Column>
        <Column<PositionsTable> selector='change'>
          {position => (<>{position.change}%<br />
            {position.lastPrice}</>)}
        </Column>

        <Column<PositionsTable> selector='change' name="Stoploss">
          {position => (<><div>
            <input type="number"
              value={stopLosses?.[position.tradingsymbol]?.value}
              onChange={(e) => setStopLoss && setStopLoss(position.tradingsymbol, e.target.value)} />
            <br />
          </div>
            {position.hasStoplossHit && "(stoploss hit)"}
          </>
          )}
        </Column>
        <Column selector='pnl'></Column>

      </Table>
    </div>
  )
}

export default Positions
