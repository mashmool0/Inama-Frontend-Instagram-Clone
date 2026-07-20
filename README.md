# Inama Frontend

The frontend for Inama, an Instagram-style social platform. It is a Next.js App Router application written in TypeScript and designed to call the backend through one HTTP API Gateway.

## Current status

The UI contains landing, authentication, feed, explore, post, profile, notification, and search screens. The frontend is structurally ready for the backend contract, but the backend repository is still being built in phases. In particular, the current Posts, Feed, and Search backend containers are health-endpoint scaffolds, and some frontend paths currently use `/profiles/...` while the gateway exposes `/users/...`. Full end-to-end feature behavior therefore requires the API contracts and implementations to be aligned.

## Run locally

Requirements:

- Node.js 20 or newer
- npm
- A running backend API Gateway, normally at `http://localhost:8080`

From this directory:

```bash
npm ci
npm run dev
```

Create `.env.local` with:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Open [http://localhost:3000](http://localhost:3000).

`NEXT_PUBLIC_API_URL` is public and is read by the browser bundle. Restart the dev server after changing it.

## Run with Docker

Development container with hot reload:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Production-style standalone container:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080 docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). To use another frontend host port:

```bash
FRONTEND_PORT=3001 docker compose up --build
```

The production image bakes `NEXT_PUBLIC_API_URL` in during `docker compose build`; rebuild after changing it. The container health check is available at [http://localhost:3000/api/health](http://localhost:3000/api/health).

Stop the container with:

```bash
docker compose down
# or, for development:
docker compose -f docker-compose.dev.yml down
```

## Verify and test

There are currently no frontend unit or integration test files. Use the following checks:

```bash
npm run typecheck
npm run lint
npm run build
```

Run the production server after a successful build:

```bash
npm run start
```

Check the local application health endpoint:

```bash
curl -i http://localhost:3000/api/health
```

At the time of writing, the repository does not pass all of these checks: typecheck/build report existing auth hook and request-type mismatches, and the `lint` script is still `next lint`, which is not a valid command in the installed Next.js 16 release. These are implementation follow-ups, not startup requirements.

For an integration smoke test, start the backend stack, open the app, and verify navigation through landing → register/login → feed → profile → notifications. A successful frontend health response only proves that Next.js is running; it does not prove that the backend routes are available.

## How the frontend works

The browser enters through `src/app`, which uses Next.js file-based routing. Routes are grouped into:

- `src/app/(auth)` — landing, login, registration, OTP, username setup, and password reset.
- `src/app/(main)` — authenticated feed, explore, search, notifications, profiles, posts, create-post, and settings screens.

Each page delegates actual UI to a domain feature under `src/features`:

| Feature | Responsibility |
|---|---|
| `auth` | Register, login, OTP, refresh/password reset, username setup, auth state |
| `feed` | Home feed and explore infinite lists |
| `posts` | Create/read/delete posts, likes, comments |
| `profiles` | Profile display/editing, follow relationships, followers/following |
| `notifications` | Cursor-paginated notifications and read actions |
| `search` | User, hashtag, and text search |

The normal request path is:

```text
Page → feature hook → feature api.ts → lib/api-client.ts → API Gateway → backend service
```

`lib/api-client.ts` creates the single Axios client, reads `NEXT_PUBLIC_API_URL`, adds the JWT bearer token from the Zustand auth store, and clears the session on a 401 response. TanStack Query supplies caching, mutations, and cursor-based infinite queries. Shared visual components live in `src/components`; shared types live in `src/types`.

## Authentication flow

1. Registration stores pending phone/registration data in the browser session and sends the user to OTP verification.
2. Successful login or OTP verification stores access and refresh tokens in the Zustand store.
3. Requests automatically receive `Authorization: Bearer <access-token>`.
4. Authenticated routes are wrapped by `AuthGuard`; unauthenticated users are redirected to `/login`.
5. A 401 clears the local session and redirects the user to sign in again.

## Routes

| Route | Screen |
|---|---|
| `/` | Landing page |
| `/login`, `/register`, `/verify-otp`, `/set-username`, `/reset-password` | Authentication |
| `/feed`, `/explore`, `/search`, `/notifications` | Main social views |
| `/create` | Create post |
| `/posts/[id]` | Post details and comments |
| `/profile/[username]`, `/profile/edit`, `/settings` | Profile and account settings |
| `/api/health` | Next.js health response |

## Project structure

```text
src/
├── app/          # Next.js routes and layouts
├── features/     # Domain API functions, hooks, and feature components
├── components/   # Shared UI and layout components
├── lib/          # Axios client, session, formatting, React Query setup
├── styles/       # Global and theme styles
└── types/        # Shared TypeScript models
```

More detailed notes are in [`docs/`](./docs/): [`architecture.md`](./docs/architecture.md), [`data-flow.md`](./docs/data-flow.md), [`folder-structure.md`](./docs/folder-structure.md), and [`build-order.md`](./docs/build-order.md).

## Troubleshooting

- API requests go to the wrong host: set `NEXT_PUBLIC_API_URL` and restart/rebuild.
- Browser CORS errors: ensure the backend gateway allows `http://localhost:3000`.
- Backend is running but screens fail: compare frontend paths in `src/features/*/api.ts` with gateway routes; the repositories are currently not fully aligned.
- Port 3000 is busy: use `FRONTEND_PORT=3001` for the frontend, or change the backend Grafana host mapping.
