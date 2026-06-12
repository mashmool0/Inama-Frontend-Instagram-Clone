# Folder Structure

```
src/
├── app/                          # Next.js file-based routing
│   ├── (auth)/                   # Unauthenticated routes — no navbar
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-otp/
│   │   ├── set-username/         # Required after first signup
│   │   └── reset-password/
│   └── (main)/                   # Authenticated routes — has navbar
│       ├── feed/
│       ├── explore/
│       ├── search/
│       ├── notifications/
│       ├── profile/[username]/
│       └── posts/[id]/
│
├── features/                     # One folder per domain — core of the app
│   ├── auth/
│   ├── posts/
│   ├── feed/
│   ├── profiles/
│   ├── notifications/
│   └── search/
│   └── each feature has:
│       ├── api.ts                # API calls for this feature only
│       ├── hooks.ts              # React Query hooks
│       └── components/           # UI components specific to this feature
│
├── components/                   # Shared UI — no feature logic
│   ├── ui/                       # Button, Input, Avatar, Modal, Spinner
│   └── layout/                   # Navbar, BottomNav, AuthGuard
│
├── lib/
│   ├── api-client.ts             # Axios instance — JWT injection, 401 handling
│   └── query-client.ts           # React Query global config
│
└── types/                        # Shared TypeScript types
    ├── user.ts
    ├── post.ts
    └── notification.ts
```

## Rules

- A page/component never calls `fetch` or `axios` directly — always through a hook.
- A hook in `features/X/hooks.ts` never imports from `features/Y/` — no cross-feature coupling.
- Shared UI in `components/ui/` has zero business logic — only visual.
- All HTTP calls go through `lib/api-client.ts` — never create a second axios instance.
