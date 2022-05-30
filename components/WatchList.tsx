import React from 'react'

export default function WatchList() {
  let items = [{
    stockCode: "TATAPOWER",
    dayChange: "",
    ltp: ""
  }]
  return (
    <div className="col-flex">
      <div className="row">
        <input type="text" />
      </div>
      {items.map(item => <div key={item.stockCode} className="row">
        <div className="row-flex">
          <div className="col">
            {item.stockCode}
          </div>
          <div className="col">
            {item.dayChange}
          </div>
          <div className="col">
            {item.ltp}
          </div>
        </div>
      </div>)}

    </div>
  )
}
