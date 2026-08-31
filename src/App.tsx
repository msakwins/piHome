import { useEffect, useState } from "react";
import { getBackgroundColor } from "./getBackgroundColor";
import { fontTheme } from "./themes";
import { ThemeMode } from "./types/themes";
import { SensorData } from "./types/sensor";
import { paintings } from "./paintings";
import { getMockSensorData } from "./mockSensor";
import { fetchSensorData } from "./sensor";
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

  // Start from mock values so the panel is never empty, then switch to the real
  // SCD41 as soon as the sensor service answers. A failed poll keeps the last
  // good reading rather than dropping back to fake numbers.
  useEffect(() => {
    let cancelled = false;
    let live = false;

    const poll = async (): Promise<void> => {
      const reading = await fetchSensorData();
      if (cancelled) return;

      if (reading) {
        live = true;
        setData(reading);
      } else if (!live) {
        setData(getMockSensorData());
      }
    };

    poll();
    const interval = setInterval(poll, 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="app" style={{ backgroundImage: `url(${randomImage.src})`, ...fontTheme[fontColorTheme] } as React.CSSProperties}>
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
              reading={`${data.humidity}`}
              unit="%"
            />
            {/* 400 ppm is roughly outdoor air, 2000 ppm is clearly bad indoors, so
                that span is what the ring should show. Gauge clamps above 100. */}
            <Gauge
              value={(data.co2 - 400) / 16}
              from="#86efac"
              to="#12b76a"
              icon="🍃"
              reading={`${data.co2}`}
              unit="ppm"
            />
            <Gauge
              value={((data.temperature - 10) / 20) * 100}
              from="#f5fa57"
              to="#f3722c"
              icon="🌡️"
              reading={`${data.temperature}`}
              unit="°C"
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
