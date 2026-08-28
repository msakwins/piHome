// Vercel serverless function: proxy for Île-de-France Mobilités stop-monitoring.
//
// Why this exists rather than calling PRIM straight from the browser:
//   1. CORS - prim.iledefrance-mobilites.fr does not allow browser origins, and the
//      custom `apikey` header forces a preflight the API refuses.
//   2. Secrecy - a VITE_-prefixed variable is inlined into the public bundle at build
//      time, so the key would be readable by anyone. IDFM_API_KEY has no VITE_ prefix
//      and therefore stays server-side.

const IDFM_BASE = 'https://prim.iledefrance-mobilites.fr/marketplace';
const STOP_ID = '44493'; // Bagneux

export default async function handler(_req, res) {
  const apiKey = process.env.IDFM_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'IDFM_API_KEY is not configured on the server' });
  }

  const monitoringRef = `STIF:StopArea:SP:${STOP_ID}:`;
  const url = `${IDFM_BASE}/stop-monitoring?MonitoringRef=${encodeURIComponent(monitoringRef)}`;

  try {
    const upstream = await fetch(url, { headers: { apikey: apiKey } });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `IDFM returned ${upstream.status}` });
    }

    const data = await upstream.json();
    const visits =
      data?.Siri?.ServiceDelivery?.StopMonitoringDelivery?.[0]?.MonitoredStopVisit ?? [];

    // The wall display refreshes every 90s; cache at the edge so several viewers
    // (or a reloading kiosk) don't each hit the upstream API.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    return res.status(200).json(visits);
  } catch {
    return res.status(502).json({ error: 'Failed to reach IDFM' });
  }
}
