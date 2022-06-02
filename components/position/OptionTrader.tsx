import React, { useContext, useEffect, useState } from 'react'
import { Alert, Button, Col, Row } from 'react-bootstrap'
import { getItem } from '../../utils/storage'
import PositionContext, { PositionActions, Stoploss } from './PositionsContext'

import { PositionFilters } from './PositionFilters'
import Positions from './PositionsTable'

function notifyMe(msg, { onClick }) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(msg);
    notification.addEventListener('click', onClick);
    notification.close();
    return notification;
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}


export default function OptionTrader() {

  const { state, dispatch } = React.useContext(PositionContext);
  const [shouldRun, setShouldRun] = React.useState(true)
  let { stopLosses, targets,positions } = state;

  
  const handleTriggerClick = React.useCallback(()=>{

    let stoplossHit: String[] = [];
    let targethit: String[] = [];

    let newStoplosses = { ...stopLosses };
    let newTargets = { ...targets };

    let hasStoplossUpdated = false;

    for (let position of positions) {
      let stoploss = newStoplosses?.[position.tradingsymbol];
      let target = newTargets?.[position.tradingsymbol];

      let item = position;

      if (item.quantity > 0) {
        if (stoploss?.change && Number(stoploss?.change) > Number(item.change)) {
          stoplossHit.push(item.tradingsymbol)
        }
        if (target?.change && Number(target?.change) < Number(item.change)) {
          targethit.push(item.tradingsymbol)
        }
      }

      if (item.quantity < 0) {
        if (stoploss?.change) {
          if(Number(stoploss?.change) < Number(item.change)){
            stoplossHit.push(item.tradingsymbol)
          } else if (stoploss.trailStoploss != undefined &&  Number(stoploss?.change) - Number(item.change) > 10) {
            hasStoplossUpdated = true
            let newValue = Math.floor(Number(item.change) + 10);

            if(newValue < stoploss.change){

              console.log('updating stoploss', item.tradingsymbol, {
                old: stoploss.change,
                newValue
              });
              
              stoploss.change = newValue
              stoploss.value = position.average_price + position.average_price * newValue / 100;
            }
          }
        }
        
        if (target?.change && Number(target?.change) > Number(item.change)) {
          targethit.push(item.tradingsymbol)
        }
      }
    }

    if (hasStoplossUpdated) {
      dispatch && dispatch({
        type: PositionActions.SET_STOPLOSSES,
        payload: newStoplosses
      })
    }

    console.log({ stoplossHit, targethit });

    if (stoplossHit.length > 0) {
      notifyMe("Stoploss hit...", {
        onClick: function () {
          window.open("https://kite.zerodha.com/positions", "_blank")
        }
      })
    }

    if (targethit.length > 0) {
      notifyMe("Target hit...", {
        onClick: function () {
          window.open("https://kite.zerodha.com/positions", "_blank")
        }
      })
    }

  },[dispatch, positions, stopLosses, targets])

  useEffect(() => {
    let stopLosses = getItem('stopLosses');
    let targets = getItem('targets');
    if(stopLosses){
      dispatch && dispatch({    
        type: PositionActions.SET_STOPLOSSES,
        payload: stopLosses
      })
    }
    if(targets){
      dispatch && dispatch({
        type: PositionActions.SET_TARGETS,
        payload: targets
      });
    }
  }, [])

  const updatePositions  = React.useCallback(async()=>{
    let res = await fetch('/api/positions').then(res=>res.json())
    if(res.data){
      let positions = res.data.net.filter(item=>item.product=='NRML' && item.quantity!=0).map((item)=>{return {
        ...item,
        change:((item.last_price-item.average_price)/item.average_price*100).toFixed(2)
      }})
      dispatch && dispatch({
        type:PositionActions.SET_POSITIONS,
        payload:positions
      })
    }else{
      console.error(res);
    }
  },[])

  useEffect(()=>{
    let id = setInterval(()=>{
      if(shouldRun){
        updatePositions();
        handleTriggerClick();
      }
    },10000)

    return ()=>{
      clearInterval(id)
    }
  },[state,shouldRun])

  function start(){
    setShouldRun(true)
  }

  function stop(){
    setShouldRun(false)
  }


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
        <Row>
          <Col className='gap-2'>
          
          <Button variant={'primary'} onClick={handleTriggerClick}>Trigger Timer</Button>
          &nbsp;
          <Button variant={'primary'} onClick={updatePositions}>Refresh Position</Button>
          &nbsp;
          <Button variant={'primary'} onClick={start}>Start</Button>
          &nbsp;
          <Button variant={'primary'} onClick={stop}>Stop</Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}
