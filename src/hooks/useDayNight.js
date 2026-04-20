import { useEffect, useState } from "react"

export function useDayNight(lat, lon) {
  const [isNight, setIsNight] = useState(false)

useEffect(() => {
  async function fetchSun() {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=auto`
    )

    const data = await res.json()

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=sunrise,sunset&timezone=Europe/Paris`
    )

    const weatherData = await weatherRes.json()

    console.log("weather:", weatherData)

    const sunrise = new Date(data.daily.sunrise[0])
    const sunset = new Date(data.daily.sunset[0])
    const now = new Date()

    setIsNight(now < sunrise || now > sunset)
  }

  fetchSun()
  const interval = setInterval(fetchSun, 600000)

  return () => clearInterval(interval)
}, [lat, lon])

  return isNight
}