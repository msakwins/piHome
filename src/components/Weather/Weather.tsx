import { useState, useEffect } from "react";
import "./weather.css";

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  description: string;
  weatherCode: number;
}

const lat = 48.85, lon = 2.35;

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mapper les codes météo en descriptions françaises
  const weatherDescriptions: Record<number, { icon: string; text: string }> = {
    0: { icon: '☀️', text: 'Ciel dégagé' },
    1: { icon: '🌤️', text: 'Principalement dégagé' },
    2: { icon: '⛅', text: 'Partiellement nuageux' },
    3: { icon: '☁️', text: 'Couvert' },
    45: { icon: '🌫️', text: 'Brouillard' },
    48: { icon: '🌫️', text: 'Brouillard givrant' },
    51: { icon: '🌧️', text: 'Bruine légère' },
    53: { icon: '🌧️', text: 'Bruine modérée' },
    55: { icon: '🌧️', text: 'Bruine dense' },
    61: { icon: '🌧️', text: 'Pluie légère' },
    63: { icon: '🌧️', text: 'Pluie modérée' },
    65: { icon: '🌧️', text: 'Pluie forte' },
    71: { icon: '🌨️', text: 'Neige légère' },
    73: { icon: '🌨️', text: 'Neige modérée' },
    75: { icon: '🌨️', text: 'Neige forte' },
    80: { icon: '🌦️', text: 'Averses légères' },
    81: { icon: '🌦️', text: 'Averses modérées' },
    82: { icon: '🌦️', text: 'Averses violentes' },
    95: { icon: '⛈️', text: 'Orage' },
    96: { icon: '⛈️', text: 'Orage avec grêle' },
    99: { icon: '⛈️', text: 'Orage violent' }
  };

  interface DailyForecast {
    date: string;
    weatherCode: number;
    maxTemp: number;
    minTemp: number;
  }

  const [daily, setDaily] = useState<DailyForecast[]>([]);

  async function fetchWeather(): Promise<void> {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe/Paris`
      );

      const data = await response.json();
      console.log("weather:", data);

      const weatherInfo = weatherDescriptions[data.current.weather_code] || { icon: '🌡️', text: 'Météo' };

      setWeather({
        temp: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        icon: weatherInfo.icon,
        description: weatherInfo.text,
        weatherCode: data.current.weather_code
      });

      // Build daily forecast array (next 7 days)
      const dailyArray: DailyForecast[] = data.daily.time.slice(1, 8).map((date: string, idx: number) => ({
        date,
        weatherCode: data.daily.weather_code[idx + 1],
        maxTemp: Math.round(data.daily.temperature_2m_max[idx + 1]),
        minTemp: Math.round(data.daily.temperature_2m_min[idx + 1]),
      }));
      setDaily(dailyArray);

    } catch (error) {
      console.error("Erreur météo:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWeather();
    
    // Actualiser toutes les 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="weather">
        🌤️ Chargement...
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather">
        ❌ Météo indisponible
      </div>
    );
  }

  return (
    <div className="weather">
      <div className="weather-main">
        <span className="weather-icon">{weather.icon}</span>
        <span className="weather-temp font-shadow">{weather.temp}°<span>C</span></span>
        <span className="weather-desc font-shadow">{weather.description}</span>
      </div>
      <div className="weather-details">
        <span>💧</span><span className="weather-humidity font-shadow">{weather.humidity}%</span>
        <span>💨</span><span className="weather-wind-speed font-shadow">{weather.windSpeed} km/h</span>
      </div>
      {/* Weekly forecast */}
      <div className="weekly-forecast">
        {daily.map((day) => {
          const icon = weatherDescriptions[day.weatherCode]?.icon || '❓';
          const dateObj = new Date(day.date);
          const frenchDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
          const dayLabel = frenchDays[dateObj.getDay()];
          return (
            <div key={day.date} className="forecast-day">
              <div className="forecast-day-label">{dayLabel}</div>
              <div className="forecast-icon">{icon}</div>
              <div className="forecast-temp">{day.maxTemp}°/{day.minTemp}°</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}