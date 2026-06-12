# Architecture

## What This App Is

Instagram-like social platform. Frontend is Next.js + React talking to a single API Gateway that routes to backend microservices.

## Request Flow

```
Browser (Next.js)
      │
      ▼
   Nginx          ← serves static files, reverse proxy
      │
      ▼
 API Gateway      ← JWT verification, rate limiting, routing (Go)
      │
      ├── Auth Service          (FastAPI)
      ├── Posts + Interactions  (Go)
      ├── User / Social Graph   (Go)
      ├── Feed + Explore        (Go)
      ├── Notifications         (Go)
      └── Search Indexer        (FastAPI)
```

The frontend never talks to individual services — only to the API Gateway.

## How Frontend Talks to Backend

- Protocol: REST + JSON
- Auth: JWT Bearer token in `Authorization` header — injected automatically by `lib/api-client.ts`
- Pagination: cursor-based (not page numbers)

## Backend → Frontend Feature Map

| Backend Service       | Frontend Feature                          |
|-----------------------|-------------------------------------------|
| Auth                  | Login, Register, OTP, Password Reset      |
| User / Social Graph   | Profile page, Follow, Followers/Following |
| Posts + Interactions  | Post card, Create post, Like, Comments    |
| Feed + Explore        | Home feed (infinite scroll), Explore page |
| Notifications         | Notifications list, mark as read          |
| Search Indexer        | Search by username and hashtag            |

## Key Architecture Decisions

| Decision | Choice |
|---|---|
| Data fetching + caching | TanStack Query (React Query) |
| Styling | Tailwind CSS |
| Global auth state | Zustand |
| Forms | React Hook Form |
| HTTP client | Axios |
| Routing | Next.js App Router |
