import "./clock.css"
import React from "react"
import { useEffect, useState } from "react"

export default function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const hour = time.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  })

  const date = time.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  return (
    <div className="clock font-shadow">
      <div className="time">{hour}</div>
      <div className="date-city">
        <span className="city">Cachan</span>
        <span className="date">{date}</span>
      </div>
    </div>
  )
}