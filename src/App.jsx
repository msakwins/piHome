import React, { useEffect, useState } from "react"

// import { useState } from 'react'
import { getBackgroundColor } from "./getBackgroundColor"
import { fontTheme } from "./themes"
import Clock from "./components/Clock/Clock"
import Metro from "./components/Metro/Metro"
import Weather from "./components/Weather/Weather"
import './style.css'
import { paintings } from "./paintings"
// import { useDayNight } from './hooks/useDayNight'

function App() {
  const [fontColorTheme, setFontColorTheme] = useState("dark");

  const [randomImage] = useState(
    paintings[Math.floor(Math.random() * paintings.length)]
  );

useEffect(() => {
  getBackgroundColor(randomImage.src, ({ r, g, b }) => {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    console.log("Brightness:", brightness);
    const theme = brightness > 14.5 ? "dark" : "light";
    setFontColorTheme(theme);
  });
}, [randomImage]);

return (
  <div className="app" style={{ backgroundImage: `url(${randomImage.src})`, ...fontTheme[fontColorTheme] }}>
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
      <div className="painting-info font-shadow">
        <h2>{randomImage.title}</h2>
        <p>{randomImage.artist}</p>
      </div>
    </div>
  )
}

export default App
