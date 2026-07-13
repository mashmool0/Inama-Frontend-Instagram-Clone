# Inama Frontend

Frontend for Inama — an Instagram-like social platform.

Built with Next.js + React. Communicates with a microservices backend through a single API Gateway.

## Tech Stack

| | |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Data fetching | TanStack Query (React Query) |
| Global state | Zustand |
| Forms | React Hook Form |
| HTTP client | Axios |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Docker

Build and run with Docker Compose:

```bash
docker compose up --build
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

If your API Gateway is not on the default address, set it before building:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080 docker compose up --build
```

Notes:

- `NEXT_PUBLIC_API_URL` is a client-side variable, so it is baked into the frontend bundle at image build time.
- If you change `NEXT_PUBLIC_API_URL`, rebuild the image with `docker compose up --build`.
- Container health is exposed at `/api/health`.

## Docs

See the [`docs/`](./docs/) folder:

- [`architecture.md`](./docs/architecture.md) — system overview, backend services, tech decisions
- [`folder-structure.md`](./docs/folder-structure.md) — what goes where and why
- [`data-flow.md`](./docs/data-flow.md) — how a user action reaches the backend
- [`build-order.md`](./docs/build-order.md) — the order features are built in

## Project Structure

```
src/
├── app/          # Pages and routes
├── features/     # Feature modules (auth, posts, feed, profiles, notifications, search)
├── components/   # Shared UI components
├── lib/          # API client, React Query config
└── types/        # Shared TypeScript types
```
