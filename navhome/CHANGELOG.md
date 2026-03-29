# Changelog

## 0.1.1

- Pre-built images on GHCR (`ghcr.io/seayniclabs/navhome-ha-{arch}`) so installs **pull** instead of compiling on the device.
- `hassio_api: true` so Supervisor injects `SUPERVISOR_TOKEN` for zero-config HA discovery in add-on mode.

## 0.1.0

- Initial release
- Connect to Home Assistant via Supervisor API (zero-config)
- Migration Readiness Report with device scanning
- Guided walkthroughs for lights, plugs, thermostats, locks
- Automation starter templates
- Nabu Casa recommendation with non-affiliation disclosure
