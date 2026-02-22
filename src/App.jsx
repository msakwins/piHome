import React, { useState } from "react"

// import { useState } from 'react'
// import { seasons } from "./themes"
import Clock from "./components/Clock/Clock"
import Metro from "./components/Metro/Metro"
import Weather from "./components/Weather/Weather"
import './style.css'
import { paintings } from "./paintings"
// import { useDayNight } from './hooks/useDayNight'

function App() {
  // const [season, setSeason] = useState("winter")
  // const isNight = useDayNight(48.85, 2.35)
  // const theme = seasons[season]

// const background = isNight ? theme.bgNight : theme.bgDay

const [randomImage] = useState(
  paintings[Math.floor(Math.random() * paintings.length)]
)
return (
  <div className="app" style={{ backgroundImage: `url(${randomImage.src})` }}>
    <div className="header glass-effect">
    <div className="glass-reflection" />
      <Clock />
      <Weather />
    </div>
    <div className="main">
      <Metro />
      <div className="mesure">
        <div className="co2 glass-effect"></div>
        <div className="particule glass-effect"></div>
      </div>
    </div>
      <div className="painting-info">
        <h2>{randomImage.title}</h2>
        <p>{randomImage.artist}</p>
      </div>
    </div>
  )
}

export default App
