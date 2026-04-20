import { useEffect, useState } from "react";
import { getBackgroundColor } from "./getBackgroundColor";
import { fontTheme } from "./themes";
import { ThemeMode } from "./types/themes";
import { SensorData } from "./types/sensor";
import { paintings } from "./paintings";
import { getMockSensorData } from "./mockSensor";
import Clock from "./components/Clock/Clock";
import Metro from "./components/Metro/Metro";
import Weather from "./components/Weather/Weather";
import './style.css';

function App() {
  const [fontColorTheme, setFontColorTheme] = useState<ThemeMode>("dark");
  const [randomImage] = useState(
    paintings[Math.floor(Math.random() * paintings.length)]
  );
  const [data, setData] = useState<SensorData | null>(getMockSensorData());

  useEffect(() => {
    getBackgroundColor(randomImage.src, ({ r, g, b }) => {
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      console.log("Brightness:", brightness);
      const theme = brightness > 14.5 ? "dark" : "light";
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
            <div className="gauge" style={{
              "--value": `${data.humidity}`,
              "--color1": "#4cc9f0",
              "--color2": "#3452eb"
            } as React.CSSProperties}>
              <div className="inner">
                💧
                <span>{data.humidity} %</span>
              </div>
            </div>
            <div className="gauge" style={{
              "--value": Math.min(data.co2 / 20, 100),
              "--color1": "#f9c74f",
              "--color2": "#f94144"
            } as React.CSSProperties}>
              <div className="inner">
                ☁️
                <span>{data.co2} ppm</span>
              </div>
            </div>
            <div className="gauge" style={{
              "--value": ((data.temperature - 10) / 20) * 100,
              "--color1": "#f5fa57",
              "--color2": "#f3722c",
            } as React.CSSProperties}>
              <div className="inner">
                🌡️
                <span>{data.temperature} °C</span>
              </div>
            </div>
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