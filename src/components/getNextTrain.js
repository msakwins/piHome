// API KEY: Oiy3tBJUI6aRR9fdLEBSYYY7CjgHaOYK

const apiKey = 'Oiy3tBJUI6aRR9fdLEBSYYY7CjgHaOYK';
const stopId = '44493'; // Bagneux

export const getNextTrain = async () => {
    const monitoringRef = `STIF:StopArea:SP:${stopId}:`;
    
    const url = `https://prim.iledefrance-mobilites.fr/marketplace/stop-monitoring?MonitoringRef=${monitoringRef}`;

    try {
        const response = await fetch(url, {
            headers: { 'apikey': apiKey }
        });
        const data = await response.json();
        
        // Extraction
        const visits = data?.Siri?.ServiceDelivery?.StopMonitoringDelivery?.[0]?.MonitoredStopVisit;
        
        return visits || []; 
    } catch (error) {
        console.error('Error fetching IDFM data:', error);
        return [];
    }
}