# Hostinger deployment — api.kunglass.in

## Verified application layout

This repository contains separate `frontend/` (Next.js) and `backend/` (Express)
applications. Set the backend service's root directory to **`backend`**.

- Source entry: `backend/src/server.ts` (TypeScript).
- Compiler: `backend/tsconfig.json`, `rootDir: ./src`, `outDir: ./dist`,
  `include: [src/**/*]`, `module: Node16`, `moduleResolution: Node16`.
- Verified compiled entry: `backend/dist/server.js`.
- No `backend/server.js`, `backend/index.js`, or `backend/src/index.ts` exists.
- `dist/` is ignored build output, not a committed source directory.
- Existing package scripts are already correct: `build: tsc`,
  `start: node dist/server.js`, `main: dist/server.js`.

## Required hPanel changes

The current `Build command: none` / `Entry file: server.js` settings cannot run
this TypeScript application. Installing dependencies does not compile it.
No source-code wrapper or duplicate `server.js` is needed.

In the Node.js application's Git deployment/build settings, use:

| Setting | Value |
| --- | --- |
| Repository | `Mayur111-code/KunGlassesweb` |
| Production branch | `main` |
| Application root | `backend` |
| Node.js | `22.x` |
| Build command (custom) | `npm ci --include=dev && npm run build` |
| Start command, if provided | `npm start` |
| Entry file, if required | `dist/server.js` |

All commands and the entry-file path above are relative to the **backend root**.
If the UI has a separate install command, set it to `npm ci --include=dev` and
set the build command to `npm run build`. TypeScript is a dev dependency, so it
must be installed during the build even with `NODE_ENV=production`.
Do not run `npm ci --omit=dev` before compilation.

Save the settings, retain the existing environment variables, and redeploy.
The entry is generated during the build; it is not expected to exist in Git.
If the UI refuses to select a generated file or still reports “Build command:
none”, inspect its custom build/output settings or contact Hostinger support
with the source/output paths above. Do not rename or copy an unrelated file to
bypass entry validation. These dashboard settings cannot be changed by this
repository's package scripts alone; no Hostinger deployment manifest was found.

## Environment (keep existing secrets)

- `NODE_ENV=production` is required on Hostinger for production cookie behavior.
- `PORT`: the server uses the host-provided value, with local fallback `5000`.
  Retain the port assigned by Hostinger; ensure its routing targets that port.
- `MONGODB_URI`: existing production MongoDB connection string. The API waits
  for MongoDB to connect before listening; verify Atlas network access from the
  host and the database user's permissions if startup fails.
- `JWT_SECRET`: existing strong secret; do not rotate it as part of this fix.
- `JWT_EXPIRES_IN`: supported; default `7d`.
- `JWT_COOKIE_EXPIRES_IN`: supported; default `7` days.
- `CLIENT_URL`: exact HTTPS frontend origin, or comma-separated origins. Include
  every actual frontend origin in use (for example the apex and/or www origin,
  and the Vercel deployment if still used). Do not set it to the API domain
  unless that domain actually serves the frontend. No paths/trailing slashes.
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`: retain
  all three existing values. Missing configuration disables uploads, not startup.
- Optional email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`,
  `FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL`.
- Optional tuning: `BCRYPT_ROUNDS`, `MAX_UPLOAD_FILES`,
  `MONGO_SERVER_SELECTION_TIMEOUT_MS`, `MONGO_CONNECT_TIMEOUT_MS`,
  `MONGO_SOCKET_TIMEOUT_MS`.

Use HTTPS for the API domain: production authentication cookies use
`HttpOnly; SameSite=None; Secure`. Existing proxy trust and CORS remain unchanged.
Do not paste secrets into build logs or commit a real `.env`.

## Verification and rollout

Local verification on Node 22.22.3:

1. `npm ci --include=dev` — passed, lockfile unchanged.
2. `npm run build` — passed; `dist/server.js` exists.
3. `npm start` — compiled entry loads; fails with required `JWT_SECRET` absent.
4. With disposable local runtime settings — reaches MongoDB connection, then
   exits because no MongoDB is running locally. This is not a successful full
   production startup, but confirms the entry-file error is resolved by building.
5. Isolated compiled Express app (without connecting MongoDB): health endpoint
   returns 200/production; configured CORS origin and credentials pass; an
   unconfigured origin gets 403; unauthenticated auth/service/project write
   requests get 401; secure production cookie options verified.
6. No real MongoDB, ImageKit, SMTP or Hostinger dashboard access was available.
   Database-backed reads, successful login, uploads and deployed startup remain
   unverified. No records or assets were modified.

After deployment check `https://api.kunglass.in/api/health`: expect HTTP 200,
`status: ok`, and `environment: production`. The deployed health route becomes
available only after the normal startup path connects to MongoDB.
Then verify `/api/services/public`, `/api/projects/public`, a real admin login,
and an upload from the configured frontend. Check that cookie-bearing requests
work from that frontend. Do not seed or reset the database to test deployment.

## Separate dependency follow-up

`npm audit` during verification reported **3 vulnerable packages: 2 high,
1 moderate** (advisories may change):

| Installed package | Relationship | Finding / next step |
| --- | --- | --- |
| `body-parser@1.20.8` | Transitive through `express@4.22.3` | High, compressed-body denial of service; advisory GHSA-27r3-jxmh-p828; fixed range starts at 1.20.9. Review compatible Express/body-parser lockfile updates and test request parsing. |
| `nodemailer@10.0.12` | Direct | Moderate address-parser recipient-confusion advisories GHSA-8c8m-p3m8-cjg8, GHSA-m943-m63m-w62w, GHSA-85x2-q946-cp5h; fixed range starts at 10.1.4. Test SMTP/address behavior after a compatible update. |
| `zod@3.25.76` | Direct | High oversized-collection memory exhaustion; GHSA-mrhx-c7xc-m3w5. Audit proposes 4.6.7 (major upgrade); requires a separate validator compatibility review. |

`multer@1.4.5-lts.2` also emits a deprecation/security warning recommending
2.x. It is not counted as one of the three packages above by this audit run.
Review multipart parsing, limits, middleware types and ImageKit uploads before
upgrading. Other installation deprecations include dev-tool dependencies
`inflight`, `glob@7`, and `rimraf@2`.

No dependency versions were changed and no `npm audit fix --force` was run.
