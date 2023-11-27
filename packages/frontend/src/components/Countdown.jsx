import React from 'react'
import { observer } from 'mobx-react-lite'
import './countdown.css'

export default observer(() => {
  const [remainTime, setRemainTime] = React.useState([0, 0, 0, 0])

  const updateTimer = async () => {
    const dday = new Date(Date.UTC(2023, 11, 12, 0, 0, 0))
    const now = Date.now()
    let dSeconds = Math.floor((dday - now) / 1000)
    const dDays = Math.floor(dSeconds / (24 * 60 * 60))
    dSeconds -= dDays * 24 * 60 * 60
    const dHours = Math.floor(dSeconds / (60 * 60))
    dSeconds -= dHours * 60 * 60
    const dMinutes = Math.floor(dSeconds / 60)
    dSeconds -= dMinutes * 60
    setRemainTime([dDays, dHours, dMinutes, dSeconds])
  }

  React.useEffect(() => {
    setInterval(() => {
      updateTimer()
    }, 1000)
  }, [])

  return (
    <div className="countdown-container">
      <div className="countdown-time">
        {remainTime[0].toString().padStart(2, '0')}d
      </div>
      <div>:</div>
      <div className="countdown-time">
        {remainTime[1].toString().padStart(2, '0')}h
      </div>
      <div>:</div>
      <div className="countdown-time">
        {remainTime[2].toString().padStart(2, '0')}m
      </div>
      <div>:</div>
      <div className="countdown-time">
        {remainTime[3].toString().padStart(2, '0')}s
      </div>
    </div>
  )
})
