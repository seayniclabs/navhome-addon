# Changelog

## 0.1.5

- **Store card:** replace invalid **`icon.png`** (was an 11-byte text stub) with a real 128×128 PNG from the NavHome brand SVG. Reload the custom repo in HA if the icon stays broken (cache).

- SPA: fetch **`${base}/api/ha-config`** (was `/api/ha-config`, which hit HA Core under Ingress).
- Server: derive `/app/…` asset prefix from **`HOSTNAME`** when it looks like an HA add-on (`xxxxxxxx-…`), not only when `SUPERVISOR_TOKEN` is set.

## 0.1.4

- Fix **white Web UI under Ingress**: rewrite `index.html` asset URLs from `/_app/...` to `/app/<hostname-with-underscores>/_app/...` (HA opens `/app/2f8061d9_navhome` while the SPA referenced the HA host root). Optional override: env **`NAVHOME_HA_APP_BASE`**.

## 0.1.3

- Dockerfile: build SPA on `BUILDPLATFORM` (always amd64 on GitHub Actions) so `npm run build` does not run on emulated arm32 — fixes lightningcss `linux-arm-musl` missing on armv7/armhf.

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
