import { useState, useEffect } from "react";
import { getNextTrain } from "../getNextTrain";
import { getDirection } from "./getDirection";
import "./metro.css";

interface Train {
  MonitoredVehicleJourney: {
    DestinationName: [{ value: string }];
    MonitoredCall: {
      ExpectedDepartureTime: string;
    };
  };
}

const isServiceActive = (): boolean => {
  const hours = new Date().getHours();
  // Active from 05:00:00 through 22:59:59
  return hours >= 5 && hours < 23;
};

export default function Metro() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [active, setActive] = useState(isServiceActive());

  const northTrains = trains
    .filter(train => 
      getDirection(train.MonitoredVehicleJourney.DestinationName[0].value) === 'north'
    )
    .slice(0, 4);

  const southTrains = trains
    .filter(train => 
      getDirection(train.MonitoredVehicleJourney.DestinationName[0].value) === 'south'
    )
    .slice(0, 4);

  const updateTrains = async (): Promise<void> => {
    const isNowActive = isServiceActive();
    setActive(isNowActive);

    if (isNowActive) {
      const data = await getNextTrain();
      if (Array.isArray(data)) {
        setTrains(data.slice(0, 12));
      }
    } else {
      setTrains([]); // Clear trains during night hours
    }
  };

  useEffect(() => {
    updateTrains();
    const interval = setInterval(updateTrains, 90000); // Check every 90s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="metro glass-effect font-shadow">
      <div className="glass-reflection" />
      <div className="metro-header">
        <img src="/rerb.png" alt="Metro Map" style={{ width: '36px', minWidth: '36px' }} />
        <h2 className="metro-title">Bagneux</h2>
      </div>

      <div className="schedule-list">
        {!active ? (
          <div className="night-mode-msg">
            <p>Service resumes at 05:00</p>
          </div>
        ) : trains.length === 0 ? (
          <p className="loading-text">Fetching departures...</p>
        ) : (
          <div className="trains-container">
            <div className="north-section">
              <h3>↑ Direction Nord</h3>
              {northTrains.map((train, index) => (
                <div key={index} className="train-row">
                  <span className="destination">
                    {train.MonitoredVehicleJourney.DestinationName[0].value.slice(0, 27)}
                  </span>
                  <span className="time-badge">
                    {Math.max(0, Math.floor((new Date(train.MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime).getTime() - new Date().getTime()) / 60000))} min
                  </span>
                </div>
              ))}
            </div>

            <div className="south-section">
              <h3>↓ Direction Sud</h3>
              {southTrains.map((train, index) => (
                <div key={index} className="train-row">
                  <span className="destination">
                    {train.MonitoredVehicleJourney.DestinationName[0].value}
                  </span>
                  <span className="time-badge">
                    {Math.max(0, Math.floor((new Date(train.MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime).getTime() - new Date().getTime()) / 60000))} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}