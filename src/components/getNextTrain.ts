const IDFM_API_BASE = 'https://prim.iledefrance-mobilites.fr/marketplace';

export const getNextTrain = async (): Promise<any[]> => {
  const stopId = '44493'; // Bagneux
  const monitoringRef = `STIF:StopArea:SP:${stopId}:`;
  const url = `${IDFM_API_BASE}/stop-monitoring?MonitoringRef=${encodeURIComponent(monitoringRef)}`;

  try {
    const response = await fetch(url, {
      headers: {
        apikey: import.meta.env.VITE_IDFM_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    console.log('IDFM API Response:', data);

    const visits =
      data?.Siri?.ServiceDelivery?.StopMonitoringDelivery?.[0]?.MonitoredStopVisit;

    return visits || [];
  } catch (error) {
    console.error('Error fetching IDFM data:', error);
    return [];
  }
};