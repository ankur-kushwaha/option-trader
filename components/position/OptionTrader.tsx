import { Container, Grid } from '@mui/material'
import React from 'react'
import { PositionFilters } from './PositionFilters'
import Positions from './PositionsTable'

export default function OptionTrader() {
  return (
        <Container fixed>
          <Grid container spacing={0}>
          <Grid item xs>
              {/* asdf */}
              <PositionFilters></PositionFilters>
            </Grid>
            <Grid item xs={12}>
              {/* adf */}
              <Positions></Positions>
            </Grid>
          </Grid>
        </Container>
    
  )
}
