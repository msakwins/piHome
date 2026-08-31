# Pi provisioning

Everything here lives on the Raspberry Pi rather than in the deployed web app.
Kept in the repo so the wall display can be rebuilt from scratch instead of
relying on one SD card.

Target: Raspberry Pi Zero 2 W, Raspberry Pi OS Trixie (arm64), 1024x600 HDMI
panel, no keyboard or mouse.

## Files

| File | Goes to |
|---|---|
| `scd41.py`, `service.py` | `~/sensor/` |
| `set_temperature_offset.py` | `~/sensor/` (run manually) |
| `pihome-kiosk.sh` | `/usr/local/bin/` (mode 755) |
| `systemd/pihome-*.{service,timer}` | `/etc/systemd/system/` |
| `systemd/pihome-kiosk-limits.conf` | `/etc/systemd/system/pihome-kiosk.service.d/limits.conf` |
| `chromium-policy.json` | `/etc/chromium/policies/managed/pihome.json` |

## Setup

```bash
sudo raspi-config nonint do_i2c 0        # SCD41 is on I2C
sudo apt install -y cage i2c-tools grim
python3 -m venv ~/sensor-env && ~/sensor-env/bin/pip install smbus2
sudo systemctl disable --now getty@tty1  # it fights cage for the console
sudo systemctl enable --now pihome-sensor.service pihome-kiosk.service pihome-refresh.timer
```

`i2cdetect -y 1` should show the sensor at `62`.

## Wiring

| SCD41 | Pi header |
|---|---|
| VCC | pin 1 (3V3 — **not** pin 2/4, 5 V would drive 5 V into the GPIO) |
| SDA | pin 3 |
| SCL | pin 5 |
| GND | pin 9 |

## Gotchas, each of which broke this completely

- **`--no-memcheck`** is mandatory. Raspberry Pi OS's `/usr/bin/chromium` is a
  wrapper that pops a "less than 1GB of RAM" dialog and blocks forever waiting
  for a click. Fatal with no input devices.
- **`WLR_LIBINPUT_NO_DEVICES=1`** — wlroots refuses to start with zero input
  devices.
- **Never `TTYVHangup=yes`** in the unit; it SIGHUPs the service's own process.
- **`getty@tty1` must be disabled** or it fights cage for the console.
- **`LocalNetworkAccessChecks` must be merged into the existing
  `--disable-features`**, not added as a second one — the last flag wins, and a
  duplicate silently drops the earlier list. Without it Chromium shows an
  unclickable "wants to access other apps and services" prompt when the HTTPS
  page reads the local sensor endpoint.
- The panel reports **no EDID**; 1024x600 is its real resolution. Under
  `vc4-kms-v3d` the legacy `hdmi_*` options do nothing — a mode needs `video=`
  on the kernel command line.
- Power-on to a painted dashboard is roughly **2 minutes**. A white screen for
  the first ~100 s is normal Chromium cold start.
