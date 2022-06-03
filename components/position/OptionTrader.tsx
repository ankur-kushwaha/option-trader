import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { PositionFilters } from './PositionFilters'
import Positions from './PositionsTable'

export default function OptionTrader() {
  return (
    <div>
      <header>
      </header>
      <div className="main-container">
        <Row>
          <Col xs={3}>
            <PositionFilters></PositionFilters>
          </Col>
          <Col>
            <Positions></Positions>
          </Col>
        </Row>
      </div>
    </div>
  )
}
