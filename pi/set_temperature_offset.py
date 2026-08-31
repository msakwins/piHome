"""Set the SCD4x temperature offset.

The sensor self-heats, so it reads high. The offset is subtracted from the raw
reading before the sensor reports it; it ships at 4.0 C. To calibrate: let the
board run for at least 10 minutes, compare its reading with a trusted
thermometer in the same spot, and add the difference to the current offset.

    new_offset = current_offset + (sensor_reading - real_temperature)

Usage:  python set_temperature_offset.py            # show current offset
        python set_temperature_offset.py 6.4        # set, verify, persist
"""
import sys
import time

from smbus2 import SMBus, i2c_msg

import scd41

CMD_SET_OFFSET = 0x241D
CMD_GET_OFFSET = 0x2318
CMD_PERSIST = 0x3615


def _word_to_celsius(word: int) -> float:
    return word * 175 / 65535


def _celsius_to_word(celsius: float) -> int:
    return round(celsius * 65535 / 175)


def get_offset(bus) -> float:
    return _word_to_celsius(scd41._read_words(bus, CMD_GET_OFFSET, 1)[0])


def set_offset(bus, celsius: float) -> None:
    word = _celsius_to_word(celsius)
    payload = [word >> 8, word & 0xFF]
    payload.append(scd41._crc8(bytes(payload)))
    bus.i2c_rdwr(i2c_msg.write(scd41.ADDR, [CMD_SET_OFFSET >> 8, CMD_SET_OFFSET & 0xFF] + payload))
    time.sleep(0.02)


def main() -> None:
    with SMBus(scd41.BUS) as bus:
        # Both commands require idle mode.
        scd41._send(bus, scd41.CMD_STOP)
        time.sleep(0.6)

        current = get_offset(bus)
        print(f"current offset: {current:.2f} C")

        if len(sys.argv) < 2:
            return

        target = float(sys.argv[1])
        set_offset(bus, target)
        print(f"read back:      {get_offset(bus):.2f} C")

        # EEPROM has a limited write budget, so only persist a deliberate change.
        scd41._send(bus, CMD_PERSIST)
        time.sleep(0.9)
        print("persisted to EEPROM")


if __name__ == "__main__":
    main()
