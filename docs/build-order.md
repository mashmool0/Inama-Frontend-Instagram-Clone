# Build Order

Features are built in this order — each one depends on the previous.

## 1. Infrastructure (no UI)
- `lib/api-client.ts` — Axios instance, JWT injection, 401 handler
- `lib/query-client.ts` — React Query setup
- `features/auth/store.ts` — Zustand store for token + current user

## 2. Auth
- Login → OTP verify → set username → redirect to feed
- Password reset flow
- AuthGuard component (redirect to login if no token)

## 3. Shared UI Components
- Button, Input, Avatar, Spinner, Modal
- Navbar, BottomNav
- These are needed before building any real page

## 4. Feed
- The first real screen users see
- Infinite scroll with cursor-based pagination
- Renders PostCard (from posts feature)

## 5. Posts
- PostCard component (used in feed, explore, profile)
- Post detail page
- Create post
- Like / unlike
- Comments

## 6. Profiles
- View profile (own and others)
- Edit own profile
- Follow / unfollow
- Followers / following lists

## 7. Notifications
- Notifications list
- Mark as read
- Unread badge on navbar

## 8. Explore
- Same as feed but different API call
- Simple grid layout

## 9. Search
- Search bar
- Results: users + hashtags
