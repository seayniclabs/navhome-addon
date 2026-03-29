# NavHome Home Assistant add-on

Custom repository URL (Home Assistant → Settings → Add-ons → Add-on store → ⋮ → Repositories):

`https://github.com/seayniclabs/navhome-addon`

## CI secret (required)

The SPA is in the private repo **seayniclabs/navhome**. **`GITHUB_TOKEN` cannot check out other private repos** in the org, so checkout fails with “Not Found” until **`NAVHOME_REPO_PAT`** can read that repo.

- **Fine-grained PAT:** Contents **Read** on **seayniclabs/navhome** (and nothing else if you like). Paste as repo secret **`NAVHOME_REPO_PAT`**.
- **Classic `ghp_` token:** must include access to **private org repos** (narrow classic PATs often get **404** on `seayniclabs/navhome` — verify with  
  `curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer <token>" https://api.github.com/repos/seayniclabs/navhome` → expect **200**).
- **Quick unblock:** `gh auth token | gh secret set NAVHOME_REPO_PAT --repo seayniclabs/navhome-addon` (OAuth token may expire; prefer a PAT for CI).

Re-run **Publish add-on images** after updating the secret.

## GHCR visibility

Supervisor pulls images **without** logging in to GitHub. For each package **`navhome-ha-<arch>`**, set **Package settings → Change package visibility → Public** (org/repo admins), or HA installs will get **401** on pull.

## Ingress Web UI is white

The add-on server rewrites `/_app/…` in HTML to **`/app/<id>_<slug>/_app/…`** using container **`HOSTNAME`** (`2f8061d9-navhome` → `/app/2f8061d9_navhome`). If that ever mismatches your HA URL bar, set env **`NAVHOME_HA_APP_BASE`** on the add-on (same path as in the browser, no trailing slash).

## Images

GitHub Actions builds **per-architecture** images and pushes them to GHCR. The add-on `config.yaml` sets:

`image: ghcr.io/seayniclabs/navhome-ha-{arch}`

Supervisor substitutes `{arch}` and pulls the tag that matches the `version` field in `config.yaml` (for example `0.1.4`).

After changing `version` in `config.yaml`, push to `main` and wait for **Publish add-on images** to finish before users hit **Update** in Home Assistant.

## Local build (optional)

Clone the app next to the add-on server files (not committed — see `.gitignore`):

```bash
git clone https://github.com/seayniclabs/navhome.git navhome/app
docker buildx build --platform linux/arm64 --build-arg BUILD_FROM=ghcr.io/home-assistant/aarch64-base:3.19 -t navhome:test ./navhome
```
