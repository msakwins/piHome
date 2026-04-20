/* eslint-env node */
const stopId = '44493'; // Bagneux
export default async function handler(req, res) {
  const monitoringRef = `STIF:StopArea:SP:${stopId}:`

  const url = `https://prim.iledefrance-mobilites.fr/marketplace/stop-monitoring?MonitoringRef=${monitoringRef}`

  try {
    const response = await fetch(url, {
      headers: {
        apikey: process.env.IDFM_API_KEY,
      },
    })

    const data = await response.json()

    const visits =
      data?.Siri?.ServiceDelivery?.StopMonitoringDelivery?.[0]?.MonitoredStopVisit

    res.status(200).json(visits || [])
  } catch (error) {
    console.error('Error fetching IDFM data:', error)
    res.status(500).json([])
  }
}