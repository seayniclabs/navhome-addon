# NavHome Home Assistant add-on

Custom repository URL (Home Assistant → Settings → Add-ons → Add-on store → ⋮ → Repositories):

`https://github.com/seayniclabs/navhome-addon`

## CI secret (required)

The SPA is in the private repo **seayniclabs/navhome**. **`GITHUB_TOKEN` cannot check out other private repos** in the org, so builds fail with “Not Found” until you add:

1. GitHub → **Settings → Developer settings → Fine-grained personal access tokens** → token with **Contents: Read** on **seayniclabs/navhome** only.
2. Repo **navhome-addon** → **Settings → Secrets and variables → Actions** → **New repository secret** → name **`NAVHOME_REPO_PAT`**, value = that token.

Then re-run **Publish add-on images** (Actions tab).

## Images

GitHub Actions builds **per-architecture** images and pushes them to GHCR. The add-on `config.yaml` sets:

`image: ghcr.io/seayniclabs/navhome-ha-{arch}`

Supervisor substitutes `{arch}` and pulls the tag that matches the `version` field in `config.yaml` (for example `0.1.2`).

After changing `version` in `config.yaml`, push to `main` and wait for **Publish add-on images** to finish before users hit **Update** in Home Assistant.

## Local build (optional)

Clone the app next to the add-on server files (not committed — see `.gitignore`):

```bash
git clone https://github.com/seayniclabs/navhome.git navhome/app
docker buildx build --platform linux/arm64 --build-arg BUILD_FROM=ghcr.io/home-assistant/aarch64-base:3.19 -t navhome:test ./navhome
```
