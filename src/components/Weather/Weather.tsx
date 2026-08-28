import { useEffect, useState } from "react";
import styled from "styled-components";

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  description: string;
  weatherCode: number;
}

interface DailyForecast {
  date: string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
}

const WeatherContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WeatherMain = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

const WeatherIcon = styled.span`
  font-size: 32px;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
`;

const WeatherTemp = styled.span`
  font-weight: 700;
  font-size: 30px;

  span {
    font-size: 28px;
    font-weight: 500;
  }
`;

const WeatherDesc = styled.span`
  font-size: 24px;
  font-weight: 600;
  margin-left: 10px;
`;

const WeatherDetails = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  gap: 1rem;
  font-size: 16px;
  opacity: 0.9;
`;

const WeeklyForecast = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
`;

const ForecastDay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: white;
`;

const ForecastDayLabel = styled.div`
  font-size: 12px;
  margin-bottom: 2px;
  color: #ddd;
`;

const ForecastIcon = styled.div`
  font-size: 20px;
`;

const ForecastTemp = styled.div`
  margin-top: 2px;
`;

const lat = 48.85;
const lon = 2.35;

const weatherDescriptions: Record<number, { icon: string; text: string }> = {
  0: { icon: "☀️", text: "Ciel dégagé" },
  1: { icon: "🌤️", text: "Principalement dégagé" },
  2: { icon: "⛅", text: "Partiellement nuageux" },
  3: { icon: "☁️", text: "Couvert" },
  45: { icon: "🌫️", text: "Brouillard" },
  48: { icon: "🌫️", text: "Brouillard givrant" },
  51: { icon: "🌧️", text: "Bruine légère" },
  53: { icon: "🌧️", text: "Bruine modérée" },
  55: { icon: "🌧️", text: "Bruine dense" },
  61: { icon: "🌧️", text: "Pluie légère" },
  63: { icon: "🌧️", text: "Pluie modérée" },
  65: { icon: "🌧️", text: "Pluie forte" },
  71: { icon: "🌨️", text: "Neige légère" },
  73: { icon: "🌨️", text: "Neige modérée" },
  75: { icon: "🌨️", text: "Neige forte" },
  80: { icon: "🌦️", text: "Averses légères" },
  81: { icon: "🌦️", text: "Averses modérées" },
  82: { icon: "🌦️", text: "Averses violentes" },
  95: { icon: "⛈️", text: "Orage" },
  96: { icon: "⛈️", text: "Orage avec grêle" },
  99: { icon: "⛈️", text: "Orage violent" },
};

const frenchDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [daily, setDaily] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchWeather(signal?: AbortSignal): Promise<void> {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe/Paris`,
        { signal }
      );

      if (!response.ok) {
        throw new Error(`Open-Meteo request failed with status ${response.status}`);
      }

      const data = await response.json();
      const weatherInfo = weatherDescriptions[data.current.weather_code] ?? {
        icon: "🌡️",
        text: "Météo",
      };

      setWeather({
        temp: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        icon: weatherInfo.icon,
        description: weatherInfo.text,
        weatherCode: data.current.weather_code,
      });

      const dailyArray: DailyForecast[] = data.daily.time.slice(1, 8).map((date: string, idx: number) => ({
        date,
        weatherCode: data.daily.weather_code[idx + 1],
        maxTemp: Math.round(data.daily.temperature_2m_max[idx + 1]),
        minTemp: Math.round(data.daily.temperature_2m_min[idx + 1]),
      }));

      setDaily(dailyArray);
      setError(null);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error("Erreur météo:", error);
      setWeather(null);
      setDaily([]);
      setError("Météo indisponible pour le moment.");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    fetchWeather(controller.signal);

    const interval = setInterval(() => fetchWeather(controller.signal), 30 * 60 * 1000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <WeatherContainer>🌤️ Chargement...</WeatherContainer>;
  }

  if (error) {
    return <WeatherContainer>❌ {error}</WeatherContainer>;
  }

  if (!weather) {
    return <WeatherContainer>❌ Météo indisponible</WeatherContainer>;
  }

  return (
    <WeatherContainer>
      <WeatherMain>
        <WeatherIcon>{weather.icon}</WeatherIcon>
        <WeatherTemp>
          {weather.temp}°<span>C</span>
        </WeatherTemp>
        <WeatherDesc>{weather.description}</WeatherDesc>
      </WeatherMain>
      <WeatherDetails>
        <span>💧</span>
        <span>{weather.humidity}%</span>
        <span>💨</span>
        <span>{weather.windSpeed} km/h</span>
      </WeatherDetails>
      <WeeklyForecast>
        {daily.map((day) => {
          const icon = weatherDescriptions[day.weatherCode]?.icon || "❓";
          const dateObj = new Date(day.date);
          const dayLabel = frenchDays[dateObj.getDay()];

          return (
            <ForecastDay key={day.date}>
              <ForecastDayLabel>{dayLabel}</ForecastDayLabel>
              <ForecastIcon>{icon}</ForecastIcon>
              <ForecastTemp>
                {day.maxTemp}°/{day.minTemp}°
              </ForecastTemp>
            </ForecastDay>
          );
        })}
      </WeeklyForecast>
    </WeatherContainer>
  );
}
