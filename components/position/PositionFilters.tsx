import React, {  useEffect, useState } from "react";
import { getItem, setItem } from "../../utils/storage";
import PositionContext from "./PositionsContext";
import { Filters } from "./types";


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



export function PositionFilters() {

  let {filters,setFilters} = React.useContext(PositionContext);

  useEffect(() => {
    let positionsFilters = getItem('positionFilters')
    if(positionsFilters){
      console.log('setFilters', positionsFilters);
      setFilters && setFilters(positionsFilters);  
    }
  }, [setFilters])

  const handleSelection = React.useCallback((key, values)=> {
    let newFilters = {
      ...filters,
      [key]: values
    }
    
    console.log('setFilters',newFilters);
    setFilters && setFilters(newFilters)
    setItem('positionFilters', newFilters);
  },[filters, setFilters])


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