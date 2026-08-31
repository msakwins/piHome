"""Minimal SCD4x driver. The sensor speaks a handful of 16-bit commands over
I2C, each word followed by a CRC8 byte, so a full library is overkill here."""
import time
from smbus2 import SMBus, i2c_msg

ADDR = 0x62
BUS = 1

CMD_STOP = 0x3F86
CMD_START = 0x21B1
CMD_DATA_READY = 0xE4B8
CMD_READ = 0xEC05


def _crc8(data: bytes) -> int:
    crc = 0xFF
    for byte in data:
        crc ^= byte
        for _ in range(8):
            crc = ((crc << 1) ^ 0x31) & 0xFF if crc & 0x80 else (crc << 1) & 0xFF
    return crc


def _send(bus, cmd):
    # The SCD4x NACKs any transaction while it is mid-measurement, which shows up
    # as OSError(EIO). That is normal traffic, not a fault, so retry briefly.
    for attempt in range(8):
        try:
            bus.i2c_rdwr(i2c_msg.write(ADDR, [cmd >> 8, cmd & 0xFF]))
            return
        except OSError:
            if attempt == 7:
                raise
            time.sleep(0.05)


def _read_words(bus, cmd, count, delay=0.001):
    _send(bus, cmd)
    time.sleep(delay)
    read = i2c_msg.read(ADDR, count * 3)
    for attempt in range(8):
        try:
            bus.i2c_rdwr(read)
            break
        except OSError:
            if attempt == 7:
                raise
            time.sleep(0.05)
    raw = bytes(read)
    words = []
    for i in range(count):
        hi, lo, crc = raw[i * 3], raw[i * 3 + 1], raw[i * 3 + 2]
        if _crc8(bytes([hi, lo])) != crc:
            raise IOError("CRC mismatch from SCD41")
        words.append((hi << 8) | lo)
    return words


def start(bus):
    _send(bus, CMD_STOP)
    time.sleep(0.5)
    _send(bus, CMD_START)


def data_ready(bus):
    # Bottom 11 bits zero means "not ready yet".
    return (_read_words(bus, CMD_DATA_READY, 1)[0] & 0x07FF) != 0


def read(bus):
    co2, t_raw, rh_raw = _read_words(bus, CMD_READ, 3)
    return {
        "co2": co2,
        "temperature": round(-45 + 175 * t_raw / 65535, 1),
        "humidity": round(100 * rh_raw / 65535, 1),
    }


if __name__ == "__main__":
    with SMBus(BUS) as bus:
        start(bus)
        print("started, waiting for first sample (~5s)...")
        for _ in range(30):
            time.sleep(1)
            if data_ready(bus):
                print(read(bus))
                break
        else:
            print("no data ready after 30s")
