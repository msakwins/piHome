import { useEffect, useState } from "react";
import { getBackgroundColor } from "./getBackgroundColor";
import { fontTheme } from "./themes";
import { ThemeMode } from "./types/themes";
import { SensorData } from "./types/sensor";
import { paintings } from "./paintings";
import { getMockSensorData } from "./mockSensor";
import Clock from "./components/Clock/Clock";
import Gauge from "./components/Gauge/Gauge";
import Metro from "./components/Metro/Metro";
import Weather from "./components/Weather/Weather";
import './style.css';

function App() {
  const [fontColorTheme, setFontColorTheme] = useState<ThemeMode>("dark");
  const [randomImage] = useState(() => paintings[Math.floor(Math.random() * paintings.length)]);
  const [data, setData] = useState<SensorData | null>(() => getMockSensorData());

  useEffect(() => {
    getBackgroundColor(randomImage.src, ({ r, g, b }) => {
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      const theme = brightness > 145 ? "dark" : "light";
      setFontColorTheme(theme);
    });
  }, [randomImage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(getMockSensorData());
    }, 600000); // update every 10mn

    return () => clearInterval(interval);
  }, []);

  if (!data) return <p>Loading...</p>;

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
          <div className="co2 glass-effect">
            <Gauge
              value={data.humidity}
              from="#4cc9f0"
              to="#3452eb"
              icon="💧"
              label={`${data.humidity} %`}
            />
            {/* 400 ppm is roughly outdoor air, 2000 ppm is clearly bad indoors, so
                that span is what the ring should show. Gauge clamps above 100. */}
            <Gauge
              value={(data.co2 - 400) / 16}
              from="#86efac"
              to="#12b76a"
              icon="☁️"
              label={`${data.co2} ppm`}
            />
            <Gauge
              value={((data.temperature - 10) / 20) * 100}
              from="#f5fa57"
              to="#f3722c"
              icon="🌡️"
              label={`${data.temperature} °C`}
            />
          </div>
        </div>
      </div>
      <div className="painting-info font-shadow">
        <h2>{randomImage.title}</h2>
        <p>{randomImage.artist}</p>
      </div>
    </div>
  );
}

export default App;
