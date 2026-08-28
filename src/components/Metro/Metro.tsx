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

export default function Metro() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loaded, setLoaded] = useState(false);

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

  // No hardcoded service window. RER B and metro 4 at Bagneux run well past
  // midnight, so the old 05:00-23:00 gate claimed "service resumes at 05:00" while
  // trains were still running. Let the API answer instead: an empty response
  // genuinely means there is nothing upcoming.
  const updateTrains = async (): Promise<void> => {
    const data = await getNextTrain();
    setTrains(Array.isArray(data) ? data.slice(0, 12) : []);
    setLoaded(true);
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
        {!loaded ? (
          <p className="loading-text">Fetching departures...</p>
        ) : trains.length === 0 ? (
          <div className="night-mode-msg">
            <p>No upcoming departures</p>
          </div>
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