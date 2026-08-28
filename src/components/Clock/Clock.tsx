import { useEffect, useState } from "react";
import styled from "styled-components";

const ClockContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  font-weight: 600;
  margin: 0;
  gap: 20px;
`;

const DateCity = styled.div`
  display: flex;
  flex-direction: column;
`;

const Time = styled.div`
  font-size: 66px;
  line-height: 70px;
  font-weight: 700;
`;

const City = styled.span`
  font-size: 19px;
  font-weight: 600;
`;

const DateText = styled.span`
  /* nowrap: at 24px the date broke onto two lines on the 1024x600 panel */
  font-size: 20px;
  font-weight: 500;
  white-space: nowrap;
`;

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const hour = time.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const date = time.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <ClockContainer>
      <Time>{hour}</Time>
      <DateCity>
        <City>Cachan</City>
        <DateText>{date}</DateText>
      </DateCity>
    </ClockContainer>
  );
}
