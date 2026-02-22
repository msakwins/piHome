import { useEffect, useState } from "react"
// OpenWeather API key fd77b9334ee8f53a0612a6117d8fb1d7

// const ApiKey = "fd77b9334ee8f53a0612a6117d8fb1d7";

export function useDayNight(lat, lon) {
  const [isNight, setIsNight] = useState(false)

  useEffect(() => {
    async function fetchSun() {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=auto`
      )
      const data = await res.json()
      console.log("weather:", await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=sunrise,sunset&timezone=Europe/Paris`

      ));

      const sunrise = new Date(data.daily.sunrise[0])
      const sunset = new Date(data.daily.sunset[0])
      const now = new Date()

      setIsNight(now < sunrise || now > sunset)
    }

    fetchSun()
    const interval = setInterval(fetchSun, 600000) // refresh toutes les 10 min

    return () => clearInterval(interval)
  }, [lat, lon])

  return isNight
}