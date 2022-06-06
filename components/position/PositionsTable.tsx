import React, { useContext } from 'react'

import Table, { Column } from '../common/Table';
import { PositionsTable } from './types';
import PositionContext from './PositionsContext';
import TextField from '@mui/material/TextField';
import { Slider } from '@mui/material';
import { Box } from '@mui/system';


function Positions() {

  let { positionsTableData, targets, setTarget, stopLosses, setStopLoss, averagePrices, setAveragePrice } = useContext(PositionContext);

  return (
    <div>
      <Table data={positionsTableData}>
        <Column<PositionsTable> selector='tradingsymbol' name={"Instrument"}></Column>
        <Column selector='quantity' name='Quantity'></Column>
        <Column selector='averagePrice' name='Avg Price'></Column>

        <Column<PositionsTable> selector='adjustedAveragePrice' name='Price'>
          {(position) => (
            <>
            <Box sx={{ width: 100 }}>
              <TextField
                label="Price"
                id="outlined-size-small"
                onChange={(e) => setAveragePrice && setAveragePrice(position.tradingsymbol, e.target.value)}
                value={position.updatedAveragePrice.price}
                size="small"
                type={"number"}
              />
              </Box>
            </>
          )}
        </Column>
        <Column<PositionsTable> selector='target' name='Target'>
          {position => (<><div>
            <Box sx={{ width: 100 }}>
            <TextField
              label="Target"
              focused
              id="outlined-size-small"
              onChange={(e) => setTarget && setTarget(position.tradingsymbol, e.target.value)}
              value={position.target?.value}
              size="small"
              type={"number"}
              color={position.hasTargetHit ? "success" : undefined}
            />
            </Box>
          </div>
          </>
          )}

        </Column>
        <Column<PositionsTable> selector='change' name='Change'>
          {position => (<>{position.change}%<br />
            {position.lastPrice}</>)}
        </Column>

        <Column<PositionsTable> selector='stoploss' name="Stoploss">
          {position => (<><div>
            <Box sx={{ width: 100 }}>
            <TextField
              focused
              label="Stoploss"
              id="outlined-size-small"
              onChange={(e) => setStopLoss && setStopLoss(position.tradingsymbol, e.target.value)}
              value={position.stopLoss?.value}
              size="small"
              type={"number"}
              color={position.hasStoplossHit ? "error" : undefined}
            />
            </Box>
            
          </div>

          </>
          )}
        </Column>
        <Column selector='pnl' name="P&L"></Column>
        <Column<PositionsTable> selector={'pnl'} name="Slider">
          
          {(row) => {
            let marks = [{
              value:-60,
              label:"-60"
            },
            {
              value:0,
              label:"0"
            },{
              value:row.stopLoss?.value,
              label:"S"
            },{
              value:row.target?.value,
              label:"T"
            },{
              value:60,
              label:"60"
            }]
            return (
              <Box sx={{ width: 300 }}>
              <Slider
              min={-60}
              max={60}
                aria-label="Custom marks"
                valueLabelDisplay='auto'
                value={Number(row.change)}
                marks={marks}
                track={false}
                size={"small"}
              />
              </Box>
            )
          }}
        </Column>

      </Table>
    </div>
  )
}

export default Positions
