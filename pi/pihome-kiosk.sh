#!/bin/bash
# Launched by cage. Waits for connectivity and a sane clock, then runs Chromium.

URL="${PIHOME_URL:-https://niokipi.vercel.app/}"
PROFILE_DIR="$HOME/.local/share/pihome-chromium"
mkdir -p "$PROFILE_DIR"

# Kill the "Chromium didn't shut down properly" restore bar after a power cut.
PREFS="$PROFILE_DIR/Default/Preferences"
if [ -f "$PREFS" ]; then
  sed -i 's/"exit_type":"[^"]*"/"exit_type":"Normal"/'     "$PREFS" 2>/dev/null || true
  sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' "$PREFS" 2>/dev/null || true
fi

# network-online.target is optimistic on Wi-Fi; verify the app really answers.
for _ in $(seq 1 60); do
  curl -sf -o /dev/null --max-time 5 "$URL" && break
  sleep 2
done

# No battery-backed clock here, and the dashboard shows time and gates the
# train panel on the hour, so give NTP a short chance before rendering.
for _ in $(seq 1 15); do
  [ "$(timedatectl show -p NTPSynchronized --value 2>/dev/null)" = "yes" ] && break
  sleep 2
done

# --no-memcheck is consumed by the Raspberry Pi OS launcher script itself. Without
# it the launcher pops a zenoty "less than 1GB of RAM" dialog and blocks forever
# waiting for a click - fatal on a headless wall display with no input devices.
exec /usr/bin/chromium \
  --no-memcheck \
  --unsafely-treat-insecure-origin-as-secure=http://127.0.0.1:8765 \
  --ozone-platform=wayland \
  --kiosk \
  --start-fullscreen \
  --window-size=1024,600 \
  --window-position=0,0 \
  --user-data-dir="$PROFILE_DIR" \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --disable-session-crashed-bubble \
  --hide-crash-restore-bubble \
  --disable-features=Translate,TranslateUI,LocalNetworkAccessChecks,PrivateNetworkAccessPermissionPrompt \
  --check-for-update-interval=31536000 \
  --disable-component-update \
  --disable-breakpad \
  --disable-background-networking \
  --password-store=basic \
  --autoplay-policy=no-user-gesture-required \
  --disable-pinch \
  --overscroll-history-navigation=0 \
  --renderer-process-limit=1 \
  "$URL"
