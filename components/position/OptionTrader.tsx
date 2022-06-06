import { Container, Grid } from '@mui/material'
import React from 'react'
import { PositionFilters } from './PositionFilters'
import Positions from './PositionsTable'

export default function OptionTrader() {
  return (
    <>
      <PositionFilters></PositionFilters>
      <Positions></Positions>
    </>
  )
}
