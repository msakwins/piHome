"""Reads the SCD41 continuously and serves the latest sample as JSON.

Only one process can drive the sensor, so this owns the I2C bus and everything
else asks over HTTP. Bound to localhost because the only consumer is the kiosk
browser running on this same Pi.
"""
import json
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from smbus2 import SMBus

import scd41

HOST, PORT = "127.0.0.1", 8765
READ_INTERVAL = 5.0

_lock = threading.Lock()
_state = {"co2": None, "temperature": None, "humidity": None, "timestamp": None, "ok": False}


def _publish(reading=None):
    with _lock:
        if reading is None:
            _state["ok"] = False
        else:
            _state.update(reading)
            _state["timestamp"] = time.strftime("%Y-%m-%dT%H:%M:%S%z")
            _state["ok"] = True


def reader_loop():
    while True:
        try:
            with SMBus(scd41.BUS) as bus:
                scd41.start(bus)
                # First sample lands ~5s after starting periodic measurement.
                time.sleep(READ_INTERVAL)
                while True:
                    time.sleep(READ_INTERVAL)
                    if scd41.data_ready(bus):
                        _publish(scd41.read(bus))
        except Exception as exc:
            # A dropped sample is normal; keep the last good value visible and
            # mark it stale rather than tearing the dashboard down.
            print("sensor error, restarting loop:", exc, flush=True)
            _publish(None)
            time.sleep(3)


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.rstrip("/") not in ("/sensor", ""):
            self.send_error(404)
            return
        with _lock:
            body = json.dumps(_state).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        # The page is served from Vercel, so it is a different origin.
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    threading.Thread(target=reader_loop, daemon=True).start()
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
