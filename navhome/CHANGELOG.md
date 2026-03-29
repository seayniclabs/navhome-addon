# Changelog

## 0.1.2

- CI: check out private `seayniclabs/navhome` into `navhome/app` instead of cloning inside Docker (fixes `git clone` exit 128 on GitHub Actions).
- CI: require repo secret **`NAVHOME_REPO_PAT`** — `GITHUB_TOKEN` cannot read sibling private repos.
- Drop **i386** — `node:22-alpine` has no `linux/386` variant, so that arch could not build.

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
