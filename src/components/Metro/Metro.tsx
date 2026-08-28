import { useEffect, useState } from "react";
import styled from "styled-components";
import { getNextTrain } from "../getNextTrain";
import { getDirection } from "./getDirection";

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
  return hours >= 5 && hours < 23;
};

const MetroContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 500px;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  font-size: 20px;
`;

const MetroHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const MetroMap = styled.img`
  width: 36px;
  min-width: 36px;
`;

const MetroTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
`;

const ScheduleList = styled.div`
  width: 100%;
`;

const StatusMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  text-align: center;
`;

const LoadingText = styled.p`
  margin: 0;
`;

const TrainsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
`;

const TrainSection = styled.section`
  > h3 {
    font-size: 18px;
    margin: 16px 0 6px;
    font-weight: 600;
  }
`;

const TrainRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin: 4px 0;
  font-size: 16px;
`;

const Destination = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TimeBadge = styled.span`
  flex-shrink: 0;
  font-size: 18px;
  font-weight: 700;
`;

export default function Metro() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [active, setActive] = useState(isServiceActive());

  const northTrains = trains
    .filter((train) => getDirection(train.MonitoredVehicleJourney.DestinationName[0].value) === "north")
    .slice(0, 4);

  const southTrains = trains
    .filter((train) => getDirection(train.MonitoredVehicleJourney.DestinationName[0].value) === "south")
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
      setTrains([]);
    }
  };

  useEffect(() => {
    updateTrains();
    const interval = setInterval(updateTrains, 90000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MetroContainer className="glass-effect">
      <div className="glass-reflection" />
      <MetroHeader>
        <MetroMap src="/rerb.png" alt="Metro Map" />
        <MetroTitle>Bagneux</MetroTitle>
      </MetroHeader>

      <ScheduleList>
        {!active ? (
          <StatusMessage>
            <p>Service resumes at 05:00</p>
          </StatusMessage>
        ) : trains.length === 0 ? (
          <LoadingText>Fetching departures...</LoadingText>
        ) : (
          <TrainsContainer>
            <TrainSection>
              <h3>↑ Direction Nord</h3>
              {northTrains.map((train, index) => (
                <TrainRow key={index}>
                  <Destination>
                    {train.MonitoredVehicleJourney.DestinationName[0].value.slice(0, 27)}
                  </Destination>
                  <TimeBadge>
                    {Math.max(
                      0,
                      Math.floor(
                        (new Date(train.MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime).getTime() -
                          new Date().getTime()) /
                          60000
                      )
                    )}{" "}
                    min
                  </TimeBadge>
                </TrainRow>
              ))}
            </TrainSection>

            <TrainSection>
              <h3>↓ Direction Sud</h3>
              {southTrains.map((train, index) => (
                <TrainRow key={index}>
                  <Destination>{train.MonitoredVehicleJourney.DestinationName[0].value}</Destination>
                  <TimeBadge>
                    {Math.max(
                      0,
                      Math.floor(
                        (new Date(train.MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime).getTime() -
                          new Date().getTime()) /
                          60000
                      )
                    )}{" "}
                    min
                  </TimeBadge>
                </TrainRow>
              ))}
            </TrainSection>
          </TrainsContainer>
        )}
      </ScheduleList>
    </MetroContainer>
  );
}
