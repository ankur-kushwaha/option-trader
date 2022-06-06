import React, { useState } from 'react'
import useQuotes from '../common/hooks/useQuotes';
import Table, { Column } from '../common/Table'

let initialStocks = [{
  stockcode: "TATAPOWER"
}, {
  stockcode: "VEDL"
}
].map(item => {
  return {
    tradingsymbol: item.stockcode,
    product: "NSE"
  }
})


function AddStockForm({ onAddStock }) {
  const [instrument, setInsrument] = useState("");
  function handleChange(e) {
    setInsrument(e.target?.value)
  }

  function handleAddStock() {
    onAddStock(instrument);
    setInsrument("")
  }



  return (
    <>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">NSE:</span>
        <input onChange={handleChange} type="text" className="form-control" placeholder="Instrument" aria-label="Username" aria-describedby="basic-addon1" />
      </div>
      <button onClick={handleAddStock} type="button" className="btn btn-primary">Add Stock</button>
    </>
  )
}

type Stock = {
  tradingsymbol: string,
  product: string
}

export default function WatchList() {

  const [stocks, setStocks] = React.useState<Stock[]>(initialStocks);

  const [target, setTarget] = React.useState({
    "TATAPOWER": {
      price: 10
    }
  })


  function updateTarget(tradingsymbol, value) {
    setTarget({
      ...target,
      [tradingsymbol]: {
        price: value
      }
    })
  }

  function handleAddStock(newStock) {

    if (!stocks.find(item => item.tradingsymbol == newStock)) {
      setStocks([...stocks, {
        tradingsymbol: newStock,
        product: "NSE"
      }])
    }
  }


  function deleteInsrument(tradingsymbol) {
    let newStocks = stocks.filter(item => item.tradingsymbol != tradingsymbol);
    setStocks(newStocks);
  }


  return (
    <div>
      <Table<Stock> data={stocks}>
        <Column selector={"tradingsymbol"} name={"Instrument"}></Column>
        <Column<Stock> selector={"stockcode"} name={"Target"}>
          {(row) => {
            return <>
              <input type="number" value={target[row.tradingsymbol]?.price} onChange={(e) => updateTarget(row.tradingsymbol, e.target.value)} />
              {target[row.tradingsymbol]?.price}</>
          }}
        </Column>
        <Column<Stock> selector='stockcode'>
          {row => (<button onClick={() => deleteInsrument(row.tradingsymbol)} type="button" className="btn btn-primary">X</button>)}
        </Column>
      </Table>
      <AddStockForm onAddStock={handleAddStock} />
    </div>
  )
}
