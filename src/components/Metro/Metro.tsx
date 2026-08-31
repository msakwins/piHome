import { useEffect, useState } from "react";
import styled from "styled-components";
import { getNextTrain } from "../getNextTrain";
import { getDirection } from "./getDirection";

interface Train {
  MonitoredVehicleJourney: {
    DestinationName: [{ value: string }];
    DirectionRef?: { value?: string };
    MonitoredCall: {
      ExpectedDepartureTime: string;
    };
  };
}

const MetroContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 500px;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  font-size: 24px;
`;

const MetroHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const MetroMap = styled.img`
  width: 44px;
  min-width: 44px;
`;

const MetroTitle = styled.h2`
  margin: 0;
  font-size: 28px;
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
    font-size: 22px;
    margin: 18px 0 8px;
    font-weight: 600;
  }
`;

const TrainRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin: 7px 0;
  font-size: 20px;
`;

const Destination = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TimeBadge = styled.span`
  flex-shrink: 0;
  font-size: 22px;
  font-weight: 700;
`;

export default function Metro() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loaded, setLoaded] = useState(false);

  const northTrains = trains
    .filter((train) => getDirection(train.MonitoredVehicleJourney) === "north")
    .slice(0, 4);

  const southTrains = trains
    .filter((train) => getDirection(train.MonitoredVehicleJourney) === "south")
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
        {!loaded ? (
          <LoadingText>Fetching departures...</LoadingText>
        ) : trains.length === 0 ? (
          <StatusMessage>
            <p>No upcoming departures</p>
          </StatusMessage>
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
