# Data Flow

## How a user action reaches the backend

```
User clicks "Like"
  → LikeButton component calls useLikePost() hook
    → hook calls likePost() from features/posts/api.ts
      → api.ts calls lib/api-client.ts (Axios)
        → Axios adds JWT header automatically
          → HTTP POST /posts/:id/like → API Gateway → Posts Service
```

The page/component has zero knowledge of HTTP. It only calls hooks.

## Cursor-Based Pagination

Backend returns 20 items + a `next_cursor` string.
React Query's `useInfiniteQuery` chains them:

```
First load  → GET /feed
              ← { posts: [...], next_cursor: "abc123" }

Scroll down → GET /feed?cursor=abc123
              ← { posts: [...], next_cursor: "def456" }

Scroll down → GET /feed?cursor=def456
              ← { posts: [...], next_cursor: null }  ← end of feed
```

The component calls `fetchNextPage()` on scroll. React Query handles the rest.

## Auth Token Flow

1. User logs in → backend returns JWT
2. JWT stored in Zustand store (`features/auth/store.ts`)
3. Every request: `api-client.ts` interceptor reads token from store → adds header
4. 401 response: interceptor clears token → redirects to login
5. Page refresh: token must be rehydrated from localStorage (handled in auth store)
