# thegamerlink — agent notes

## What this app is
Frontend-only Vite + React 19 app (`react-router-dom` for routes: `/`, `/jobs`, `/login`).
No backend, no database, no external services, no environment variables or credentials.
`src/pages/Jobs.jsx` lists hard-coded mock jobs behind a 1s `setTimeout`, so the "Loading
active listings..." state is expected for a moment — it does not call any API.

## Running it
```sh
docker compose -f docker-compose.base44.yml up -d --build
```
- `web` (node:22) runs `npm ci` then `npx vite --host 0.0.0.0 --port 3000` from the
  bind-mounted repo, on host port 3000. Edits hot-reload.
- `node_modules` lives in the named volume `node_modules` (not the checkout), so the
  host tree stays clean; the container re-syncs it from `package-lock.json` on every start.
- `CHOKIDAR_USEPOLLING=1` is set because bind mounts in the sandbox miss inotify events.

## Sandbox overrides
- `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed through from the platform so Vite
  accepts the preview proxy host (`<port>-<sandbox id>.$BASE44_SANDBOX_HOST_DOMAIN`).
  Vite >= 6.1 appends this variable to `server.allowedHosts` itself, so `vite.config.js`
  needed no change. With the variable unset, Vite behaves exactly as it does outside the
  sandbox.
- `BASE44_PREVIEW_MODE` is forwarded but currently unused by the app.

## Verifying
- `curl -sf http://localhost:3000/` returns the dev HTML with `/@vite/client` and
  `/src/main.jsx` (unhashed) — that is how you know live source is being served.
- Check the three routes render, then `npm run lint` (oxlint) and `npm run build` inside
  the container:
  `docker compose -f docker-compose.base44.yml exec -T web npx oxlint`
