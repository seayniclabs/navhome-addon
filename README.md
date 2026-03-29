# NavHome Home Assistant add-on

Custom repository URL (Home Assistant → Settings → Add-ons → Add-on store → ⋮ → Repositories):

`https://github.com/seayniclabs/navhome-addon`

## Images

GitHub Actions builds **per-architecture** images and pushes them to GHCR. The add-on `config.yaml` sets:

`image: ghcr.io/seayniclabs/navhome-ha-{arch}`

Supervisor substitutes `{arch}` and pulls the tag that matches the `version` field in `config.yaml` (for example `0.1.2`).

The NavHome SPA lives in the private repo **seayniclabs/navhome**. Actions checks it out before `docker build` using `NAVHOME_REPO_PAT` if set, otherwise `GITHUB_TOKEN`. If checkout fails with 404, add a fine-grained PAT (contents read on `navhome`) as repo secret **`NAVHOME_REPO_PAT`**, or allow workflows in this repo to read other private org repos (org **Settings → Actions**).

After changing `version` in `config.yaml`, push to `main` and wait for **Publish add-on images** to finish before users hit **Update** in Home Assistant.

## Local build (optional)

Clone the app next to the add-on server files (not committed — see `.gitignore`):

```bash
git clone https://github.com/seayniclabs/navhome.git navhome/app
docker buildx build --platform linux/arm64 --build-arg BUILD_FROM=ghcr.io/home-assistant/aarch64-base:3.19 -t navhome:test ./navhome
```
