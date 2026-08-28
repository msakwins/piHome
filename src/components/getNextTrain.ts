// Departures come from our own /api/trains serverless function, not straight from
// IDFM. Calling PRIM from the browser cannot work: it sends no CORS headers, and the
// key would have to be a VITE_ variable, which Vite inlines into the public bundle.
export const getNextTrain = async (): Promise<any[]> => {
  try {
    const response = await fetch('/api/trains');

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching train data:', error);
    return [];
  }
};
