# Changelog

## 0.1.7

- **Ingress navigation 404:** SPA used `goto('/report')`, which the browser resolves to **`/report`** at the HA origin (wrong). All in-app navigations now use **`goto(resolve(…))`** from **`$app/paths`** so paths stay under the rewritten SvelteKit **`base`** (e.g. `/api/hassio_ingress/<token>/…`). Rebuilt from **navhome** app commit including this fix.

## 0.1.6

- **Ingress white screen:** resolve the asset prefix **per HTTP request** from **`X-Ingress-Path`** (`/api/hassio_ingress/<token>`, set by Home Assistant Core on proxied requests). Supervisor’s Docker **`HOSTNAME`** is usually the add-on **slug** (`navhome`), not `xxxxxxxx-slug`, so the previous env-only `/app/…` guess often stayed empty and `/_app/…` kept hitting the HA host root (404).
- Fallbacks: **`Referer`** parsing for `/app/<8hex>_<slug>`, then **`HOSTNAME`** only when it matches `xxxxxxxx-…`. Removed **`SUPERVISOR_TOKEN`** as a trigger for `/app/${slug}` (wrong path). Optional **`NAVHOME_HA_APP_BASE`** unchanged.
- HTML rewrite: also handle single-quoted `href` / `import('\/_app/…`.

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
