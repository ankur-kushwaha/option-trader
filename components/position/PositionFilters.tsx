import { Button, Card, CardContent, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getItem, setItem } from "../../utils/storage";
import PositionContext from "./PositionsContext";
import { Filters } from "./types";


function FilterBlock({ header = "", options, onSelection }) {

  const [state, setState] = useState([]);

  function handleChange(e, newValues) {
    // let newState = {
    //   ...state,
    //   [e.target.value]: e.target.checked
    // }

    setState(newValues)
    onSelection(newValues.reduce((a, b) => {
      a[b] = true;
      return a;
    }, {}))
    console.log(e.target.value, newValues);

  }

  return <>
    {header && <span>{header}</span>}
    <ToggleButtonGroup
      color="primary"
      value={state}
      onChange={handleChange}
    >
      {options.map(item => {
        return <ToggleButton selected={item.selected} key={item.name} value={item.value}>{item.name}</ToggleButton>
      })}
    </ToggleButtonGroup>

  </>
}



export function PositionFilters({ }) {

  let { filters, setFilters, refresh } = React.useContext(PositionContext);

  useEffect(() => {
    let positionsFilters = getItem('positionFilters')
    if (positionsFilters) {
      console.log('setFilters', positionsFilters);
      setFilters && setFilters(positionsFilters);
    }
  }, [setFilters])

  const handleSelection = React.useCallback((key, values) => {
    let newFilters = {
      ...filters,
      [key]: values
    }

    console.log('setFilters', newFilters);
    setFilters && setFilters(newFilters)
    setItem('positionFilters', newFilters);
  }, [filters, setFilters])


  let transactionTypeOptions = [{ name: "Buy", value: "buy", selected: false }, { name: "Sell", "value": "sell", selected: false }]
  let optionTypes = [{ name: "CE", value: "ce", selected: false }, { name: "PE", "value": "pe" }]
  for (let option of optionTypes) {
    option.selected = filters.optionTypes[option.value]
  }
  for (let option of transactionTypeOptions) {
    option.selected = filters.transactionTypes[option.value]
  }

  return <>
    <Card>
      <CardContent>
        <Box  sx={{ display: 'flex' }}>
          <Box flexGrow={1}>
            <FilterBlock options={transactionTypeOptions} onSelection={(values) => handleSelection('transactionTypes', values)} ></FilterBlock>
            &nbsp;
            <FilterBlock options={optionTypes} onSelection={(values) => handleSelection('optionTypes', values)} ></FilterBlock>
          </Box>
          <Button variant="text" onClick={refresh}>Refresh</Button>
        </Box>
      </CardContent>
    </Card>
    <br />
  </>
}