import { useContext, useEffect, useState } from "react";
import { getItem, setItem } from "../utils/storage";
import PositionContext, { PositionActions } from "./context/PositionsContext";

function FilterBlock({ header, options, onSelection }) {

  const [state, setState] = useState({});

  function handleChange(e) {
    let newState ={
      ...state,
      [e.target.value]: e.target.checked
    }
    setState(newState)
    onSelection(newState)
  }

  return <div className="filter-block">
    <h6>{header}</h6>
    {options.map(item => (<div key={item.name} className="form-check">
      <input checked={item.selected} onChange={handleChange} className="form-check-input" type="checkbox" value={item.value} id="defaultCheck1" />
      <label className="form-check-label" htmlFor="defaultCheck1">
        {item.name}
      </label>
    </div>
    ))}


  </div>
}


type Filters = {
  optionTypes: {

  },
  transactionTypes: {

  }
}

export function PositionFilters() {

  const [filters, setFilters] = useState<Filters>({
    optionTypes: {},
    transactionTypes: {}
  })

  const { state, dispatch } = useContext(PositionContext);

  function handleSelection(key, values) {
    let newFilters = {
      ...filters,
      [key]: values
    }
    setFilters(newFilters)
    setItem('positionFilters', newFilters);
    dispatch && dispatch({
      type: PositionActions.SET_POSITION_FILTERS,
      payload: newFilters
    });
  }

  useEffect(() => {
    let positionsFilters = getItem('positionFilters')
    console.log('positionsFilters', positionsFilters);

    setFilters(positionsFilters);
    dispatch && dispatch({
      type: PositionActions.SET_POSITION_FILTERS,
      payload: positionsFilters
    });
  }, [])

  let transactionTypeOptions = [{ name: "Buy", value: "buy", selected: false }, { name: "Sell", "value": "sell", selected: false }]
  let optionTypes = [{ name: "CE", value: "ce", selected: false }, { name: "PE", "value": "pe" }]
  for (let option of optionTypes) {
    option.selected = filters.optionTypes[option.value]
  }
  for (let option of transactionTypeOptions) {
    option.selected = filters.transactionTypes[option.value]
  }

  return <>
    <FilterBlock header={"Transaction Type"} options={transactionTypeOptions} onSelection={(values) => handleSelection('transactionTypes', values)} ></FilterBlock>
    <FilterBlock header={"Option Type"} options={optionTypes} onSelection={(values) => handleSelection('optionTypes', values)} ></FilterBlock>
  </>
}