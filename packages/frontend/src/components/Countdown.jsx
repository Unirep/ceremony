import React from 'react'
import { observer } from 'mobx-react-lite'
import './countdown.css'

export default observer(() => {
  return (
    <div className="countdown-container">
      <div className="countdown-time">05d</div>
      <div>:</div>
      <div className="countdown-time">05h</div>
      <div>:</div>
      <div className="countdown-time">05m</div>
      <div>:</div>
      <div className="countdown-time">05s</div>
    </div>
  )
})
