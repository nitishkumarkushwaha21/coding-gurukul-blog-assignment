# Blog Management System - Pending Items Only

Date: 2026-04-23
Repository: https://github.com/nitishkumarkushwaha21/coding-gurukul-blog-assignment

## What Is Left

1. Add live demo URL in docs
- README still has a placeholder for the production demo link.

2. Run and verify Postgres schema on Neon
- Apply `postgres-schema.sql` to Neon and confirm CRUD reads/writes from DB in runtime.

3. Production hardening for DB operations
- Add migration/seed scripts.
- Add minimal retry and observability/logging around DB writes.

4. Resolve local production build reliability issue
- Current local Windows environment has intermittent `spawn UNKNOWN` / font fetch failures on `npm run build`.

5. Commit and push pending repository changes
- Working tree still has modified/untracked files that need final commit and push.

## Not In Scope (By Request)

1. Authentication/authorization for admin routes (intentionally not implemented).
